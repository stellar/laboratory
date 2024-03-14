import { Icon, Input } from "@stellar/design-system";
import { useStore } from "@/store/useStore";

export const GenerateKeypair = () => {
  const { account } = useStore();

  return (
    <div className="Account__keypair">
      {account.keypair.publicKey && (
        <Input
          readOnly
          id="generate-keypair-publickey"
          fieldSize="md"
          label="Public Key"
          value={account.keypair.publicKey}
          copyButton={{
            position: "right",
          }}
        />
      )}

      {account.keypair.secretKey && (
        <Input
          readOnly
          id="generate-keypair-secretkey"
          fieldSize="md"
          label="Secret Key"
          value={account.keypair.secretKey}
          rightElement={
            <Icon.Copy01
              onClick={() => {
                navigator.clipboard.writeText(account.keypair.secretKey);
              }}
            />
          }
        />
      )}
    </div>
  );
};
