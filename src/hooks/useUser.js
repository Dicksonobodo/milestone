import { useEffect, useState } from "react";
import { getUser, getTransactions } from "../firebase/firestore";
import { useAuth } from "./useAuth";

export const useUser = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetch = async () => {
      const data = await getUser(currentUser.uid);
      const txns = await getTransactions(currentUser.uid);
      setUserData(data);
      setTransactions(txns);
      setLoading(false);
    };
    fetch();
  }, [currentUser]);

  return { userData, transactions, loading };
};