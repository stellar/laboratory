import { LOCAL_STORAGE_SAVED_CONTRACTS } from "@/constants/settings";
import { SavedContract } from "@/types/types";

export const localStorageSavedContracts = {
  get: () => {
    const savedContractsString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_CONTRACTS,
    );
    return savedContractsString
      ? (JSON.parse(savedContractsString) as SavedContract[])
      : [];
  },
  set: (savedContracts: SavedContract[]) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_CONTRACTS,
      JSON.stringify(savedContracts),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_CONTRACTS);
  },
};
