import { isEmptyObject } from "@/helpers/isEmptyObject";
import { getAssetCodeError } from "./getAssetCodeError";
import { getPublicKeyError } from "./getPublicKeyError";
import { AssetObjectValue } from "@/types/types";
import { sanitizeArray } from "@/helpers/sanitizeArray";

export const getAssetMultiError = (
  assets: AssetObjectValue[] | undefined,
  isRequired?: boolean,
) => {
  const errors = assets?.map((asset) => {
    if (asset?.type && asset.type === "native") {
      return false;
    }

    const invalid = Object.entries({
      code: getAssetCodeError(asset?.code || "", asset?.type, isRequired),
      issuer: getPublicKeyError(asset?.issuer || "", isRequired),
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
