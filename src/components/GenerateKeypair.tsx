import { Input } from "@stellar/design-system";

export const GenerateKeypair = ({
  publicKey,
  secretKey,
  recoveryPhrase,
}: {
  publicKey: string | undefined;
  secretKey: string | undefined;
  recoveryPhrase: string | undefined;
}) => {
  return (
    <div className="Account__keypair">
      {publicKey && (
        <Input
          readOnly
          id="generate-keypair-publickey"
          fieldSize="md"
          label="Public key"
          value={publicKey}
          copyButton={{
            position: "right",
          }}
        />
      )}

      {secretKey && (
        <Input
          readOnly
          id="generate-keypair-secretkey"
          fieldSize="md"
          label="Secret key"
          value={secretKey}
          isPassword
          copyButton={{
            position: "right",
          }}
        />
      )}

      {recoveryPhrase && (
        <Input
          readOnly
          id="generate-keypair-recovery-phrase"
          fieldSize="md"
          label="Recovery phrase"
          value={recoveryPhrase}
          isPassword
          copyButton={{
            position: "right",
          }}
        />
      )}
    </div>
  );
};
