import routeRecognizer from 'route-recognizer';
import url from 'url';
import _ from 'lodash';

// routeTable is derived from Horizon init_web.go. `routeTable` is intended to
// look similar to Horizon's code for routing requests.
// The key is the url template with path template names slightly altered to
// match with the Endpoint Setup Pane components in the laboratory.
// Commented out code lines signify endpoints that the Laboratory does not support
let routeTable = {
  // r.Get("/", &RootAction{})
  // r.Get("/metrics", &MetricsAction{})

  // ledger actions
  '/ledgers': {r: 'ledgers', e: 'all'},
  '/ledgers/:ledger': {r: 'ledgers', e: 'single'},
  '/ledgers/:ledger/transactions': {r: 'transactions', e: 'for_ledger'},
  '/ledgers/:ledger/operations': {r: 'operations', e: 'for_ledger'},
  '/ledgers/:ledger/payments': {r: 'payments', e: 'for_ledger'},
  '/ledgers/:ledger/effects': {r: 'effects', e: 'for_ledger'},

  // account actions
  '/accounts/:account_id': {r: 'accounts', e: 'single'},
  '/accounts/:account_id/transactions': {r: 'transactions', e: 'for_account'},
  '/accounts/:account_id/operations': {r: 'operations', e: 'for_account'},
  '/accounts/:account_id/payments': {r: 'payments', e: 'for_account'},
  '/accounts/:account_id/effects': {r: 'effects', e: 'for_account'},
  '/accounts/:account_id/offers': {r: 'offers', e: 'for_account'},
  '/accounts/:account_id/trades': {r: 'trades', e: 'for_account'},

  // transaction history actions
  '/transactions': {r: 'transactions', e: 'all'},
  '/transactions/:transaction': {r: 'transactions', e: 'single'},
  '/transactions/:transaction/operations': {r: 'operations', e: 'for_transaction'},
  '/transactions/:transaction/payments': {r: 'payments', e: 'for_transaction'},
  '/transactions/:transaction/effects': {r: 'effects', e: 'for_transaction'},

  // operation actions
  '/operations': {r: 'operations', e: 'all'},
  '/operations/:operation': {r: 'operations', e: 'single'},
  '/operations/:operation/effects': {r: 'effects', e: 'for_operation'},

  '/payments': {r: 'payments', e: 'all'},
  '/effects': {r: 'effects', e: 'all'},

  // r.Get("/offers/:id", &NotImplementedAction{})
  '/order_book': {r: 'order_book', e: 'details'},
  '/order_book/trades': {r: 'order_book', e: 'trades'},

  // Transaction submission API
  // r.Post("/transactions", &TransactionCreateAction{})
  '/paths': {r: 'paths', e: 'all'},

  // friendbot
  // r.Post("/friendbot", &FriendbotAction{})
  // r.Get("/friendbot", &FriendbotAction{})

  // r.NotFound(&NotFoundAction{})
};

let router = new routeRecognizer();
_.each(routeTable, (resourceEndpoint, template) => {
  router.add([{ path: template, handler: resourceEndpoint }]);
})

function stripTemplatedCurlyBrackets(inputUrl) {
  return inputUrl.replace(/\{.+\}$/,'');
}

function horizonUrlParser(inputUrl) {
  let parsedPath = url.parse(stripTemplatedCurlyBrackets(inputUrl)).path;
  if (parsedPath === null) {
    return;
  }

  let recognizeResult = router.recognize(parsedPath);
  if (typeof recognizeResult === 'undefined' || recognizeResult.length === 0) {
    return;
  }

  // Path params shadow and take higher precedence than query params
  let params = _.assign({}, recognizeResult.queryParams, recognizeResult[0].params)
  laboratorifyParams(params);

  return {
    resource: recognizeResult[0].handler.r,
    endpoint: recognizeResult[0].handler.e,
    params,
  }
}

// This converts the url params into the internal data structure used in the
// laboratory. For more info, take a look at `../data/endpoints.js` and look at
// the keys named `path`.
// This function mutate the params object passed in.
// - Converts root level items into children of root level objects
function laboratorifyParams(params) {
  assignToParam(params, 'selling_asset_type', 'selling_asset', 'type');
  assignToParam(params, 'selling_asset_code', 'selling_asset', 'code');
  assignToParam(params, 'selling_asset_issuer', 'selling_asset', 'issuer');

  assignToParam(params, 'buying_asset_type', 'buying_asset', 'type');
  assignToParam(params, 'buying_asset_code', 'buying_asset', 'code');
  assignToParam(params, 'buying_asset_issuer', 'buying_asset', 'issuer');

  assignToParam(params, 'destination_asset_type', 'buying_asset', 'type');
  assignToParam(params, 'destination_asset_code', 'buying_asset', 'code');
  assignToParam(params, 'destination_asset_issuer', 'buying_asset', 'issuer');
}

// assignToParam helps the laboratorify process by moving a root level item into
// a object with specified target keys.
// @param {object} params - Object of all params. Will be mutated
// @param {string} source - original key to move. Will be deleted if exists
// @param {string} destObj - object to move into. Will be created if not exist
// @param {string} destKey - key name to move source into
function assignToParam(params, source, destObj, destKey) {
  if (!_.has(params, source)) {
    return;
  }
  if (!_.has(params, destObj)) {
    params[destObj] = {};
  } else if (typeof params[destObj] !== 'object') {
    console.error('Non object already exists in key. This is likely due to tampering of the values in the url')
    return;
  }
  params[destObj][destKey] = params[source];
  delete params[source];
}

export default horizonUrlParser;
