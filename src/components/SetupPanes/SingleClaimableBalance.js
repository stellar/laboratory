import React from "react";
import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker.js";

export default function SingleClaimableBalance(props) {
  return (
    <div>
      <OptionsTablePair label="Claimable Balance ID">
        <TextPicker
          value={props.values["claimable_balance_id"]}
          onUpdate={(value) => {
            props.onUpdate("claimable_balance_id", value);
          }}
        />
      </OptionsTablePair>
    </div>
  );
}
