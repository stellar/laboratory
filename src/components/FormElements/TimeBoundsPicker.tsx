import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { InputSideElement } from "@/components/InputSideElement";
import { PositiveIntPicker } from "./PositiveIntPicker";

type TimeBoundValue = {
  min_time: string;
  max_time: string;
};

type TimeBoundsPickerProps = {
  id: string;
  value: TimeBoundValue;
  labelSuffix?: string | React.ReactNode;
  onChange: (value: TimeBoundValue) => void;
  error: { min_time: string | false; max_time: string | false } | undefined;
  infoLink?: string;
  infoText?: string | React.ReactNode;
};

export const TimeBoundsPicker = ({
  id,
  value = { min_time: "", max_time: "" },
  labelSuffix,
  onChange,
  error,
  infoLink,
  infoText,
}: TimeBoundsPickerProps) => {
  return (
    <Box gap="sm">
      <Box gap="xs">
        <PositiveIntPicker
          id={`${id}-min-time`}
          label="Time Bounds"
          labelSuffix={labelSuffix}
          placeholder="Lower time bound unix timestamp. Ex: 1479151713"
          value={value?.min_time?.toString() || ""}
          error={error?.min_time ? `Lower time bound: ${error.min_time}` : ""}
          onChange={(e) => {
            onChange({
              ...value,
              min_time: e.target.value,
            });
          }}
          infoLink={infoLink}
          infoText={infoText}
        />
        <PositiveIntPicker
          id={`${id}-max-time`}
          label=""
          placeholder="Upper time bound unix timestamp. Ex: 1479151713"
          value={value?.max_time?.toString() || ""}
          error={error?.max_time ? `Upper time bound: ${error.max_time}` : ""}
          onChange={(e) => {
            onChange({
              ...value,
              max_time: e.target.value,
            });
          }}
          rightElement={
            <InputSideElement
              variant="button"
              placement="right"
              onClick={() => {
                onChange({
                  ...value,
                  max_time: (
                    Math.ceil(new Date().getTime() / 1000) +
                    5 * 60
                  ).toString(),
                });
              }}
            >
              Set to 5 min from now
            </InputSideElement>
          }
        />
      </Box>
      <Box gap="xs" addlClassName="FieldNote FieldNote--note FieldNote--md">
        <div>
          Enter{" "}
          <SdsLink href="http://www.epochconverter.com/">
            unix timestamp
          </SdsLink>{" "}
          values of time bounds when this transaction will be valid.
        </div>

        <div>
          For regular transactions, it is highly recommended to set the upper
          time bound to get a{" "}
          <SdsLink href="https://github.com/stellar/stellar-core/issues/1811">
            final result
          </SdsLink>{" "}
          of a transaction in a defined time.
        </div>
      </Box>
    </Box>
  );
};
