import { trim } from "@/helpers/trim";
import { xdr as stellarXDR } from "@stellar/stellar-sdk";

import { XdrType } from "@/types/types";

const validateBase64 = (value: string) => {
  if (value.match(/^[-A-Za-z0-9+/=]*$/) === null) {
    return {
      result: "error",
      message: "The input is not valid base64 (a-zA-Z0-9+/=).",
    };
  }

  return { result: "success", message: "Valid Base64" };
};

export const getXdrError = (value: string, type?: XdrType) => {
  if (!value) {
    return undefined;
  }

  const defaultType = "Transaction Envelope";
  const selectedType = type || defaultType;

  const sanitizedXdr = trim(value);
  const base64Validation = validateBase64(sanitizedXdr);

  if (base64Validation.result !== "success") {
    return base64Validation;
  }

  try {
    if (type === "LedgerKey") {
      stellarXDR.LedgerKey.fromXDR(sanitizedXdr, "base64");
    } else {
      stellarXDR.TransactionEnvelope.fromXDR(sanitizedXdr, "base64");
    }

    // TODO: See, if we can make this response match all the other validations.
    // This is the only exception and might cause issues if we don't remember to
    // handle it.
    return {
      result: "success",
      message: `Valid ${selectedType} XDR`,
    };
  } catch (e) {
    return {
      result: "error",
      message: `Unable to parse input XDR into ${selectedType}`,
      originalError: e,
    };
  }
};
