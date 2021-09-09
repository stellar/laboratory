import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker";
import AmountPicker from "../FormComponents/AmountPicker.js";

interface LiquidityPoolWithdrawProps {
  values: {
    liquidityPoolId: string;
    amount: string;
    minAmountA: string;
    minAmountB: string;
  };
  onUpdate: (key: string, value: string) => void;
}

export const LiquidityPoolWithdraw = (props: LiquidityPoolWithdrawProps) => {
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
    <OptionsTablePair label="Amount" key="amount">
      <AmountPicker
        value={props.values["amount"]}
        onUpdate={(value: string) => {
          props.onUpdate("amount", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Min Amount A" key="minAmountA">
      <AmountPicker
        value={props.values["minAmountA"]}
        onUpdate={(value: string) => {
          props.onUpdate("minAmountA", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Min Amount B" key="minAmountB">
      <AmountPicker
        value={props.values["minAmountB"]}
        onUpdate={(value: string) => {
          props.onUpdate("minAmountB", value);
        }}
      />
    </OptionsTablePair>,
  ];
};
