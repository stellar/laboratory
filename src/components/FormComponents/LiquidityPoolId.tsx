import TextPicker from "components/FormComponents/TextPicker.js";

interface LiquidityPoolIdProps {
  value: string;
  onUpdate: (key: string, value: string) => void;
}

// TODO: Do we need to validate Liquidity Pool ID?
export const LiquidityPoolId = ({ value, onUpdate }: LiquidityPoolIdProps) => (
  <TextPicker
    value={value}
    onUpdate={onUpdate}
    placeholder="Example: 67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9"
  />
);
