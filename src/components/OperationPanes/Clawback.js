import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import AssetPicker from "../FormComponents/AssetPicker.js";
import PubKeyPicker from "../FormComponents/PubKeyPicker.js";
import AmountPicker from "../FormComponents/AmountPicker.js";

export default function Clawback(props) {
  return [
    <OptionsTablePair label="Asset" key="asset">
      <AssetPicker
        value={props.values["asset"]}
        disableNative={true}
        onUpdate={(value) => {
          props.onUpdate("asset", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="From" key="from">
      <PubKeyPicker
        value={props.values["from"]}
        onUpdate={(value) => {
          props.onUpdate("from", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Amount" key="amount">
      <AmountPicker
        value={props.values["amount"]}
        onUpdate={(value) => {
          props.onUpdate("amount", value);
        }}
      />
    </OptionsTablePair>,
  ];
}
