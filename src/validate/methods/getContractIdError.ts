import { StrKey } from "@stellar/stellar-sdk";

export const getContractIdError = (value: string) => {
  if (!StrKey.isValidContract(value)) {
    return "Invalid contract ID. Please enter a valid contract ID.";
  }

  return false;
};
