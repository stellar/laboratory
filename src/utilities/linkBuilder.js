import {serializeStore} from './storeSerializer';
import url from 'url';
import SLUG from '../constants/slug';

export function txSignerLink(xdr) {
  let query = serializeStore(SLUG.TXSIGNER, {
    transactionSigner: {
      tx: {
        xdr: xdr,
      },
    },
  });

  return hashBuilder(SLUG.TXSIGNER, query);
}

export function txPostLink(xdr) {
  let query = serializeStore(SLUG.EXPLORER, {
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

  return hashBuilder(SLUG.EXPLORER, query);
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
