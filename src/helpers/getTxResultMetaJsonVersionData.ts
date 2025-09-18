import { AnyObject } from "@/types/types";

export const getTxResultMetaJsonVersionData = (resultMetaJson: AnyObject) => {
  // From P23 and later it will be v4.
  // Transactions before the P23 upgrade will be v3.
  return resultMetaJson?.v4 || resultMetaJson?.v3;
};
