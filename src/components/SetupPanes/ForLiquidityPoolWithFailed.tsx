import OptionsTablePair from "components/OptionsTable/Pair";
import { ForLiquidityPool } from "components/SetupPanes/ForLiquidityPool";
import BooleanPicker from "components/FormComponents/BooleanPicker";
import { AnyObject } from "types/types.d";

interface ForLiquidityPoolWithFailedProps {
  values: AnyObject;
  onUpdate: (key: string, value: string) => void;
}

export const ForLiquidityPoolWithFailed = (
  props: ForLiquidityPoolWithFailedProps,
) => (
  <ForLiquidityPool {...props}>
    <OptionsTablePair label="Include failed">
      <BooleanPicker
        value={props.values["include_failed"]}
        onUpdate={(value: string) => {
          props.onUpdate("include_failed", value);
        }}
        key="include_failed"
      />
    </OptionsTablePair>
  </ForLiquidityPool>
);
