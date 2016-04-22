import {stateToQueryObj} from './stateSerializer';
import url from 'url';
import SLUG from '../constants/slug';
import horizonUrlParser from './horizonUrlParser';

// The linkBuilder attempts to abstract the specific details of the store so that
// consumers of linkBuilder need to know very little to be able to generate a link.

// These functions will return `undefined` if a link could not be producted with
// the given info

export function txSignerLink(xdr) {
  let query = stateToQueryObj(SLUG.TXSIGNER, {
    transactionSigner: {
      xdr: xdr,
    },
  });
  return hashBuilder(SLUG.TXSIGNER, query);
}

export function txPostLink(xdr) {
  let query = stateToQueryObj(SLUG.EXPLORER, {
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

export function xdrViewer(xdr, type) {
  let query = stateToQueryObj(SLUG.XDRVIEWER, {
    xdrViewer: {
      input: xdr,
      type,
    },
  });
  return hashBuilder(SLUG.XDRVIEWER, query);
}

// explorerEndpoint is a helper function that generates a link from values
// mirroring the structure of the endpointExplorer reducer. We should try to
// abstract this with other functions with simpler arguments to reduce
// complexity and dependence on understanding the reducers.
function explorerEndpoint(resource, endpoint, values) {
  let query = stateToQueryObj(SLUG.EXPLORER, {
    endpointExplorer: {
      currentResource: resource,
      currentEndpoint: endpoint,
      pendingRequest: {
        values,
      },
    },
  });
  return hashBuilder(SLUG.EXPLORER, query);
}

export function singleAccount(accountId) {
  return explorerEndpoint('accounts', 'single', {
    'account_id': accountId,
  });
}

export function horizonUrlToExplorerLink(horizonUrl) {
  let urlInfo = horizonUrlParser(horizonUrl);
  if (typeof urlInfo === 'undefined') {
    return;
  }

  return explorerEndpoint(urlInfo.resource, urlInfo.endpoint, urlInfo.params);
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
