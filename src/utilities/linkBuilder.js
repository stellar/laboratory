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

export function txPostLink(xdr) {
  let query = serializeStore('explorer', {
    endpointExplorer: {
      currentEndpoint: 'create',
      currentResource: 'transactions',
      pendingRequest: {
        values: {
          tx: xdr,
        },
      },
    },
  });

  return hashBuilder('explorer', query);
}
