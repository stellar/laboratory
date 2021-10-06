import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import PubKeyPicker from "../FormComponents/PubKeyPicker";
import TextPicker from "../FormComponents/TextPicker.js";
import RadioButtonPicker from "../FormComponents/RadioButtonPicker.js";
import PickerError from "../FormComponents/PickerError";

export default function AllowTrust(props) {
  return [
    <OptionsTablePair>
      <PickerError message="This operation is deprecated as of Protocol 17. Prefer SetTrustLineFlags instead." />
    </OptionsTablePair>,
    <OptionsTablePair label="Trustor" key="trustor">
      <PubKeyPicker
        value={props.values["trustor"]}
        onUpdate={(value) => {
          props.onUpdate("trustor", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Asset Code" key="assetCode">
      <TextPicker
        value={props.values["assetCode"]}
        onUpdate={(value) => {
          props.onUpdate("assetCode", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Authorize" key="authorize">
      <RadioButtonPicker
        value={props.values["authorize"]}
        onUpdate={(value) => {
          props.onUpdate("authorize", value);
        }}
        items={{
          0: "unauthorized",
          1: "authorized",
          2: "authorized to maintain liabilities",
        }}
      />
    </OptionsTablePair>,
  ];
}
