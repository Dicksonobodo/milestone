import { useEffect, useState } from "react";
import { getUser, getTransactions } from "../firebase/firestore";
import { useAuth } from "./useAuth";

const initialState = {
  uid: null,
  userData: null,
  transactions: [],
  error: "",
  cursor: null,
  hasMore: false,
};

export const useUser = () => {
  const { currentUser } = useAuth();
  const [state, setState] = useState(initialState);
  const [loadingMore, setLoadingMore] = useState(false);
  const [paginationError, setPaginationError] = useState("");

  useEffect(() => {
    if (!currentUser) return undefined;

    let active = true;
    const uid = currentUser.uid;

    Promise.all([getUser(uid), getTransactions(uid)])
      .then(([userData, page]) => {
        if (active) {
          setState({
            uid,
            userData,
            transactions: page.transactions,
            error: "",
            cursor: page.cursor,
            hasMore: page.hasMore,
          });
        }
      })
      .catch((fetchError) => {
        if (!active) return;
        console.error("Unable to load account activity.", fetchError);
        setState({
          uid,
          userData: null,
          transactions: [],
          error: "Impossibile caricare i dati del conto. Riprova più tardi.",
          cursor: null,
          hasMore: false,
        });
      });

    return () => {
      active = false;
    };
  }, [currentUser]);

  const isCurrentUserData = state.uid === currentUser?.uid;

  const loadMore = async () => {
    if (!currentUser || !isCurrentUserData || !state.hasMore || loadingMore) return;

    setLoadingMore(true);
    setPaginationError("");
    try {
      const page = await getTransactions(currentUser.uid, 50, state.cursor);
      setState((previous) =>
        previous.uid === currentUser.uid
          ? {
              ...previous,
              transactions: [...previous.transactions, ...page.transactions],
              cursor: page.cursor,
              hasMore: page.hasMore,
            }
          : previous,
      );
    } catch (fetchError) {
      console.error("Unable to load more account activity.", fetchError);
      setPaginationError("Impossibile caricare altri movimenti. Riprova.");
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    userData: isCurrentUserData ? state.userData : null,
    transactions: isCurrentUserData ? state.transactions : [],
    loading: Boolean(currentUser) && !isCurrentUserData,
    error: isCurrentUserData ? state.error : "",
    hasMore: isCurrentUserData && state.hasMore,
    loadMore,
    loadingMore,
    paginationError,
  };
};
