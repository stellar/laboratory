import { Networks } from "@stellar/stellar-sdk";

// Local salt to obscure the data. Do not use this for sensitive data.
const SALT = Networks.TESTNET;

const xorCipher = (str: string, key: string): string => {
  return str
    .split("")
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)),
    )
    .join("");
};

export const encryptJson = (data: object): string => {
  return btoa(xorCipher(JSON.stringify(data), SALT));
};

export const decryptJson = <T>(encryptedData: string): T | null => {
  try {
    return JSON.parse(xorCipher(atob(encryptedData), SALT)) as T;
  } catch (e: any) {
    throw Error("Failed to decrypt JSON data: ", e);
  }
};
