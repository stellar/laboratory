import { LOCAL_STORAGE_NETWORK } from "constants/settings";

interface NetworkLocalStorageSaveProps {
  name: string;
  horizonURL?: string;
  networkPassphrase?: string;
}

export const networkLocalStorageSaveValue = (
  values: NetworkLocalStorageSaveProps,
) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_NETWORK, JSON.stringify(values));
  } catch (e) {
    // do nothing
  }
};

export const networkLocalStorageGetValue = () => {
  const value = localStorage.getItem(LOCAL_STORAGE_NETWORK);
  return value ? JSON.parse(value) : null;
};
