import { useState } from "react";
import RadioButtonPicker from "components/FormComponents/RadioButtonPicker";
import AmountPicker from "components/FormComponents/AmountPicker";
import { NumberFractionValue } from "types/types.d";

enum NumberType {
  NUMBER = "NUMBER",
  FRACTION = "FRACTION",
}

interface NumberFractionPickerProps {
  value: string | number | NumberFractionValue;
  onUpdate: (value: string | number | NumberFractionValue) => void;
}

export const NumberFractionPicker = (props: NumberFractionPickerProps) => {
  const getInitialNumberType = () => {
    if (!props.value) {
      return NumberType.NUMBER;
    }

    if (typeof props.value === "string" || typeof props.value === "number") {
      return NumberType.NUMBER;
    }

    return NumberType.FRACTION;
  };

  const [numberType, setNumberType] = useState(getInitialNumberType());

  const handleSwitch = (typeValue: NumberType) => {
    props.onUpdate("");
    setNumberType(typeValue);
  };

  const renderInputs = () => {
    if (numberType === "FRACTION") {
      return (
        <div className="NumberFractionPicker__fraction">
          <AmountPicker
            value={(props.value as NumberFractionValue)?.n}
            onUpdate={(value: string) => {
              props.onUpdate({
                ...((props.value as NumberFractionValue) || {}),
                n: Number(value),
              });
            }}
            placeholder="Numerator"
          />

          {/* Divider */}
          <span>/</span>

          <AmountPicker
            value={(props.value as NumberFractionValue)?.d}
            onUpdate={(value: string) => {
              props.onUpdate({
                ...((props.value as NumberFractionValue) || {}),
                d: Number(value),
              });
            }}
            placeholder="Denominator"
          />
        </div>
      );
    }

    return <AmountPicker value={props.value} onUpdate={props.onUpdate} />;
  };

  return (
    <div>
      <RadioButtonPicker
        value={numberType}
        onUpdate={handleSwitch}
        className="picker--spaceBottom"
        items={{
          [NumberType.NUMBER]: "Number",
          [NumberType.FRACTION]: "Fraction",
        }}
      />

      {renderInputs()}
    </div>
  );
};
