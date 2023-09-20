import trim from "lodash/trim";
import * as StellarSdk from "stellar-sdk";
import * as SorobanSdk from "soroban-client";
import { validateBase64 } from "./validateBase64";

export const validateTxXdr = (input: string, isSoroban = false) => {
  let xdr = StellarSdk.xdr;
  if (isSoroban) {
    xdr = SorobanSdk.xdr;
  }
  input = trim(input);

  let base64Validation = validateBase64(input);
  if (base64Validation.result !== "success") {
    return base64Validation;
  }

  try {
    xdr.TransactionEnvelope.fromXDR(input, "base64");
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
