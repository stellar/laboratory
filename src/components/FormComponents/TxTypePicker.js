/**
 * @prettier
 */
import React from "react";
import RadioButtonPicker from "./RadioButtonPicker";
import TX_TYPES from "../../constants/transaction_types";

export default function TxTypePicker(props) {
  const { onUpdate, value } = props;
  return (
    <div>
      <RadioButtonPicker
        className="picker--spaceBottom"
        onUpdate={onUpdate}
        value={value}
        items={{
          [TX_TYPES.REGULAR]: "Transaction",
          [TX_TYPES.FEE_BUMP]: "Fee Bump",
        }}
      />
    </div>
  );
}
