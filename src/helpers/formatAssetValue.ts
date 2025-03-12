import {
  AssetObjectValue,
  AssetPoolShareObjectValue,
  AssetSinglePoolShareValue,
} from "@/types/types";

export const formatAssetValue = (
  asset:
    | AssetObjectValue
    | AssetPoolShareObjectValue
    | AssetSinglePoolShareValue,
): any => {
  console.log("[formatAssetValue] asset:", asset);
  console.log("[formatAssetValue] typeof asset:", typeof asset);
  let formattedAsset;

  if (asset.type === "native") {
    formattedAsset = "native";
  } else if (
    asset.type &&
    ["credit_alphanum4", "credit_alphanum12"].includes(asset.type)
  ) {
    const assetValue = asset as AssetObjectValue;

    formattedAsset = {
      [asset.type]: {
        asset_code: assetValue.code,
        issuer: assetValue.issuer,
      },
    };
  } else if (asset.type === "liquidity_pool_shares") {
    const assetPoolSharesValue = asset as AssetPoolShareObjectValue;

    formattedAsset = {
      pool_share: {
        liquidity_pool_constant_product: {
          asset_a: formatAssetValue(assetPoolSharesValue.asset_a),
          asset_b: formatAssetValue(assetPoolSharesValue.asset_b),
          fee: 30,
        },
      },
    };
  } else if (asset.type === "pool_share") {
    const assetPoolShareValue = asset as AssetSinglePoolShareValue;

    formattedAsset = {
      pool_share: assetPoolShareValue.pool_share,
    };
  }

  return formattedAsset;
};
