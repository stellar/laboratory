import { LOCAL_STORAGE_SAVED_WALLET } from "@/constants/settings";
import { SavedWallet } from "@/types/types";

export const localStorageSavedWallet = {
  get: () => {
    const savedWalletString = localStorage.getItem(LOCAL_STORAGE_SAVED_WALLET);
    return savedWalletString
      ? (JSON.parse(savedWalletString) as SavedWallet)
      : null;
  },
  set: (savedWallet: SavedWallet) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_WALLET,
      JSON.stringify(savedWallet),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_WALLET);
  },
};
