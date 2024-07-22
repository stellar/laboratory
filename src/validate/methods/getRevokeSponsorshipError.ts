import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { AnyObject, RevokeSponsorshipValue } from "@/types/types";

import { getPublicKeyError } from "./getPublicKeyError";
import { getAssetError } from "./getAssetError";
import { getPositiveIntError } from "./getPositiveIntError";
import { getDataNameError } from "./getDataNameError";
import { getClaimableBalanceIdError } from "./getClaimableBalanceIdError";
import { getOptionsSignerError } from "./getOptionsSignerError";

export const getRevokeSponsorshipError = (
  value: RevokeSponsorshipValue | undefined,
) => {
  if (!value || !value.data) {
    return false;
  }

  const cleanResponse = (validation: AnyObject | boolean) => {
    if (typeof validation === "boolean") {
      return validation;
    }

    const valid = sanitizeObject(validation);
    return isEmptyObject(valid) ? false : valid;
  };

  let response: AnyObject | boolean = false;

  switch (value.type) {
    case "account":
      response = { account_id: getPublicKeyError(value.data.account_id) };
      break;
    case "trustline":
      response = {
        account_id: getPublicKeyError(value.data.account_id),
        asset: getAssetError(value.data.asset),
      };
      break;
    case "offer":
      response = {
        seller_id: getPublicKeyError(value.data.seller_id),
        offer_id: getPositiveIntError(value.data.offer_id || ""),
      };
      break;
    case "data":
      response = {
        account_id: getPublicKeyError(value.data.account_id),
        data_name: getDataNameError(value.data.data_name || ""),
      };
      break;
    case "claimable_balance":
      response = {
        balance_id: getClaimableBalanceIdError(value.data.balance_id),
      };
      break;
    case "signer":
      response = {
        account_id: getPublicKeyError(value.data.account_id),
        signer: getOptionsSignerError(value.data.signer),
      };
      break;
    default:
    // Do nothing
  }

  return cleanResponse(response);
};
