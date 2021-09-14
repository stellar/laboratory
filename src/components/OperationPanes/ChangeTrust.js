import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import AssetPicker from "../FormComponents/AssetPicker.js";
import AmountPicker from "../FormComponents/AmountPicker";

export default function ChangeTrust(props) {
  return [
    <OptionsTablePair label="Asset" key="asset">
      <AssetPicker
        value={props.values["asset"]}
        disableNative={true}
        onUpdate={(value) => {
          props.onUpdate("asset", value);
        }}
        includeLiquidityPoolShares
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Trust Limit" optional="true" key="limit">
      <AmountPicker
        value={props.values["limit"]}
        onUpdate={(value) => {
          props.onUpdate("limit", value);
        }}
      />
      <p className="optionsTable__pair__content__note">
        Leave empty to default to the max int64.
        <br />
        Set to 0 to remove the trust line.
      </p>
    </OptionsTablePair>,
  ];
}
