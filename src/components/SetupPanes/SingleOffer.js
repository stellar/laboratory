import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker.js";

export default function SingleOffer(props) {
  return (
    <OptionsTablePair label="Offer ID">
      <TextPicker
        value={props.values["offer_id"]}
        onUpdate={(value) => {
          props.onUpdate("offer_id", value);
        }}
      />
    </OptionsTablePair>
  );
}
