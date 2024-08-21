import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { OptionSigner } from "@/types/types";

import { getAccountThresholdError } from "./getAccountThresholdError";
import { getPublicKeyError } from "./getPublicKeyError";

export const getOptionsSignerError = (signer: OptionSigner | undefined) => {
  if (!signer || !signer?.type) {
    return false;
  }

  const error: { key: string | boolean; weight: string | boolean } = {
    key: "",
    weight: getAccountThresholdError(signer?.weight || ""),
  };

  switch (signer.type) {
    case "ed25519PublicKey":
      error.key = signer.key ? getPublicKeyError(signer.key) : "";
      break;
    case "sha256Hash":
    case "preAuthTx":
      error.key = signer.key ? hasValidator(signer.key) : "";
      break;
    default:
    // Do nothing
  }

  const sanitized = sanitizeObject(error);

  return isEmptyObject(sanitized) ? false : sanitized;
};

const hasValidator = (value: string) => {
  if (!value.match(/^[0-9a-f]{64}$/gi)) {
    return "Accepts a 32-byte hash in hexadecimal format (64 characters).";
  }

  return false;
};
