import { Label } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { RadioPicker } from "@/components/RadioPicker";
import { ExpandBox } from "@/components/ExpandBox";
import { TextPicker } from "@/components/FormElements/TextPicker";

import { FractionValue, NumberFractionValue } from "@/types/types";

type NumberFractionPickerProps = {
  id: string;
  value: NumberFractionValue | undefined;
  label: string;
  labelSuffix?: string | React.ReactNode;
  error: string | undefined;
  onChange: (value: NumberFractionValue | undefined) => void;
  note?: string | undefined;
};

export const NumberFractionPicker = ({
  id,
  value,
  label,
  labelSuffix,
  error,
  onChange,
  note,
}: NumberFractionPickerProps) => {
  const renderInputs = () => {
    if (value?.type === "number") {
      const numId = `${id}-number`;
      const val = value.value as string | undefined;

      return (
        <TextPicker
          key={numId}
          id={numId}
          value={val || ""}
          error={error}
          onChange={(e) => {
            onChange({ ...value, value: e.target.value });
          }}
        />
      );
    }

    if (value?.type === "fraction") {
      const fracNumId = `${id}-frac-numerator`;
      const fracDenId = `${id}-frac-denominator`;
      const val = (value?.value || {
        n: undefined,
        d: undefined,
      }) as FractionValue;

      return (
        <Box gap="xs">
          <Box gap="sm" direction="row" align="center" justify="space-between">
            <TextPicker
              key={fracNumId}
              id={fracNumId}
              label="Numerator"
              value={val?.n || ""}
              onChange={(e) => {
                onChange({
                  type: value?.type,
                  value: { ...val, n: e.target.value },
                });
              }}
            />

            <div className="NumberFractionPicker__fraction__divider">/</div>

            <TextPicker
              key={fracDenId}
              id={fracDenId}
              label="Denominator"
              value={val?.d || ""}
              onChange={(e) => {
                onChange({
                  type: value?.type,
                  value: { ...val, d: e.target.value },
                });
              }}
            />
          </Box>

          <>
            {error ? (
              <div className="FieldNote FieldNote--error FieldNote--md">
                {error}
              </div>
            ) : null}
          </>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box gap="sm">
      <Label size="md" labelSuffix={labelSuffix} htmlFor="">
        {label}
      </Label>
      <RadioPicker
        id={id}
        selectedOption={value?.type}
        onChange={(optId) => {
          onChange({
            type: optId,
            value: optId === "fraction" ? { n: undefined, d: undefined } : "",
          });
        }}
        options={[
          { id: "number", label: "Number" },
          { id: "fraction", label: "Fraction" },
        ]}
      />

      <ExpandBox isExpanded={Boolean(value?.type)} offsetTop="sm">
        {renderInputs()}
      </ExpandBox>

      <>
        {note ? (
          <div className="FieldNote FieldNote--note FieldNote--md">{note}</div>
        ) : null}
      </>
    </Box>
  );
};
