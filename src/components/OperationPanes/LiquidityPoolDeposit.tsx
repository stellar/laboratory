import OptionsTablePair from "components/OptionsTable/Pair.js";
import TextPicker from "components/FormComponents/TextPicker.js";
import AmountPicker from "components/FormComponents/AmountPicker.js";
import { NumberFractionPicker } from "components/FormComponents/NumberFractionPicker";
import { NumberFractionValue } from "types/types";

interface LiquidityPoolDepositProps {
  values: {
    liquidityPoolId: string;
    maxAmountA: string;
    maxAmountB: string;
    minPrice: string | number | NumberFractionValue;
    maxPrice: string | number | NumberFractionValue;
  };
  onUpdate: (key: string, value: string | number | NumberFractionValue) => void;
}

export const LiquidityPoolDeposit = (props: LiquidityPoolDepositProps) => {
  return [
    <OptionsTablePair label="Liquidity Pool ID" key="liquidityPoolId">
      <TextPicker
        value={props.values["liquidityPoolId"]}
        onUpdate={(value: string) => {
          props.onUpdate("liquidityPoolId", value);
        }}
        placeholder="Example: 67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9"
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Max Amount A" key="maxAmountA">
      <AmountPicker
        value={props.values["maxAmountA"]}
        onUpdate={(value: string) => {
          props.onUpdate("maxAmountA", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Max Amount B" key="maxAmountB">
      <AmountPicker
        value={props.values["maxAmountB"]}
        onUpdate={(value: string) => {
          props.onUpdate("maxAmountB", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Min Price" key="minPrice">
      <NumberFractionPicker
        value={props.values["minPrice"]}
        onUpdate={(value) => {
          props.onUpdate("minPrice", value);
        }}
      />
      <p className="optionsTable__pair__content__note">
        Minimum depositA/depositB price.
      </p>
    </OptionsTablePair>,
    <OptionsTablePair label="Max Price" key="maxPrice">
      <NumberFractionPicker
        value={props.values["maxPrice"]}
        onUpdate={(value) => {
          props.onUpdate("maxPrice", value);
        }}
      />
      <p className="optionsTable__pair__content__note">
        Maximum depositA/depositB price.
      </p>
    </OptionsTablePair>,
  ];
};
