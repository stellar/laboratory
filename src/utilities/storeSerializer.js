import {dehydrate, rehydrate} from './hydration';
import _ from 'lodash';
import SLUG from '../constants/slug';

// The store serializer is used to convert the store of a specific page into a
// object of strings to be used in the url hash param.
// It takes in a page slug and will return the string for that specific store.

// The deserialization step happens in each of the reducers
export function serializeStore(slug, state) {
  switch (slug) {
    case SLUG.EXPLORER:
      let endpointsResult = {};
      if (state.endpointExplorer.currentResource) {
        endpointsResult.resource = state.endpointExplorer.currentResource;
      }
      if (state.endpointExplorer.currentEndpoint) {
        endpointsResult.endpoint = state.endpointExplorer.currentEndpoint;
      }
      if (_.size(state.endpointExplorer.pendingRequest.values) > 0) {
        endpointsResult.values = dehydrate(state.endpointExplorer.pendingRequest.values);
      }
      return endpointsResult;
    case SLUG.TXBUILDER:
      let txbuilderResult = {};
      let txbuilderAttributes = assignNonEmpty({}, state.transactionBuilder.attributes);
      if (_.size(txbuilderAttributes) > 0) {
        txbuilderResult.attributes = txbuilderAttributes;
      }

      let firstOpEmpty = state.transactionBuilder.operations[0].name === '';
      if (state.transactionBuilder.operations.length > 1 || !firstOpEmpty) {
        txbuilderResult.operations = state.transactionBuilder.operations;
      }

      if (_.has(txbuilderResult, 'attributes.memoType') &&
          txbuilderResult.attributes.memoType === 'MEMO_NONE') {
        delete txbuilderResult.attributes.memoType;
      }

      if (_.size(txbuilderResult.attributes) === 0) {
        delete txbuilderResult.attributes;
      }

      if (_.size(txbuilderResult) === 0) {
        return {};
      }
      return {
        params: dehydrate(txbuilderResult),
      };
    case SLUG.TXSIGNER:
      // We only want to serialize the imported xdr and not the saved secret key
      // to prevent sensitive data being stored in browser history.
      let txsignerResult = {};
      if (state.transactionSigner.xdr.length > 0) {
        txsignerResult.xdr = state.transactionSigner.xdr;
      }
      return txsignerResult;
    case 'xdr-viewer':
      let xdrViewer = {};
      if (state.xdrViewer.input !== '') {
        xdrViewer.input = state.xdrViewer.input;
      }
      if (state.xdrViewer.type !== '') {
        xdrViewer.type = state.xdrViewer.type;
      }
      return xdrViewer;
    default:
      return {};
  }
}

// Similar to Object.assign except it doesn't copy over non-empty ones such
// as '' or undefined
function assignNonEmpty(targetObj, inputObj) {
  _.each(inputObj, (value, key) => {
    if (value === '' || value === undefined) {
      return;
    }
    targetObj[key] = value;
  })

  return targetObj;
}

// This deserializes the query object into a simple object. This resulting simple
// object is then passed to the reducers that apple the object to their store.
export function deserializeQueryObj(slug, queryObj) {
  switch (slug) {
    case SLUG.EXPLORER:
      let endpointsResult = Object.assign({}, queryObj);
      if (endpointsResult.values) {
        endpointsResult.values = rehydrate(endpointsResult.values);
      }
      return endpointsResult;
    case SLUG.TXBUILDER:
      if (queryObj.params) {
        return rehydrate(queryObj.params);
      }
      return {};
    case SLUG.TXSIGNER:
      return queryObj;
    case 'xdr-viewer':
      return queryObj;
    default:
      return {};
  }
}
