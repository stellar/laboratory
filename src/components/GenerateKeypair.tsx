import { Icon, Input } from "@stellar/design-system";
import { useStore } from "@/store/useStore";

export const GenerateKeypair = ({ secretKey }: { secretKey: string }) => {
  const { account } = useStore();

  return (
    <div className="Account__keypair">
      {account.publicKey && (
        <Input
          readOnly
          id="generate-keypair-publickey"
          fieldSize="md"
          label="Public Key"
          value={account.publicKey}
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
