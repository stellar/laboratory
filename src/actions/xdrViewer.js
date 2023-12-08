import * as StellarSdk from "stellar-sdk";
import axios from "axios";
import { FETCH_SEQUENCE_FAIL } from "actions/transactionBuilder";
import { SIGNATURE } from "../constants/signature";
import { FETCHED_SIGNERS } from "../constants/fetched_signers";
import convertMuxedAccountToEd25519Account from "../helpers/convertMuxedAccountToEd25519Account";

export const UPDATE_XDR_INPUT = "UPDATE_XDR_INPUT";
export function updateXdrInput(input) {
  return {
    type: UPDATE_XDR_INPUT,
    input,
  };
}

export const UPDATE_XDR_TYPE = "UPDATE_XDR_TYPE";
export function updateXdrType(xdrType) {
  return {
    type: UPDATE_XDR_TYPE,
    xdrType,
  };
}

export const FETCH_LATEST_TX = "FETCH_LATEST_TX";
export function fetchLatestTx(horizonBaseUrl, networkPassphrase) {
  return (dispatch) => {
    dispatch({ type: FETCH_LATEST_TX });
    axios
      .get(horizonBaseUrl + "/transactions?limit=1&order=desc")
      .then((r) => {
        const xdr = r.data._embedded.records[0].envelope_xdr;
        dispatch(updateXdrInput(xdr));
        dispatch(updateXdrType("TransactionEnvelope"));
        dispatch(fetchSigners(xdr, horizonBaseUrl, networkPassphrase));
      })
      .catch((r) => dispatch({ type: FETCH_SEQUENCE_FAIL, payload: r }));
  };
}

export function fetchSigners(
  input,
  horizonBaseUrl,
  networkPassphrase,
  isSoroban = false,
) {
  return (dispatch) => {
    dispatch({ type: FETCHED_SIGNERS.PENDING });
    try {
      let tx = new StellarSdk.TransactionBuilder.fromXDR(
        input,
        networkPassphrase,
      );

      // Extract all source accounts from transaction (base transaction, and all operations)
      let sourceAccounts = {};

      // tuple of signatures and transaction hash. This is needed to handle
      // inner signatures in a fee bump transaction
      let groupedSignatures = [];

      if (tx instanceof StellarSdk.FeeBumpTransaction) {
        sourceAccounts[
          convertMuxedAccountToEd25519Account(tx.feeSource)
        ] = true;
        groupedSignatures.push([
          tx.signatures.map((x) => ({ sig: x.signature() })),
          tx.hash(),
        ]);

        tx = tx.innerTransaction;
      }

      sourceAccounts[convertMuxedAccountToEd25519Account(tx.source)] = true;
      tx.operations.forEach((op) => {
        if (op.source) {
          sourceAccounts[convertMuxedAccountToEd25519Account(op.source)] = true;
        }
      });

      groupedSignatures.push([
        tx.signatures.map((x) => ({ sig: x.signature() })),
        tx.hash(),
      ]);

      // Get all signers per source account - array of promises
      sourceAccounts = Object.keys(sourceAccounts).map((accountID) =>
        axios.get(horizonBaseUrl + "/accounts/" + accountID),
      );
      const signatures = [];

      Promise.all(sourceAccounts)
        .then((response) => {
          let allSigners = {};
          response.forEach((r) =>
            r.data.signers.forEach(
              (signer) => (allSigners[signer.key] = signer),
            ),
          );

          allSigners = Object.values(allSigners);

          groupedSignatures.forEach((group) => {
            const sigs = group[0];
            const txHash = group[1];

            // We are only interested in checking if each of the signatures can be verified for some valid
            // signer for any of the source accounts in the transaction -- we are not taking into account
            // weights, or even if this signer makes sense.
            for (var i = 0; i < sigs.length; i++) {
              const sigObj = sigs[i];
              let isValid = false;

              for (var j = 0; j < allSigners.length; j++) {
                const signer = allSigners[j];

                // By nature of pre-authorized transaction, we won't ever receive a pre-auth
                // tx hash in signatures array, so we can ignore pre-authorized transactions here.
                switch (signer.type) {
                  case "sha256_hash":
                    const hashXSigner = StellarSdk.StrKey.decodeSha256Hash(
                      signer.key,
                    );
                    const hashXSignature = StellarSdk.hash(sigObj.sig);
                    isValid = hashXSigner.equals(hashXSignature);
                    break;
                  case "ed25519_public_key":
                    const keypair = StellarSdk.Keypair.fromPublicKey(
                      signer.key,
                    );
                    isValid = keypair.verify(txHash, sigObj.sig);
                    break;
                }

                if (isValid) {
                  break;
                }
              }

              sigObj.isValid = isValid ? SIGNATURE.VALID : SIGNATURE.INVALID;

              signatures.push(sigObj);
            }
          });

          dispatch({
            type: FETCHED_SIGNERS.SUCCESS,
            result: signatures,
          });
        })
        .catch((e) => {
          console.error(e);
          if (e.response.status == 404) {
            dispatch({ type: FETCHED_SIGNERS.NOT_EXIST });
          } else {
            dispatch({ type: FETCHED_SIGNERS.FAIL });
          }
        });
    } catch (e) {
      console.error(e);
      dispatch({ type: FETCHED_SIGNERS.FAIL });
    }
  };
}
