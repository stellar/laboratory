// Libify is a utility that converts a wide variety of inputs into their stricter
// representations in Stellar libraries such as js-stellar-base and js-stellar-sdk.
//
// The Libify api aims to look similar to that of js-stellar-base and sdk. It
// will output better error messages in cases where helpful (instead of just
// undefined error messages).
//
// Libify could also be used to generate source code from input.

import Sdk from 'stellar-sdk';
import _ from 'lodash';

// Helpers
let isEmpty = function(value) {
  return _.isUndefined(value) || value === '' || value === null;
}
let assertNotEmpty = function(value, message) {
  if (isEmpty(value)) {
    throw new Error(message);
  }
}

// Converts a value into a boolean. String values are converted to their respective
// boolean values since html forms can only output string values.
let isLooseTruthy = function(value) {
  if (value == 'true') {
    return true;
  }
  if (value == 'false') {
    return false;
  }
  return value == true;
}

let Libify = {};

Libify.Asset = function(opts) {
  if (isEmpty(opts) || opts.type === 'native') {
    return Sdk.Asset.native();
  }

  assertNotEmpty(opts.code, 'Asset requires asset code');
  return new Sdk.Asset(opts.code, opts.issuer);
}

Libify.Memo = function(opts) {
  switch(opts.type) {
  case 'MEMO_TEXT':
    return Sdk.Memo.text(opts.content);
  case 'MEMO_ID':
    return Sdk.Memo.id(opts.content);
  case 'MEMO_HASH':
    return Sdk.Memo.hash(opts.content);
  case 'MEMO_RETURN':
    return Sdk.Memo.returnHash(opts.content);
  }
}

// Takes in a type and a pile of options and attempts to turn it into a valid
// js-stellar-base operation. If not, it will throw an error.
Libify.Operation = function(type, opts) {
  assertNotEmpty(type, 'Operation type is required');
  let opFunction = Libify.Operation[type];
  if (typeof opFunction === 'undefined' || _.has(Libify.Operation, 'opFunction')) {
    throw new Error('Unknown operation type: ' + type);
  }
  return opFunction(opts);
}

Libify.Operation.createAccount = function(opts) {
  assertNotEmpty(opts.destination, 'Create Account operation requires destination');
  assertNotEmpty(opts.startingBalance, 'Create Account operation requires starting balance');
  return Sdk.Operation.createAccount({
    destination: opts.destination,
    startingBalance: opts.startingBalance,
    source: opts.sourceAccount,
  })
}

Libify.Operation.payment = function(opts) {
  assertNotEmpty(opts.destination, 'Payment operation requires destination');
  assertNotEmpty(opts.asset, 'Payment operation requires asset');
  assertNotEmpty(opts.amount, 'Payment operation requires amount');
  return Sdk.Operation.payment({
    destination: opts.destination,
    asset: Libify.Asset(opts.asset),
    amount: opts.amount,
    source: opts.sourceAccount,
  })
}

Libify.Operation.changeTrust = function(opts) {
  assertNotEmpty(opts.asset, 'Change Trust operation requires asset');
  return Sdk.Operation.changeTrust({
    asset: Libify.Asset(opts.asset),
    limit: opts.limit,
    source: opts.sourceAccount,
  })
}

Libify.Operation.allowTrust = function(opts) {
  assertNotEmpty(opts.trustor, 'Allow Trust operation requires trustor');
  assertNotEmpty(opts.assetCode, 'Allow Trust operation requires asset code');
  assertNotEmpty(opts.authorize, 'Allow Trust operation requires authorization setting');
  return Sdk.Operation.allowTrust({
    trustor: opts.trustor,
    assetCode: opts.assetCode,
    authorize: isLooseTruthy(opts.authorize),
    source: opts.sourceAccount,
  })
}

Libify.Operation.accountMerge = function(opts) {
  assertNotEmpty(opts.destination, 'Allow Trust operation requires destination');
  return Sdk.Operation.accountMerge({
    destination: opts.destination,
    source: opts.sourceAccount,
  })
}



export default Libify;
