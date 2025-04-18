import { NetworkHeaders } from "@/types/types";
import {
  FeeBumpTransaction,
  hash,
  Keypair,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export const fetchTxSignatures = async ({
  txXdr,
  networkUrl,
  networkPassphrase,
  headers,
}: {
  txXdr: string;
  networkUrl: string;
  networkPassphrase: string;
  headers: NetworkHeaders;
}) => {
  try {
    let tx = TransactionBuilder.fromXDR(txXdr, networkPassphrase);

    type SourceAccount = {
      [key: string]: {
        weight: number;
        key: string;
        type: string;
      }[];
    };

    type GroupedSignature = [{ sig: Buffer }[], Buffer];

    type SigObj = {
      sig: Buffer;
      isValid?: boolean;
    };

    // Extract all source accounts from transaction (base transaction, and all operations)
    const sourceAccounts: SourceAccount = {};

    // tuple of signatures and transaction hash. This is needed to handle
    // inner signatures in a fee bump transaction
    const groupedSignatures: GroupedSignature[] = [];

    // Inner transaction
    if (tx instanceof FeeBumpTransaction) {
      sourceAccounts[convertMuxedAccountToEd25519Account(tx.feeSource)] = [];
      groupedSignatures.push([
        tx.signatures.map((x) => ({ sig: x.signature() })),
        tx.hash(),
      ]);

      tx = tx.innerTransaction;
    }

    sourceAccounts[convertMuxedAccountToEd25519Account(tx.source)] = [];

    tx.operations.forEach((op) => {
      if (op.source) {
        sourceAccounts[convertMuxedAccountToEd25519Account(op.source)] = [];
      }
    });

    groupedSignatures.push([
      tx.signatures.map((x) => ({ sig: x.signature() })),
      tx.hash(),
    ]);

    const accounts = Object.keys(sourceAccounts);

    // Get all signers per source account
    for (let i = 0; i < accounts.length; i++) {
      const srcAccount = accounts[i];

      try {
        const res = await fetch(`${networkUrl}/accounts/${srcAccount}`, {
          headers,
        });
        const resJson = await res.json();

        if (sourceAccounts[srcAccount] && resJson?.signers) {
          sourceAccounts[srcAccount] = resJson.signers;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Do nothing
      }
    }

    const allSigners = Object.values(sourceAccounts).reduce((res, cur) => {
      return [...res, ...cur];
    }, []);

    return groupedSignatures.reduce((result: SigObj[], group) => {
      const [sigs, txHash] = group;

      // We are only interested in checking if each of the signatures can be verified for some valid
      // signer for any of the source accounts in the transaction -- we are not taking into account
      // weights, or even if this signer makes sense.
      for (let i = 0; i < sigs.length; i++) {
        const sigObj: SigObj = sigs[i];

        let isValid = false;

        for (let j = 0; j < allSigners.length; j++) {
          const signer = allSigners[j];

          // By nature of pre-authorized transaction, we won't ever receive a pre-auth
          // tx hash in signatures array, so we can ignore pre-authorized transactions here.
          switch (signer.type) {
            case "sha256_hash":
              // eslint-disable-next-line no-case-declarations
              const hashXSigner = StrKey.decodeSha256Hash(signer.key);
              // eslint-disable-next-line no-case-declarations
              const hashXSignature = hash(sigObj.sig);
              isValid = hashXSigner.equals(hashXSignature);
              break;
            case "ed25519_public_key":
              // eslint-disable-next-line no-case-declarations
              const keypair = Keypair.fromPublicKey(signer.key);
              isValid = keypair.verify(txHash, sigObj.sig);
              break;
            default:
            // Do nothing
          }

          if (isValid) {
            break;
          }
        }

        sigObj.isValid = isValid;

        result.push(sigObj);
      }

      return result;
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return [];
  }
};

const convertMuxedAccountToEd25519Account = (account: string) => {
  // TODO: handle muxed account
  return account;
};
