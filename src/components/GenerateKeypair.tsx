import { Input } from "@stellar/design-system";

export const GenerateKeypair = ({
  publicKey,
  secretKey,
}: {
  publicKey: string | undefined;
  secretKey: string | undefined;
}) => {
  return (
    <div className="Account__keypair">
      {publicKey && (
        <Input
          readOnly
          id="generate-keypair-publickey"
          fieldSize="md"
          label="Public Key"
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
          label="Secret Key"
          value={secretKey}
          isPassword
          copyButton={{
            position: "right",
          }}
        />
      )}
    </div>
  );
};
