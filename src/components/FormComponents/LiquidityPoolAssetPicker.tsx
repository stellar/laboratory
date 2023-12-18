import { useState, useEffect } from "react";
import AssetPicker from "components/FormComponents/AssetPicker.js";
import PositiveNumberPicker from "components/FormComponents/PositiveNumberPicker.js";
import { AssetWithType, AnyObject } from "types/types";

interface LiquidityPoolValue {
  assetA: AssetWithType;
  assetB: AssetWithType;
  fee: number;
}

interface LiquidityPoolAssetPickerProps {
  value: LiquidityPoolValue;
  onUpdate: (value: LiquidityPoolValue) => void;
  optional?: AnyObject;
}

export const LiquidityPoolAssetPicker = ({
  value,
  onUpdate,
  optional,
}: LiquidityPoolAssetPickerProps) => {
  const [localState, setLocalState] = useState(value);

  useEffect(() => {
    onUpdate(localState);
  }, [localState]);

  const updateKeyValue = <T extends unknown>(key: string, value: T) => {
    const updatedValue = {
      ...localState,
      [key]: value,
    };

    setLocalState(updatedValue);
  };

  return (
    <div className="LiquidityPoolAssetPicker">
      <div className="LiquidityPoolAssetPicker__label">Asset A</div>
      <div className="LiquidityPoolAssetPicker__item">
        <AssetPicker
          value={localState.assetA}
          onUpdate={(assetAValue: AssetWithType) => {
            updateKeyValue("assetA", assetAValue);
          }}
          optional={optional}
        />
      </div>

      <div className="LiquidityPoolAssetPicker__label">Asset B</div>
      <div className="LiquidityPoolAssetPicker__item">
        <AssetPicker
          value={localState.assetB}
          onUpdate={(assetBValue: AssetWithType) => {
            updateKeyValue("assetB", assetBValue);
          }}
          optional={optional}
        />
      </div>

      <div className="LiquidityPoolAssetPicker__label">Fee</div>
      <div className="LiquidityPoolAssetPicker__item">
        <PositiveNumberPicker
          value={localState.fee}
          onUpdate={(feeValue: string) => {
            updateKeyValue("fee", Number(feeValue));
          }}
        />
        <p className="optionsTable__pair__content__note">
          For now the only fee supported is 30.
        </p>
      </div>
    </div>
  );
};
