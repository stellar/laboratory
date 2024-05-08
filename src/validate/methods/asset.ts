import { isEmptyObject } from "@/helpers/isEmptyObject";
import { AssetObjectValue } from "@/types/types";
import { assetCode } from "./assetCode";
import { publicKey } from "./publicKey";

export const asset = (asset: AssetObjectValue | undefined) => {
  if (asset?.type && asset.type === "native") {
    return false;
  }

  const invalid = Object.entries({
    code: assetCode(asset?.code || "", asset?.type),
    issuer: publicKey(asset?.issuer || ""),
  }).reduce((res, cur) => {
    const [key, value] = cur;

    if (value) {
      return { ...res, [key]: value };
    }

    return res;
  }, {});

  return isEmptyObject(invalid) ? false : invalid;
};
