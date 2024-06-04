import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { AnyObject, RevokeSponsorshipValue } from "@/types/types";

import { publicKey } from "./publicKey";
import { asset } from "./asset";
import { positiveInt } from "./positiveInt";
import { dataName } from "./dataName";
import { claimableBalanceId } from "./claimableBalanceId";
import { optionsSigner } from "./optionsSigner";

export const revokeSponsorship = (
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
      response = { account_id: publicKey(value.data.account_id) };
      break;
    case "trustline":
      response = {
        account_id: publicKey(value.data.account_id),
        asset: asset(value.data.asset),
      };
      break;
    case "offer":
      response = {
        seller_id: publicKey(value.data.seller_id),
        offer_id: positiveInt(value.data.offer_id || ""),
      };
      break;
    case "data":
      response = {
        account_id: publicKey(value.data.account_id),
        data_name: dataName(value.data.data_name || ""),
      };
      break;
    case "claimable_balance":
      response = { balance_id: claimableBalanceId(value.data.balance_id) };
      break;
    case "signer":
      response = {
        account_id: publicKey(value.data.account_id),
        signer: optionsSigner(value.data.signer),
      };
      break;
    default:
    // Do nothing
  }

  return cleanResponse(response);
};
