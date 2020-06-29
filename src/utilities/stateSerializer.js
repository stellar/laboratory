import assign from 'lodash/assign';
import each from 'lodash/each';
import has from 'lodash/has';
import size from 'lodash/size';
import {dehydrate} from './hydration';
import SLUG from '../constants/slug';
import TX_TYPES from '../constants/transaction_types';


// The state serializer converts the state relevant to a specific page into an object.
// This object is then used to build the routing url.

// It is optional in that if a feature was implemented in just the reducer, it
// can work without needing a state serializer implemented. Without the state
// serializer implemented, the url hash state params will be empty.

// This does two parts of the 3 part cycle of routing:
// (state) --->[stateToQueryObj()]---> (queryObj)
// (queryObj) --->[queryObjToLoadStatePayload()]---> (loadStateObj)
// (loadStateObj) --->[LOAD_STATE action]--->[redux reducers]---> (state)

// The state that gets passed here may be an incomplete one.
// Incomplete ones are useful because it lets us build URLs without needing the
// whole state tree (such as in ../utilities/linkBuilder.js).
export function stateToQueryObj(slug, state) {
  return assign({},
    serializePageSpecificState(slug, state),
    serializeNetworkState(state),
  );
}

function serializeNetworkState(state) {
  // Only return something if we were passed the current network
  if (has(state, 'network')) {
    if (state.network.current.name == "custom") {
      return {
        network: state.network.current.name,
        horizonURL: state.network.current.horizonURL,
        networkPassphrase: state.network.current.networkPassphrase
      }
    }

    return {network: state.network.current.name}
  }
  return {};
}

function serializePageSpecificState(slug, state) {
  switch (slug) {
    case SLUG.EXPLORER:
      let endpointsResult = {};
      if (state.endpointExplorer.currentResource) {
        endpointsResult.resource = state.endpointExplorer.currentResource;
      }
      if (state.endpointExplorer.currentEndpoint) {
        endpointsResult.endpoint = state.endpointExplorer.currentEndpoint;
      }
      if (size(state.endpointExplorer.pendingRequest.values) > 0) {
        endpointsResult.values = dehydrate(state.endpointExplorer.pendingRequest.values);
      }
      return endpointsResult;
    case SLUG.TXBUILDER:
      let txbuilderResult = {};
      let txbuilderAttributes = assignNonEmpty({}, state.transactionBuilder.attributes);
      if (size(txbuilderAttributes) > 0) {
        txbuilderResult.attributes = txbuilderAttributes;
      }

      let feeBumpAttributes = assignNonEmpty({}, state.transactionBuilder.feeBumpAttributes);
      if (size(feeBumpAttributes) > 0) {
        txbuilderResult.feeBumpAttributes = feeBumpAttributes;
      }

      if (state.transactionBuilder.txType !== TX_TYPES.REGULAR) {
        txbuilderResult.txType = state.transactionBuilder.txType;
      }

      if (state.transactionBuilder.operations){
        let firstOpEmpty = state.transactionBuilder.operations[0].name === '';
        if (state.transactionBuilder.operations.length > 1 || !firstOpEmpty) {
          txbuilderResult.operations = state.transactionBuilder.operations;
        }
      }

      if (has(txbuilderResult, 'attributes.memoType') &&
          txbuilderResult.attributes.memoType === 'MEMO_NONE') {
        delete txbuilderResult.attributes.memoType;
      }

      if (size(txbuilderResult.attributes) === 0) {
        delete txbuilderResult.attributes;
      }

      if (size(txbuilderResult) === 0) {
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
    case SLUG.XDRVIEWER:
      let xdrViewer = {};
      if (state.xdrViewer.input !== '') {
        xdrViewer.input = state.xdrViewer.input;
      }
      if (state.xdrViewer.type !== '') {
        xdrViewer.type = state.xdrViewer.type;
      }
      return xdrViewer;
      case SLUG.TXSUBMITTER:
      let txsubmitter = {};
      if (state.xdrViewer.input !== '') {
        txsubmitter.input = state.xdrViewer.input;
      }
      return txsubmitter;
    default:
      return {};
  }
}

// Similar to Object.assign except it doesn't copy over non-empty ones such
// as '' or undefined
function assignNonEmpty(targetObj, inputObj) {
  each(inputObj, (value, key) => {
    if (value === '' || value === undefined) {
      return;
    }
    targetObj[key] = value;
  })

  return targetObj;
}

