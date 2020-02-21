import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import PubKeyPicker from "../FormComponents/PubKeyPicker.js";
import AssetPicker from "../FormComponents/AssetPicker.js";
import AmountPicker from "../FormComponents/AmountPicker.js";
import AssetMultiPicker from "../FormComponents/AssetMultiPicker.js";

export default function FindStrictReceivePaymentPaths({ values, onUpdate }) {
  return (
    <div>
      <OptionsTablePair label="Source Account">
        <PubKeyPicker
          value={values["source_account"]}
          onUpdate={(value) => {
            onUpdate("source_account", value);
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Source Assets">
        <AssetMultiPicker
          stringForm
          value={
            values["source_assets"] === undefined
              ? []
              : // Filter out empty strings from resulting array.
                // ''.split(',') produces ['']
                values["source_assets"].split(",").filter(Boolean)
          }
          onUpdate={(value) => {
            onUpdate("source_assets", value.join(","));
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Destination Amount">
        <AmountPicker
          value={values["destination_amount"]}
          onUpdate={(value) => {
            onUpdate("destination_amount", value);
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Destination Asset">
        <AssetPicker
          value={values["destination_asset"]}
          onUpdate={(value) => {
            onUpdate("destination_asset", value);
          }}
        />
      </OptionsTablePair>
    </div>
  );
}
