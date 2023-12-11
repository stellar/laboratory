import OptionsTablePair from "components/OptionsTable/Pair.js";
import { LiquidityPoolId } from "components/FormComponents/LiquidityPoolId";
import { AnyObject } from "types/types";

interface SingleLiquidityPoolProps {
  values: AnyObject;
  onUpdate: (key: string, value: string) => void;
}

export const SingleLiquidityPool = (props: SingleLiquidityPoolProps) => (
  <div>
    <OptionsTablePair label="Liquidity Pool ID">
      <LiquidityPoolId
        value={props.values["liquidity_pool_id"]}
        onUpdate={(value) => {
          props.onUpdate("liquidity_pool_id", value);
        }}
      />
    </OptionsTablePair>
  </div>
);
