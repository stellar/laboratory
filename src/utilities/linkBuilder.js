import {serializeStore} from './storeSerializer';
import url from 'url';

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


// Simply takes in a slug and a object and converts it into a hash url.
// Example input:
// slug: foo
// query: {happy: 'yes'}
//
// Example returns: #foo?happy=yes
function hashBuilder(slug, query) {
  let urlObj = {
    pathname: slug,
    query: query,
  };
  return '#' + url.format(urlObj);
}
