import { LOCAL_STORAGE_SAVED_RPC_METHODS } from "@/constants/settings";
import { SavedRpcMethod } from "@/types/types";

export const localStorageSavedRpcMethods = {
  get: () => {
    const savedMethodsString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_RPC_METHODS,
    );
    return savedMethodsString
      ? (JSON.parse(savedMethodsString) as SavedRpcMethod[])
      : [];
  },
  set: (savedRpcMethods: SavedRpcMethod[]) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_RPC_METHODS,
      JSON.stringify(savedRpcMethods),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_RPC_METHODS);
  },
};
