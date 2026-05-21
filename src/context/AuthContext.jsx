import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUser } from "../firebase/firestore";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const data = await getUser(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
      const data = await getUser(currentUser.uid);
      setUserData(data);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, refreshUserData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};