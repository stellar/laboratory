import {xdrViewer, singleAccount, horizonUrlToExplorerLink} from './linkBuilder';

// Map of functions specific to JSON property keys that creates urls for a given
// value.
// A function can also return undefined if it doesn't deem the value worthy of
// linking (for example: invalid account ID or keys that have ambiguous names)
let accountIdGenerator = (value) => {
  if (value.length === 56) {
    return singleAccount(value);
  }
};
let linkHighlighterRules = {
  'envelope_xdr': (value) => {
    return xdrViewer(value, 'TransactionEnvelope');
  },
  'result_xdr': (value) => {
    return xdrViewer(value, 'TransactionResult');
  },
  'result_meta_xdr': (value) => {
    return xdrViewer(value, 'TransactionMeta');
  },
  'fee_meta_xdr': (value) => {
    return xdrViewer(value, 'OperationMeta');
  },
  'id': accountIdGenerator,
  'public_key': accountIdGenerator,
  'account_id': accountIdGenerator,
  'funder': accountIdGenerator,
  'account': accountIdGenerator,
  'source_account': accountIdGenerator,
  'destination_account': accountIdGenerator,
  'href': horizonUrlToExplorerLink,
};

export default linkHighlighterRules;
