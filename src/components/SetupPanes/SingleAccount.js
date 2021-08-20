import React from "react";
import OptionsTablePair from "../OptionsTable/Pair";
import PubKeyPicker from "../FormComponents/PubKeyPicker";

export default function SingleAccount(props) {
  return (
    <div>
      <OptionsTablePair label="Account ID">
        <PubKeyPicker
          value={props.values["account_id"]}
          onUpdate={(value) => {
            props.onUpdate("account_id", value);
          }}
        />
      </OptionsTablePair>
    </div>
  );
}
