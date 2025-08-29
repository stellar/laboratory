import { LOCAL_STORAGE_SAVED_KEYPAIRS } from "@/constants/settings";
import { decryptJson, encryptJson } from "@/helpers/jsonCipher";
import { SavedKeypair } from "@/types/types";

export const localStorageSavedKeypairs = {
  get: () => {
    const savedKeypairsString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_KEYPAIRS,
    );

    if (!savedKeypairsString) {
      return [];
    }

    // For backwards compatibility, try to parse JSON first
    try {
      return JSON.parse(savedKeypairsString) as SavedKeypair[];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return decryptJson<SavedKeypair[]>(savedKeypairsString) || [];
    }
  },
  set: (savedKeypairs: SavedKeypair[]) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_KEYPAIRS,
      encryptJson(savedKeypairs),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_KEYPAIRS);
  },
};
