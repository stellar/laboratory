import { Keypair, TransactionBuilder, xdr } from "@stellar/stellar-sdk";

import { validate } from "@/validate";

const signTx = ({
  txXdr,
  signers,
  networkPassphrase,
  hardWalletSigs,
}: {
  txXdr: string;
  signers: string[];
  networkPassphrase: string;
  hardWalletSigs?: xdr.DecoratedSignature[];
}) => {
  const validSecretKeys = [];
  const validPreimages = [];

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i];

    if (signer !== null && signer !== undefined && signer !== "") {
      const error = validate.secretKey(signer);

      if (error) {
        return {
          xdr: undefined,
          message: error,
        };
      }

      if (!error) {
        if (signer.charAt(0) === "S") {
          // Secret keys
          validSecretKeys.push(signer);
        } else {
          // Hash preimage
          validPreimages.push(signer);
        }
      }
    }
  }

  const newTx = TransactionBuilder.fromXDR(txXdr, networkPassphrase);
  const existingSigs = newTx.signatures.length;
  let addedSigs = 0;

  validSecretKeys.forEach((signer) => {
    addedSigs++;
    newTx.sign(Keypair.fromSecret(signer));
  });
  validPreimages.forEach((signer) => {
    addedSigs++;
    newTx.signHashX(Buffer.from(signer, "hex"));
  });
  hardWalletSigs?.forEach((signer) => {
    addedSigs++;
    newTx.signatures.push(signer);
  });
  return {
    xdr: newTx.toEnvelope().toXDR("base64"),
    message: `${addedSigs} signature(s) added; ${
      existingSigs + addedSigs
    } signature(s) total`,
  };
};

export const transactionSigner = {
  signTx,
};
