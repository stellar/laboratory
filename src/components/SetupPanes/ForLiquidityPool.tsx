import For from "components/SetupPanes/For";
import { LiquidityPoolId } from "components/FormComponents/LiquidityPoolId";
import { AnyObject } from "types/types.d";

interface ForLiquidityPoolProps {
  values: AnyObject;
  onUpdate: (key: string, value: string) => void;
}

export const ForLiquidityPool = (props: ForLiquidityPoolProps) => (
  <For
    label="Liquidity Pool ID"
    content={
      <LiquidityPoolId
        value={props.values["liquidity_pool_id"]}
        onUpdate={(value) => {
          props.onUpdate("liquidity_pool_id", value);
        }}
      />
    }
    {...props}
  />
);
