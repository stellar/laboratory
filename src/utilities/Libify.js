// Libify is a utility that converts a wide variety of inputs into their stricter
// representations in Stellar libraries such as js-stellar-base and js-stellar-sdk.
//
// The Libify api aims to look similar to that of js-stellar-base and sdk. It
// will output better error messages in cases where helpful (instead of just
// undefined error messages).
//
// Libify could also be used to generate source code from input but might not be
// the best choice since source code differs based on content.

import Sdk from 'stellar-sdk';
import _ from 'lodash';

// Helpers
let isEmpty = function(value) {
  return _.isUndefined(value) || value === '' || value === null;
}
let isInt = function(value) {
  return String(value).match(/^[0-9]*$/g);
}
let assertNotEmpty = function(value, message) {
  if (isEmpty(value)) {
    throw new Error(message);
  }
}
let assertIntOrEmpty = function(value, message) {
  if (!isEmpty(value) && !isInt(value)) {
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

// This function processes the value in two situations:
// 1. Value contains just digits: will convert into JavaScript Number integer
// 2. String is empty: converts to undefined (useful for optional arguments)
let castIntOrUndefined = function(value) {
  if (_.isString(value) && value.match(/^[0-9]*$/g)) {
    return Number(value);
  }
  return undefined;
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

Libify.Operation.pathPayment = function(opts) {
  assertNotEmpty(opts.sendAsset, 'Path Payment operation requires sending asset');
  assertNotEmpty(opts.sendMax, 'Path Payment operation requires max send');
  assertNotEmpty(opts.destination, 'Payment operation requires destination');
  assertNotEmpty(opts.destAsset, 'Path Payment operation requires destination asset');
  assertNotEmpty(opts.destAmount, 'Path Payment operation requires the destination amount');
  if (!_.isArray(opts.path) || opts.path.length < 1) {
    throw new Error('Path Payment operation requires one or more path hops');
  }

  let libifiedPath = _.map(opts.path, (hopAsset) => {
    if (_.isUndefined(hopAsset.type)) {
      throw new Error('All assets in path must be filled out');
    }
    return Libify.Asset(hopAsset);
  })

  return Sdk.Operation.pathPayment({
    sendAsset: Libify.Asset(opts.sendAsset),
    sendMax: opts.sendMax,
    destination: opts.destination,
    destAsset: Libify.Asset(opts.destAsset),
    destAmount: opts.destAmount,
    path: libifiedPath,
    source: opts.sourceAccount,
  })
}

Libify.Operation.changeTrust = function(opts) {
  assertNotEmpty(opts.asset, 'Change Trust operation requires asset');
  return Sdk.Operation.changeTrust({
    asset: Libify.Asset(opts.asset),
    limit: (opts.limit === '') ? undefined : opts.limit,
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

Libify.Operation.manageOffer = function(opts) {
  assertNotEmpty(opts.selling, 'Manage Offer operation requires selling asset');
  assertNotEmpty(opts.buying, 'Manage Offer operation requires buying asset');
  assertNotEmpty(opts.amount, 'Manage Offer operation requires amount');
  assertNotEmpty(opts.price, 'Manage Offer operation requires price');
  return Sdk.Operation.manageOffer({
    selling: Libify.Asset(opts.selling),
    buying: Libify.Asset(opts.buying),
    amount: opts.amount,
    price: opts.price,
    offerId: opts.offerId,
    source: opts.sourceAccount,
  })
}

Libify.Operation.createPassiveOffer = function(opts) {
  assertNotEmpty(opts.selling, 'Create Passive Offer operation requires selling asset');
  assertNotEmpty(opts.buying, 'Create Passive Offer operation requires buying asset');
  assertNotEmpty(opts.amount, 'Create Passive Offer operation requires amount');
  assertNotEmpty(opts.price, 'Create Passive Offer operation requires price');
  return Sdk.Operation.manageOffer({
    selling: Libify.Asset(opts.selling),
    buying: Libify.Asset(opts.buying),
    amount: opts.amount,
    price: opts.price,
    source: opts.sourceAccount,
  })
}

Libify.Operation.inflation = function(opts) {
  return Sdk.Operation.inflation({
    source: opts.sourceAccount,
  })
}

Libify.Operation.setOptions = function(opts) {
  let signerPubKeyEmpty = isEmpty(opts.signerAddress);
  let signerWeightEmpty = isEmpty(opts.signerWeight);
  if (signerPubKeyEmpty && !signerWeightEmpty) {
    throw new Error('Signer weight is required if signer public key is present');
  }
  if (!signerPubKeyEmpty && signerWeightEmpty) {
    throw new Error('Signer public key is required if signer weight is present');
  }

  let signer;
  if (!signerPubKeyEmpty && !signerWeightEmpty) {
    signer = {
      address: opts.signerAddress,
      weight: castIntOrUndefined(opts.signerWeight),
    }
  }

  assertIntOrEmpty(opts.clearFlags, 'Clear flags must be an integer');
  assertIntOrEmpty(opts.setFlags, 'Set flags must be an integer');
  assertIntOrEmpty(opts.masterWeight, 'Master Weight must be an integer');
  assertIntOrEmpty(opts.lowThreshold, 'Low Threshold must be an integer');
  assertIntOrEmpty(opts.medThreshold, 'Medium Threshold must be an integer');
  assertIntOrEmpty(opts.highThreshold, 'High Threshold must be an integer');

  return Sdk.Operation.setOptions({
    inflationDest: opts.inflationDest,
    clearFlags: castIntOrUndefined(opts.clearFlags),
    setFlags: castIntOrUndefined(opts.setFlags),
    masterWeight: castIntOrUndefined(opts.masterWeight),
    lowThreshold: castIntOrUndefined(opts.lowThreshold),
    medThreshold: castIntOrUndefined(opts.medThreshold),
    highThreshold: castIntOrUndefined(opts.highThreshold),
    signer: signer,
    homeDomain: opts.homeDomain,
    source: opts.sourceAccount,
  })
}

export default Libify;
