import React from "react";

import For from "./For";
import TextPicker from "../FormComponents/TextPicker";

// TODO: ??? validate Liquidity Pool ID
export default function ForLiquidityPool(props) {
  let label = "Liquidity Pool ID";
  let content = (
    <TextPicker
      value={props.values["liquidity_pool_id"]}
      onUpdate={(value) => {
        props.onUpdate("liquidity_pool_id", value);
      }}
      placeholder="Example: 67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9"
    />
  );

  return <For label={label} content={content} {...props} />;
}
