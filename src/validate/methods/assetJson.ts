import { isEmptyObject } from "@/helpers/isEmptyObject";
import { JsonAsset } from "@/types/types";
import { assetCode } from "./assetCode";
import { publicKey } from "./publicKey";

// Validate asset in XDR or JSON format
export const assetJson = (asset: JsonAsset | undefined) => {
  if (!asset || asset === "native") {
    return false;
  }

  const type = Object.keys(asset)[0] as keyof typeof asset;
  const values = asset[type] as {
    asset_code: string;
    issuer: string;
  };

  const invalid = Object.entries({
    code: assetCode(values.asset_code || "", type),
    issuer: publicKey(values.issuer || ""),
  }).reduce((res, cur) => {
    const [key, value] = cur;

    if (value) {
      return { ...res, [key]: value };
    }

    return res;
  }, {});

  return isEmptyObject(invalid) ? false : invalid;
};
