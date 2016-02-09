import {serializeStore} from './storeSerializer';
import hashBuilder from './hashBuilder';

export function txSignerLink(xdr) {
  let query = serializeStore('txsigner', {
    transactionSigner: {
      tx: {
        xdr: xdr,
      },
    },
  });

  return hashBuilder('txsigner', query);
}
