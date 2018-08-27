import {xdr, hash, StrKey, Network, Keypair} from 'stellar-sdk';
import axios from 'axios';
import SIGNATURE from '../constants/signature';

export const UPDATE_XDR_INPUT = 'UPDATE_XDR_INPUT';
export function updateXdrInput(input) {
  return {
    type: UPDATE_XDR_INPUT,
    input,
  }
}

export const UPDATE_XDR_TYPE = 'UPDATE_XDR_TYPE';
export function updateXdrType(xdrType) {
  return {
    type: UPDATE_XDR_TYPE,
    xdrType,
  }
}

export const FETCH_LATEST_TX = 'FETCH_LATEST_TX';
export function fetchLatestTx(horizonBaseUrl, networkPassphrase) {
  return dispatch => {
    axios.get(horizonBaseUrl + '/transactions?limit=1&order=desc')
      .then(r => {
        const xdr = r.data._embedded.records[0].envelope_xdr;
        dispatch(updateXdrInput(xdr))
        dispatch(updateXdrType('TransactionEnvelope'))
        dispatch(fetchSigners(xdr, horizonBaseUrl, networkPassphrase))
      })
      .catch(r => dispatch({type: FETCH_SEQUENCE_FAIL, payload: r}))
  }
}

export const FETCHED_SIGNERS_SUCCESS = 'FETCHED_SIGNERS_SUCCESS';
export const FETCHED_SIGNERS_FAIL = 'FETCHED_SIGNERS_FAIL';
export const FETCHED_SIGNERS_START = 'FETCHED_SIGNERS_START';
export function fetchSigners(input, horizonBaseUrl, networkPassphrase) {
  return dispatch => {
    dispatch({ type: FETCHED_SIGNERS_START });
    try {
      // Capture network for determining signature base
      StellarSdk.Network.use(new Network(networkPassphrase));

      let tx = new StellarSdk.Transaction(input);
      const hashedSignatureBase = hash(tx.signatureBase());

      // Extract all signatures on transaction
      const signatures = tx.signatures.map(x => ({ sig: x.signature() }));

      // Extract all source accounts from transaction (base transaction and all operations)
      let sourceAccounts = {};
  
      let baseAccountId = tx.source;
      sourceAccounts[baseAccountId] = true;
      
      tx.operations.forEach(op => {
        if (op.source) {
          sourceAccounts[op.source] = true;
        }
      });

      // Get all signers per source account - array of promises
      sourceAccounts = Object.keys(sourceAccounts).map(accountID => axios.get(horizonBaseUrl + '/accounts/' + accountID));

      Promise.all(sourceAccounts)
      .then(response => {
        let allSigners = {};
        response.forEach(r => r.data.signers.forEach(signer => allSigners[signer.key] = signer));

        allSigners = Object.values(allSigners);
        
        // We are only interested in checking if each of the signatures can be verified for some valid
        // signer for any of the source accounts in the transaction -- we are not taking into account
        // weights, or even if this signer makes sense.
        for (var i = 0; i < signatures.length; i ++) {
          const sigObj = signatures[i];
          let isValid = false;

          for (var j = 0; j < allSigners.length; j ++) {
            const signer = allSigners[j];
            
            // By nature of pre-authorized transaction, we won't ever receive a pre-auth
            // tx hash in signatures array, so we can ignore pre-authorized transactions here.
            switch (signer.type) {
              case 'sha256_hash':
                const hashXSigner = StrKey.decodeSha256Hash(signer.key);
                const hashXSignature = hash(sigObj.sig);
                isValid = hashXSigner.equals(hashXSignature);
                break;
              case 'ed25519_public_key':
                const keypair = Keypair.fromPublicKey(signer.key);
                isValid = keypair.verify(hashedSignatureBase, sigObj.sig);
                break;
            }

            if (isValid) {
              break;
            }
          }

          sigObj.isValid = isValid ? SIGNATURE.VALID : SIGNATURE.INVALID;
        }
        dispatch({
          type: FETCHED_SIGNERS_SUCCESS,
          result: signatures,
        });
      })
      .catch(e => {
        console.error(e);
        dispatch({ type: FETCHED_SIGNERS_FAIL })
      });
    } catch(e) {
      console.error(e);
      dispatch({ type: FETCHED_SIGNERS_FAIL });
    }
  };
}
