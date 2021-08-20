import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import PubKeyPicker from "../FormComponents/PubKeyPicker";
import AssetPicker from "../FormComponents/AssetPicker.js";
import AmountPicker from "../FormComponents/AmountPicker.js";
import AssetMultiPicker from "../FormComponents/AssetMultiPicker.js";

export default function FindStrictSendPaymentPaths({ values, onUpdate }) {
  return (
    <div>
      <OptionsTablePair label="Source Amount">
        <AmountPicker
          value={values["source_amount"]}
          onUpdate={(value) => {
            onUpdate("source_amount", value);
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Source Asset">
        <AssetPicker
          value={values["source_asset"]}
          onUpdate={(value) => {
            onUpdate("source_asset", value);
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Destination Assets">
        <AssetMultiPicker
          stringForm
          value={
            values["destination_assets"] === undefined
              ? []
              : // Filter out empty strings from resulting array.
                // ''.split(',') produces ['']
                values["destination_assets"].split(",").filter(Boolean)
          }
          onUpdate={(value) => {
            onUpdate("destination_assets", value.join(","));
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Destination Account">
        <PubKeyPicker
          value={values["destination_account"]}
          onUpdate={(value) => {
            onUpdate("destination_account", value);
          }}
        />
      </OptionsTablePair>
    </div>
  );
}
