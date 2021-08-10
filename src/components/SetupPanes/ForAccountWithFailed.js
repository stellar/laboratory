import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import ForAccount from "./ForAccount";
import BooleanPicker from "../FormComponents/BooleanPicker";

export default function ForAccountWithFailed(props) {
  return (
    <ForAccount {...props}>
      <OptionsTablePair label="Include failed">
        <BooleanPicker
          value={props.values["include_failed"]}
          onUpdate={(value) => {
            props.onUpdate("include_failed", value);
          }}
          key="include_failed"
        />
      </OptionsTablePair>
    </ForAccount>
  );
}
