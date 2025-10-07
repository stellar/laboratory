import { Routes } from "@/constants/routes";
import { InputSideElement } from "@/components/InputSideElement";
import { SdsLink } from "@/components/SdsLink";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { useStore } from "@/store/useStore";

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
  const { walletKit } = useStore();
  const { publicKey: walletKitPubKey } = walletKit || {};

  return (
    <PubKeyPicker
      id="source_account"
      label="Source Account"
      value={value}
      error={error}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      rightElement={
        walletKitPubKey ? (
          <InputSideElement
            variant="button"
            onClick={() => {
              if (walletKitPubKey) {
                onChange(walletKitPubKey);
              }
            }}
            placement="right"
          >
            Get connected wallet address
          </InputSideElement>
        ) : null
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
