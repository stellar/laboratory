import { xdr as stellarXDR } from "@stellar/stellar-sdk";

const validateBase64 = (value: string) => {
  if (value.match(/^[-A-Za-z0-9+/=]*$/) === null) {
    return "Input is not valid base64";
  }

  return true;
};

export const xdr = (value: string) => {
  let base64Validation = validateBase64(value);
  if (!base64Validation) {
    return base64Validation;
  }

  try {
    stellarXDR.TransactionEnvelope.fromXDR(value, "base64");
    return {
      result: "success",
      message: "Valid Transaction Envelope XDR",
    };
  } catch (e) {
    return {
      result: "error",
      message: "Unable to parse input XDR into Transaction Envelope",
      originalError: e,
    };
  }
};
