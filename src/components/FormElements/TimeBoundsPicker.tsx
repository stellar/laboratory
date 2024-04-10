import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { InputSideElement } from "@/components/InputSideElement";
import { PositiveIntPicker } from "./PositiveIntPicker";

type TimeBoundValue = { min: string; max: string };

type TimeBoundsPickerProps = {
  value: TimeBoundValue | undefined;
  labelSuffix?: string | React.ReactNode;
  onChange: (value: TimeBoundValue) => void;
  error: { min: string | false; max: string | false } | undefined;
};

export const TimeBoundsPicker = ({
  value = { min: "", max: "" },
  labelSuffix,
  onChange,
  error,
}: TimeBoundsPickerProps) => {
  return (
    <Box gap="sm">
      <>
        <Box gap="xs">
          <>
            <PositiveIntPicker
              id="timebounds-min"
              label="Time Bounds"
              labelSuffix={labelSuffix}
              placeholder="Lower time bound unix timestamp. Ex: 1479151713"
              value={value.min}
              error={error?.min ? `Lower time bound: ${error.min}` : ""}
              onChange={(e) => {
                onChange({ ...value, min: e.target.value });
              }}
            />
            <PositiveIntPicker
              id="timebounds-max"
              label=""
              placeholder="Upper time bound unix timestamp. Ex: 1479151713"
              value={value.max}
              error={error?.max ? `Upper time bound: ${error.max}` : ""}
              onChange={(e) => {
                onChange({ ...value, max: e.target.value });
              }}
              rightElement={
                <InputSideElement
                  variant="button"
                  placement="right"
                  onClick={() => {
                    onChange({
                      ...value,
                      max: (
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
          </>
        </Box>
        <Box gap="xs" addlClassName="FieldNote FieldNote--note FieldNote--md">
          <>
            <div>
              Enter{" "}
              <SdsLink href="http://www.epochconverter.com/">
                unix timestamp
              </SdsLink>{" "}
              values of time bounds when this transaction will be valid.
            </div>

            <div>
              For regular transactions, it is highly recommended to set the
              upper time bound to get a{" "}
              <SdsLink href="https://github.com/stellar/stellar-core/issues/1811">
                final result
              </SdsLink>{" "}
              of a transaction in a defined time.
            </div>
          </>
        </Box>
      </>
    </Box>
  );
};
