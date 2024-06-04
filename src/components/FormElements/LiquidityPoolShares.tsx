import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { AssetPicker } from "./AssetPicker";
import {
  AssetObjectValue,
  AssetPoolShareError,
  AssetPoolShareObjectValue,
} from "@/types/types";

type LiquidityPoolSharesProps = {
  id: string;
  value: AssetPoolShareObjectValue;
  error: AssetPoolShareError | undefined;
  onChange: (val: AssetPoolShareObjectValue | undefined) => void;
};

export const LiquidityPoolShares = ({
  id,
  value,
  error,
  onChange,
}: LiquidityPoolSharesProps) => {
  const getAssetValue = (
    val: AssetPoolShareObjectValue | AssetObjectValue | undefined,
  ) => {
    let assetValue: AssetObjectValue = {
      type: undefined,
      code: "",
      issuer: "",
    };

    if (val) {
      assetValue = val as AssetObjectValue;
    }

    return assetValue;
  };

  return (
    <Box gap="sm">
      <AssetPicker
        id={`${id}-asset-a`}
        label="Asset A"
        value={value.asset_a}
        error={error?.asset_a}
        assetInput="alphanumeric"
        onChange={(val) => {
          onChange({ ...value, asset_a: getAssetValue(val) });
        }}
      />

      <AssetPicker
        id={`${id}-asset-b`}
        label="Asset B"
        value={value.asset_b}
        error={error?.asset_b}
        assetInput="alphanumeric"
        onChange={(val) => {
          onChange({ ...value, asset_b: getAssetValue(val) });
        }}
      />

      <PositiveIntPicker
        id={`${id}-fee`}
        label="Fee"
        fieldSize="md"
        value="30"
        error={""}
        note="For now the only fee supported is 30."
        onChange={() => {
          // Do nothing
        }}
        readOnly
      />
    </Box>
  );
};
