import { isEmptyObject } from "@/helpers/isEmptyObject";
import { assetCode } from "./assetCode";
import { publicKey } from "./publicKey";

// TODO: remove once other PR is merged
type AssetType =
  | "none"
  | "native"
  | "issued"
  | "credit_alphanum4"
  | "credit_alphanum12"
  | "liquidity_pool_shares";

type AssetObjectValue = {
  type: AssetType | undefined;
  code: string;
  issuer: string;
};

export const asset = (
  asset: string | AssetObjectValue,
  isRequired?: boolean,
) => {
  let code;
  let issuer;
  let type;

  if (typeof asset === "string") {
    // No need to validate native asset
    if (asset === "native") {
      return false;
    }

    [code, issuer] = asset.split(":");
  } else {
    // No need to validate native asset
    if (asset.type === "native") {
      return false;
    }

    code = asset?.code;
    issuer = asset?.issuer;
    type = asset?.type;
  }

  const invalid = Object.entries({
    code: assetCode(code, type, isRequired),
    issuer: publicKey(issuer, isRequired),
  }).reduce((res, cur) => {
    const [key, value] = cur;

    if (value) {
      return { ...res, [key]: value };
    }

    return res;
  }, {});

  return isEmptyObject(invalid) ? false : invalid;
};
