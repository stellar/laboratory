import { LOCAL_STORAGE_SAVED_TRANSACTIONS } from "@/constants/settings";
import { SavedTransaction } from "@/types/types";

export const localStorageSavedTransactions = {
  get: () => {
    const savedTxnString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_TRANSACTIONS,
    );
    return savedTxnString
      ? (JSON.parse(savedTxnString) as SavedTransaction[])
      : [];
  },
  set: (savedTxns: SavedTransaction[]) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_TRANSACTIONS,
      JSON.stringify(savedTxns),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_TRANSACTIONS);
  },
};
