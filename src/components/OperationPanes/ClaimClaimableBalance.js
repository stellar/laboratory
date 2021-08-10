import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker.js";

export default function ClaimClaimableBalance(props) {
  return [
    <OptionsTablePair label="Claimable Balance ID" key="balanceId">
      <TextPicker
        value={props.values["balanceId"]}
        onUpdate={(value) => {
          props.onUpdate("balanceId", value);
        }}
      />
    </OptionsTablePair>,
  ];
}
