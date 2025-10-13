import { Routes } from "@/constants/routes";

import { useElementSize } from "@/hooks/useElementSize";

import { SdsLink } from "@/components/SdsLink";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { SignerSelector } from "@/components/SignerSelector";

type SourceAccountPickerProps = {
  value: string;
  error: string | undefined;
  onChange: (val: string) => void;
};

export const SourceAccountPicker = ({
  value,
  error,
  onChange,
}: SourceAccountPickerProps) => {
  const { width: inputWidth, ref: inputRef } = useElementSize();

  return (
    <PubKeyPicker
      ref={inputRef}
      id="source_account"
      label="Source Account"
      value={value}
      error={error}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      rightElement={
        <SignerSelector
          mode="public"
          onChange={onChange}
          containerWidth={inputWidth}
        />
      }
      note={
        <>
          If you don’t have an account yet, you can create and fund a test net
          account with the{" "}
          <SdsLink href={Routes.ACCOUNT_CREATE}>account creator</SdsLink>.
        </>
      }
      infoLink="https://developers.stellar.org/docs/learn/glossary#source-account"
    />
  );
};
