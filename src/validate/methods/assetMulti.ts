import { isEmptyObject } from "@/helpers/isEmptyObject";
import { assetCode } from "./assetCode";
import { publicKey } from "./publicKey";
import { AssetObjectValue } from "@/types/types";
import { sanitizeArray } from "@/helpers/sanitizeArray";

export const assetMulti = (
  assets: AssetObjectValue[] | undefined,
  isRequired?: boolean,
) => {
  const errors = assets?.map((asset) => {
    if (asset?.type && asset.type === "native") {
      return false;
    }

    const invalid = Object.entries({
      code: assetCode(asset?.code || "", asset?.type, isRequired),
      issuer: publicKey(asset?.issuer || "", isRequired),
    }).reduce((res, cur) => {
      const [key, value] = cur;

      if (value) {
        return { ...res, [key]: value };
      }

      return res;
    }, {});

    return isEmptyObject(invalid) ? false : invalid;
  });

  const sanitized = sanitizeArray(errors || []);

  return sanitized.length === 0 ? false : errors;
};
