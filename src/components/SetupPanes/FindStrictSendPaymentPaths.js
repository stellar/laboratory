import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import PubKeyPicker from "../FormComponents/PubKeyPicker.js";
import AssetPicker from "../FormComponents/AssetPicker.js";
import AmountPicker from "../FormComponents/AmountPicker.js";
import CanonicalAssetTextPicker from "../FormComponents/CanonicalAssetTextPicker.js";

export default function FindStrictSendPaymentPaths(props) {
  return (
    <div>
      <OptionsTablePair label="Source Amount">
        <AmountPicker
          value={props.values["source_amount"]}
          onUpdate={(value) => {
            props.onUpdate("source_amount", value);
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Source Asset">
        <AssetPicker
          value={props.values["source_asset"]}
          onUpdate={(value) => {
            props.onUpdate("source_asset", value);
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Destination Assets">
        <CanonicalAssetTextPicker
          value={props.values["destination_assets"]}
          onUpdate={(value) => {
            props.onUpdate("destination_assets", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Destination Account">
        <PubKeyPicker
          value={props.values["destination_account"]}
          onUpdate={(value) => {
            props.onUpdate("destination_account", value);
          }}
        />
      </OptionsTablePair>
    </div>
  );
}
