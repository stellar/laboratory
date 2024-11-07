import { LOCAL_STORAGE_SAVED_KEYPAIRS } from "@/constants/settings";
import { SavedKeypair } from "@/types/types";

export const localStorageSavedKeypairs = {
  get: () => {
    const savedKeypairsString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_KEYPAIRS,
    );
    return savedKeypairsString
      ? (JSON.parse(savedKeypairsString) as SavedKeypair[])
      : [];
  },
  set: (savedKeypairs: SavedKeypair[]) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_KEYPAIRS,
      JSON.stringify(savedKeypairs),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_KEYPAIRS);
  },
};
