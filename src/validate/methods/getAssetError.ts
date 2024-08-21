import { isEmptyObject } from "@/helpers/isEmptyObject";
import {
  AssetError,
  AssetObjectValue,
  AssetPoolShareError,
  AssetPoolShareObjectValue,
} from "@/types/types";
import { getAssetCodeError } from "./getAssetCodeError";
import { getPublicKeyError } from "./getPublicKeyError";

export const getAssetError = (
  asset: AssetObjectValue | AssetPoolShareObjectValue | undefined,
): AssetError | AssetPoolShareError | false => {
  if (!asset?.type) {
    return false;
  }

  let invalid = {};

  if (asset?.type === "liquidity_pool_shares") {
    const poolSharesAssetVal = asset as AssetPoolShareObjectValue;

    invalid = Object.entries(poolSharesAssetVal).reduce((res, cur) => {
      const [key, val] = cur;

      if (["asset_a", "asset_b"].includes(key)) {
        const validatedAsset = validateAsset(val as AssetObjectValue);

        return isEmptyObject(validatedAsset)
          ? res
          : { ...res, [key]: validatedAsset };
      }

      return res;
    }, {} as AssetPoolShareError);
  } else {
    invalid = validateAsset(asset as AssetObjectValue);
  }

  return isEmptyObject(invalid) ? false : invalid;
};

const validateAsset = (asset: AssetObjectValue) => {
  if (asset?.type === "native") {
    return {};
  }

  return Object.entries({
    code: getAssetCodeError(asset?.code || "", asset?.type),
    issuer: getPublicKeyError(asset?.issuer || ""),
  }).reduce((res, cur) => {
    const [key, value] = cur;

    if (value) {
      return { ...res, [key]: value };
    }

    return res;
  }, {} as AssetError);
};
