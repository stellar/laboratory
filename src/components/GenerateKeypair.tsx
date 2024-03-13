import { Button, Icon, Input } from "@stellar/design-system";
import { Keypair } from "stellar-sdk";
import { useStore } from "@/store/useStore";

export const GenerateKeypair = () => {
  const { account } = useStore();

  const generateKeypair = () => {
    let keypair = Keypair.random();

    account.updateKeypair({
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    });
  };

  return (
    <div className="Account__keypair">
      <Button size="md" variant="tertiary" onClick={generateKeypair}>
        Generate keypair
      </Button>

      {account.keypair.publicKey && (
        <Input
          readOnly
          id="generate-keypair-publickey"
          fieldSize="md"
          label="Public Key"
          value={account.keypair.publicKey}
          rightElement={
            <Icon.Copy01
              onClick={() => {
                navigator.clipboard.writeText(account.keypair.publicKey);
              }}
            />
          }
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
