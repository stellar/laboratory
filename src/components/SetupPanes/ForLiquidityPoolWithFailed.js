import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import ForLiquidityPool from "./ForLiquidityPool";
import BooleanPicker from "../FormComponents/BooleanPicker";

export default function ForLiquidityPoolWithFailed(props) {
  return (
    <ForLiquidityPool {...props}>
      <OptionsTablePair label="Include failed">
        <BooleanPicker
          value={props.values["include_failed"]}
          onUpdate={(value) => {
            props.onUpdate("include_failed", value);
          }}
          key="include_failed"
        />
      </OptionsTablePair>
    </ForLiquidityPool>
  );
}
