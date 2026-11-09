import { db } from "./config";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

// Get single user
export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// Get all users (admin)
export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
};

// Admin: fund a user account
export const fundUserAccount = async (uid, amount) => {
  await updateDoc(doc(db, "users", uid), {
    balance: increment(Number(amount)),
  });
  await addDoc(collection(db, "users", uid, "transactions"), {
    type: "credit",
    description: "Admin Deposit",
    amount: Number(amount),
    date: serverTimestamp(),
  });
};

// Admin only: upgrade user to tier 2
export const upgradeToTier2 = async (uid) => {
  await updateDoc(doc(db, "users", uid), { tier: 2 });
};

// Admin: delete orphaned Firestore user doc
// Use this to clean up users deleted from Firebase Auth
export const deleteUserDoc = async (uid) => {
  // Delete all transactions subcollection docs first
  const txSnap = await getDocs(collection(db, "users", uid, "transactions"));
  await Promise.all(txSnap.docs.map((d) => deleteDoc(d.ref)));
  // Then delete the user doc itself
  await deleteDoc(doc(db, "users", uid));
};

// Get recent transactions
export const getTransactions = async (uid, pageSize = 50, cursor = null) => {
  const q = query(
    collection(db, "users", uid, "transactions"),
    orderBy("date", "desc"),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(pageSize),
  );
  const snap = await getDocs(q);
  return {
    transactions: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    cursor: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize,
  };
};

// Withdraw funds
export const withdrawFunds = async (uid, amount) => {
  await updateDoc(doc(db, "users", uid), {
    balance: increment(-Number(amount)),
  });
  await addDoc(collection(db, "users", uid, "transactions"), {
    type: "debit",
    description: "Withdrawal",
    amount: Number(amount),
    date: serverTimestamp(),
  });
};