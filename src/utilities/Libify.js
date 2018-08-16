// Libify is a utility that converts a wide variety of inputs into their stricter
// representations in Stellar libraries such as js-stellar-sdk and js-stellar-sdk.
//
// The Libify api aims to look similar to that of js-stellar-sdk and Sdk. It
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

// This function processes the value in three situations:
// 1. Is a number: return as is
// 2. String contains just digits: will convert into JavaScript Number integer
// 3. String is empty: converts to undefined (useful for optional arguments)
let castIntOrUndefined = function(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (_.isString(value) && value.match(/^[0-9]+$/g)) {
    return Number(value);
  }
  return undefined;
}

// This function processes the value in three situations:
// 1. Is a string: return as is
// 2. String is empty: converts to undefined (useful for optional arguments)
let castStringOrUndefined = function(value) {
  if (!_.isString(value) || value === '') {
    return undefined;
  }
  return String(value);
}

let castStringOrNull = function(value) {
  if (!_.isString(value) || value === '') {
    return null;
  }
  return String(value);
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
  case '':
  case 'MEMO_TEXT':
    return Sdk.Memo.text(opts.content);
  case 'MEMO_ID':
    return Sdk.Memo.id(opts.content);
  case 'MEMO_HASH':
    return Sdk.Memo.hash(opts.content);
  case 'MEMO_RETURN':
    return Sdk.Memo.return(opts.content);
  }
}

// Takes in a type and a pile of options and attempts to turn it into a valid
// js-stellar-sdk operation. If not, it will throw an error.
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
  assertNotEmpty(opts.destination, 'Account Merge operation requires destination');
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
  assertNotEmpty(opts.offerId, 'Manage Offer operation requires Offer ID');
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
  return Sdk.Operation.createPassiveOffer({
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
  let signer;
  if (opts.signer && opts.signer.type) {
    let signerPubKeyEmpty = isEmpty(opts.signer.content);
    let signerWeightEmpty = isEmpty(opts.signer.weight);
    if (signerPubKeyEmpty && !signerWeightEmpty) {
      throw new Error('Signer weight is required if signer key is present');
    }
    if (!signerPubKeyEmpty && signerWeightEmpty) {
      throw new Error('Signer key is required if signer weight is present');
    }

    if (!signerPubKeyEmpty && !signerWeightEmpty) {
      signer = {
        weight: castIntOrUndefined(opts.signer.weight)
      };
      switch (opts.signer.type) {
        case "ed25519PublicKey":
          signer.ed25519PublicKey = opts.signer.content;
          break;
        case "sha256Hash":
        case "preAuthTx":
          signer[opts.signer.type] = Buffer.from(opts.signer.content, "hex");
          break;
        default:
          throw new Error('Invalid signer type');
      }
    } else {
      throw new Error('Enter signer key and weight');
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
    homeDomain: castStringOrUndefined(opts.homeDomain),
    source: opts.sourceAccount,
  })
}

Libify.Operation.manageData = function(opts) {
  assertNotEmpty(opts.name, 'Manage Data operation requires entry name');

  return Sdk.Operation.manageData({
    name: opts.name,
    value: castStringOrNull(opts.value),
    source: opts.sourceAccount,
  })
}

Libify.Operation.bumpSequence = function(opts) {
  assertNotEmpty(opts.bumpTo, 'Sequence number should be set');
  return Sdk.Operation.bumpSequence({
    bumpTo: opts.bumpTo,
    source: opts.sourceAccount,
  })
}

// buildTransaction is not something found js-stellar libs but acts as an
// abstraction to building a transaction with input data in the same format
// as the reducers
Libify.buildTransaction = function(attributes, operations, networkObj) {
  Sdk.Network.use(networkObj);
  let result = {
    errors: [],
    xdr: '',
  };

  try {
    var account = new Sdk.Account(attributes.sourceAccount, Sdk.UnsignedHyper.fromString(attributes.sequence).subtract(1).toString());

    let opts = {};
    if (attributes.fee !== '') {
      const MAX_UINT32 = Math.pow( 2, 32 ) - 1;
      if (parseInt(attributes.fee) > MAX_UINT32) {
        throw Error(`Base Fee: too large (invalid 32-bit unisigned integer)`);
      }
      
      opts.fee = attributes.fee;
    }

    let timebounds = {};

    if (attributes.minTime !== '') {
      timebounds.minTime = attributes.minTime;
    }

    if (attributes.maxTime !== '') {
      timebounds.maxTime = attributes.maxTime;
    }

    if (!_.isEmpty(timebounds)) {
      opts.timebounds = _.defaults(timebounds, {
        minTime: '0',
        maxTime: '0'
      });
    }

    var transaction = new Sdk.TransactionBuilder(account, opts)

    if (attributes.memoType !== 'MEMO_NONE' && attributes.memoType !== '') {
      try {
        transaction = transaction.addMemo(Libify.Memo({
          type: attributes.memoType,
          content: attributes.memoContent,
        }));
      } catch(e) {
        result.errors.push(`Memo: ${e.message}`);
      }
    }

    _.each(operations, (op, index) => {
      try {
        transaction = transaction.addOperation(Libify.Operation(op.name, op.attributes));
      } catch(e) {
        result.errors.push(`Operation #${index + 1}: ${e.message}`);
      }
    })

    transaction = transaction.build();
    result.xdr = transaction.toEnvelope().toXDR('base64');
    result.hash = transaction.hash().toString('hex');
  } catch(e) {
    result.errors.push(e.message);
  }

  return result;
}


Libify.signTransaction = function(txXdr, signers, networkObj, ledgerWalletSigs) {
  Sdk.Network.use(networkObj);

  let validSecretKeys = [];
  let validPreimages = [];
  for (let i = 0; i < signers.length; i++) {
    let signer = signers[i];
    if (signer !== null && !_.isUndefined(signer) && signer !== '') {
      // Signer
      if (signer.charAt(0) == 'S') {
        if (!Sdk.StrKey.isValidEd25519SecretSeed(signer)) {
          return {
            message: 'One of secret keys is invalid'
          }
        }
        validSecretKeys.push(signer);
      } else {
        // Hash preimage
        if (!signer.match(/^[0-9a-f]{2,128}$/gi) || signer.length % 2 == 1) {
          return {
            message: 'Hash preimage is invalid'
          }
        }
        validPreimages.push(signer);
      }
    }
  }

  let newTx = new Sdk.Transaction(txXdr);
  let existingSigs = newTx.signatures.length;
  let addedSigs = 0;

  _.each(validSecretKeys, (signer) => {
    addedSigs++;
    newTx.sign(Sdk.Keypair.fromSecret(signer));
  });
  _.each(validPreimages, (signer) => {
    addedSigs++;
    newTx.signHashX(Buffer.from(signer, 'hex'));
  });
  _.each(ledgerWalletSigs, (ledgerSig) => {
    addedSigs++;
    newTx.signatures.push(ledgerSig);
  });


  if (addedSigs < 1) {
    return {
      message: 'Enter a secret key to sign message'
    }
  }

  return {
    xdr: newTx.toEnvelope().toXDR('base64'),
    message: `${addedSigs} signature(s) added; ${existingSigs + addedSigs} signature(s) total`,
  };
}

export default Libify;
