import {serializeStore} from './storeSerializer';
import hashBuilder from './hashBuilder';

export function importTxSigner(xdr) {
  let query = serializeStore('txsigner', {
    transactionSigner: {
      tx: {
        xdr: xdr,
      },
    },
  });

  return hashBuilder('txsigner', query);
}
