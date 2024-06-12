import { Label, Select } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { OptionSigner } from "@/types/types";

type SignerPickerProps = {
  id: string;
  label?: string | React.ReactNode;
  labelSuffix?: string | React.ReactNode;
  value: OptionSigner | undefined;
  error: { key: string | undefined; weight: string | undefined } | undefined;
  onChange: (e: OptionSigner | undefined) => void;
  infoLink?: string;
  infoText?: string | React.ReactNode;
  note?: React.ReactNode;
  excludeWeight?: boolean;
};

export const SignerPicker = ({
  id,
  label,
  labelSuffix,
  value,
  error,
  onChange,
  infoLink,
  infoText,
  note,
  excludeWeight,
}: SignerPickerProps) => {
  const renderKey = () => {
    const keyId = `${id}-${value?.type}`;

    switch (value?.type) {
      case "ed25519PublicKey":
        return (
          <PubKeyPicker
            id={keyId}
            fieldSize="md"
            label="Key"
            value={value?.key || ""}
            error={error?.key}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange({ ...value, key: event.target.value });
            }}
          />
        );
      case "sha256Hash":
      case "preAuthTx":
        return (
          <TextPicker
            id={keyId}
            fieldSize="md"
            label="Key"
            placeholder="Accepts a 32-byte hash in hexadecimal format (64 characters)."
            value={value?.key || ""}
            error={error?.key}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange({ ...value, key: event.target.value });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box gap="sm">
      <>
        {label ? (
          <Label
            size="md"
            htmlFor=""
            labelSuffix={labelSuffix}
            infoLink={infoLink}
            infoText={infoText}
          >
            {label}
          </Label>
        ) : null}

        <Select
          fieldSize="md"
          id={id}
          value={value?.type}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            if (event.target.value) {
              onChange({ type: event.target.value, key: "", weight: "" });
            } else {
              onChange(undefined);
            }
          }}
        >
          <option value="">Select signer type</option>
          <option value="ed25519PublicKey">Ed25519 Public Key</option>
          <option value="sha256Hash">sha256 Hash</option>
          <option value="preAuthTx">Pre-authorized Transaction Hash</option>
        </Select>

        {value?.type ? (
          <>
            {renderKey()}

            {!excludeWeight ? (
              <PositiveIntPicker
                id={`${id}-weight`}
                label="Weight"
                placeholder="0 - 255"
                value={value?.weight || ""}
                error={error?.weight}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChange({ ...value, weight: event.target.value });
                }}
                note="Signer will be removed from account if this weight is 0."
              />
            ) : null}
          </>
        ) : null}

        {note ? (
          <div className="FieldNote FieldNote--note FieldNote--md">{note}</div>
        ) : null}
      </>
    </Box>
  );
};
