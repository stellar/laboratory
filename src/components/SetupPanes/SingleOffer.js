import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker.js";

export default function SingleOffer({ values, onUpdate }) {
  return (
    <OptionsTablePair label="Offer ID">
      <TextPicker
        value={values.offer_id}
        onUpdate={(value) => {
          onUpdate("offer_id", value);
        }}
      />
    </OptionsTablePair>
  );
}
