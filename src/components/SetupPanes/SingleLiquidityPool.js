import React from "react";
import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker";

export default function SingleLiquidityPool(props) {
  return (
    <div>
      <OptionsTablePair label="Liquidity Pool ID">
        <TextPicker
          value={props.values["liquidity_pool_id"]}
          onUpdate={(value) => {
            props.onUpdate("liquidity_pool_id", value);
          }}
          placeholder="Example: 67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9"
        />
      </OptionsTablePair>
    </div>
  );
}
