import { useState } from "react";

import { Routes } from "@/constants/routes";

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
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="SourceAccountPicker">
      <PubKeyPicker
        id="source_account"
        label="Source Account"
        value={value}
        error={error}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        rightElement={
          <SignerSelector.Button
            mode="public"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
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
      <SignerSelector.Dropdown
        mode="public"
        onChange={onChange}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </div>
  );
};
