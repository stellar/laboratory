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
import defaults from 'lodash/defaults';
import each from 'lodash/each';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import { createPredicate } from "../utilities/claimantHelpers";

// Helpers
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
  if (isString(value) && value.match(/^[0-9]+$/g)) {
    return Number(value);
  }
  return undefined;
}

// This function processes the value in three situations:
// 1. Is a string: return as is
// 2. String is empty: converts to undefined (useful for optional arguments)
let castStringOrUndefined = function(value) {
  if (!isString(value) || value === '') {
    return undefined;
  }
  return String(value);
}

let castStringOrNull = function(value) {
  if (!isString(value) || value === '') {
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

Libify.Claimant = function(opts) {
  if (opts.predicate && opts.predicate.unconditional) {
    return new Sdk.Claimant(opts.destination);
  }

  // Predicate validation is handled in createPredicate()
  return new Sdk.Claimant(opts.destination, createPredicate(opts.predicate));
}

// Takes in a type and a pile of options and attempts to turn it into a valid
// js-stellar-sdk operation. If not, it will throw an error.
Libify.Operation = function(type, opts) {
  assertNotEmpty(type, 'Operation type is required');
  let opFunction = Libify.Operation[type];
  if (typeof opFunction === 'undefined' || has(Libify.Operation, 'opFunction')) {
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
    withMuxing: true,
  })
}

Libify.Operation.pathPaymentStrictSend = function(opts) {
  assertNotEmpty(opts.sendAsset, 'Path Payment Strict Send operation requires sending asset');
  assertNotEmpty(opts.sendAmount, 'Path Payment Strict Send operation requires send amount');
  assertNotEmpty(opts.destination, 'Path Payment Strict Send operation requires destination');
  assertNotEmpty(opts.destAsset, 'Path Payment Strict Send operation requires destination asset');
  assertNotEmpty(opts.destMin, 'Path Payment Strict Send operation requires the minimum destination amount');

  let libifiedPath = map(opts.path, (hopAsset) => {
    if (isUndefined(hopAsset.type)) {
      throw new Error('All assets in path must be filled out');
    }
    return Libify.Asset(hopAsset);
  })

  return Sdk.Operation.pathPaymentStrictSend({
    sendAsset: Libify.Asset(opts.sendAsset),
    sendAmount: opts.sendAmount,
    destination: opts.destination,
    destAsset: Libify.Asset(opts.destAsset),
    destMin: opts.destMin,
    path: libifiedPath,
    source: opts.sourceAccount,
    withMuxing: true,
  })
}

Libify.Operation.pathPaymentStrictReceive = function(opts) {
  assertNotEmpty(opts.sendAsset, 'Path Payment Strict Receive operation requires sending asset');
  assertNotEmpty(opts.sendMax, 'Path Payment Strict Receive operation requires max send');
  assertNotEmpty(opts.destination, 'Path Payment Strict Receive operation requires destination');
  assertNotEmpty(opts.destAsset, 'Path Payment Strict Receive operation requires destination asset');
  assertNotEmpty(opts.destAmount, 'Path Payment Strict Receive operation requires the destination amount');

  let libifiedPath = map(opts.path, (hopAsset) => {
    if (isUndefined(hopAsset.type)) {
      throw new Error('All assets in path must be filled out');
    }
    return Libify.Asset(hopAsset);
  })

  return Sdk.Operation.pathPaymentStrictReceive({
    sendAsset: Libify.Asset(opts.sendAsset),
    sendMax: opts.sendMax,
    destination: opts.destination,
    destAsset: Libify.Asset(opts.destAsset),
    destAmount: opts.destAmount,
    path: libifiedPath,
    source: opts.sourceAccount,
    withMuxing: true,
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
    authorize: Number(opts.authorize),
    source: opts.sourceAccount,
  })
}

Libify.Operation.accountMerge = function(opts) {
  assertNotEmpty(opts.destination, 'Account Merge operation requires destination');
  return Sdk.Operation.accountMerge({
    destination: opts.destination,
    source: opts.sourceAccount,
    withMuxing: true,
  })
}

Libify.Operation.manageSellOffer = function(opts) {
  assertNotEmpty(opts.selling, 'Manage Sell Offer operation requires selling asset');
  assertNotEmpty(opts.buying, 'Manage Sell Offer operation requires buying asset');
  assertNotEmpty(opts.amount, 'Manage Sell Offer operation requires amount');
  assertNotEmpty(opts.price, 'Manage Sell Offer operation requires price');
  assertNotEmpty(opts.offerId, 'Manage Sell Offer operation requires Offer ID');
  return Sdk.Operation.manageSellOffer({
    selling: Libify.Asset(opts.selling),
    buying: Libify.Asset(opts.buying),
    amount: opts.amount,
    price: opts.price,
    offerId: opts.offerId,
    source: opts.sourceAccount,
  })
}

Libify.Operation.manageBuyOffer = function(opts) {
  assertNotEmpty(opts.selling, 'Manage Buy Offer operation requires selling asset');
  assertNotEmpty(opts.buying, 'Manage Buy Offer operation requires buying asset');
  assertNotEmpty(opts.buyAmount, 'Manage Buy Offer operation requires buyAmount');
  assertNotEmpty(opts.price, 'Manage Buy Offer operation requires price');
  assertNotEmpty(opts.offerId, 'Manage Buy Offer operation requires Offer ID');
  return Sdk.Operation.manageBuyOffer({
    selling: Libify.Asset(opts.selling),
    buying: Libify.Asset(opts.buying),
    buyAmount: opts.buyAmount,
    price: opts.price,
    offerId: opts.offerId,
    source: opts.sourceAccount,
  })
}

Libify.Operation.createPassiveSellOffer = function(opts) {
  assertNotEmpty(opts.selling, 'Create Passive Sell Offer operation requires selling asset');
  assertNotEmpty(opts.buying, 'Create Passive Sell Offer operation requires buying asset');
  assertNotEmpty(opts.amount, 'Create Passive Sell Offer operation requires amount');
  assertNotEmpty(opts.price, 'Create Passive Sell Offer operation requires price');
  return Sdk.Operation.createPassiveSellOffer({
    selling: Libify.Asset(opts.selling),
    buying: Libify.Asset(opts.buying),
    amount: opts.amount,
    price: opts.price,
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

Libify.Operation.claimClaimableBalance = function(opts) {
  assertNotEmpty(opts.balanceId, 'Claim Claimable Balance operation requires claimable balance ID');

  return Sdk.Operation.claimClaimableBalance({
    balanceId: opts.balanceId,
    claimant: opts.sourceAccount,
  });
}

Libify.Operation.createClaimableBalance = function(opts) {
  assertNotEmpty(opts.asset, 'Create Claimable Balance operation requires asset');
  assertNotEmpty(opts.amount, 'Create Claimable Balance operation requires amount');
  assertNotEmpty(opts.claimants, 'Create Claimable Balance operation requires at least one claimant');

  let libifiedClaimants = map(opts.claimants, (claimant) => {
    if (!claimant || !claimant.destination) {
      throw new Error('Create Claimable Balance operation requires claimant destination');
    } else if (!claimant.predicate) {
      throw new Error('Create Claimable Balance operation requires claimant predicate');
    }

    return Libify.Claimant(claimant);
  });

  return Sdk.Operation.createClaimableBalance({
    asset: Libify.Asset(opts.asset),
    amount: opts.amount,
    claimants: libifiedClaimants,
    source: opts.sourceAccount,
  });
}

Libify.Operation.beginSponsoringFutureReserves = function(opts) {
  assertNotEmpty(opts.sponsoredId, 'Sponsored ID should be set');
  return Sdk.Operation.beginSponsoringFutureReserves({
    sponsoredId: opts.sponsoredId,
    source: opts.sourceAccount,
  })
}

Libify.Operation.endSponsoringFutureReserves = function(opts) {
  return Sdk.Operation.endSponsoringFutureReserves({
    source: opts.sourceAccount
  })
}

Libify.Operation.revokeSponsorship = function(opts) {
  if (!(opts.revoke && opts.revoke.type && opts.revoke.fields)) {
    throw new Error("Revoke Sponsorship Type should be selected");
  }

  switch(opts.revoke.type) {
    case "account":
      assertNotEmpty(opts.revoke.fields.account, 'Account should be set');

      return Sdk.Operation.revokeAccountSponsorship({
        account: opts.revoke.fields.account,
        source: opts.sourceAccount,
      });
    case "trustline":
      assertNotEmpty(opts.revoke.fields.account, 'Account should be set');
      assertNotEmpty(opts.revoke.fields.asset, 'Asset should be set');

      return Sdk.Operation.revokeTrustlineSponsorship({
        account: opts.revoke.fields.account,
        asset: Libify.Asset(opts.revoke.fields.asset),
        source: opts.sourceAccount
      });
    case "offer":
      assertNotEmpty(opts.revoke.fields.seller, 'Seller should be set');
      assertNotEmpty(opts.revoke.fields.offerId, 'Offer ID should be set');

      if (opts.revoke.fields.offerId && isNaN(opts.revoke.fields.offerId)) {
        throw new Error("Offer ID should be a number");
      }

      return Sdk.Operation.revokeOfferSponsorship({
        seller: opts.revoke.fields.seller,
        offerId: opts.revoke.fields.offerId,
        source: opts.sourceAccount
      });
    case "data":
      assertNotEmpty(opts.revoke.fields.account, 'Account should be set');
      assertNotEmpty(opts.revoke.fields.name, 'Name should be set');

      return Sdk.Operation.revokeDataSponsorship({
        account: opts.revoke.fields.account,
        name: opts.revoke.fields.name,
        source: opts.sourceAccount
      });
    case "claimableBalance":
      assertNotEmpty(opts.revoke.fields.balanceId, 'Claimable balance ID should be set');

      return Sdk.Operation.revokeClaimableBalanceSponsorship({
        balanceId: opts.revoke.fields.balanceId,
        source: opts.sourceAccount
      });
    case "signer":
      const signer = opts.revoke.fields.signer;

      assertNotEmpty(opts.revoke.fields.account, 'Account should be set');
      assertNotEmpty(signer, 'Signer should be set');

      if (signer) {
        assertNotEmpty(signer.content, 'Signer content should be set');
      }

      return Sdk.Operation.revokeSignerSponsorship({
        account: opts.revoke.fields.account,
        signer: {
          [signer.type]: signer.content
        },
        source: opts.sourceAccount
      });
    default:
      return;
  }
}

Libify.Operation.clawback = function(opts) {
  assertNotEmpty(opts.asset, 'Clawback operation requires asset');
  assertNotEmpty(opts.from, 'Clawback operation requires account from which the asset is clawed back');
  assertNotEmpty(opts.amount, 'Clawback operation requires amount clawed back');
  return Sdk.Operation.clawback({
    asset: Libify.Asset(opts.asset),
    from: opts.from,
    amount: opts.amount,
    source: opts.sourceAccount,
  })
}

Libify.Operation.clawbackClaimableBalance = function(opts) {
  assertNotEmpty(opts.balanceId, 'Clawback Claimable Balance operation requires claimable balance ID');

  return Sdk.Operation.clawbackClaimableBalance({
    balanceId: opts.balanceId,
  });
}

Libify.Operation.setTrustLineFlags = function(opts) {
  assertNotEmpty(opts.asset, 'Set Trust Line Flags operation requires asset');
  assertNotEmpty(opts.trustor, 'Set Trust Line Flags operation requires trustor');

  if (
    !(opts.setFlags && opts.setFlags.length) &&
    !(opts.clearFlags && opts.clearFlags.length)
  ) {
    throw new Error(
      "Set Trust Line Flags operation requires at least one flag to be selected"
    );
  }

  const flagLabels = {
    authorized: "Authorized",
    authorizedToMaintainLiabilities: "Authorized to maintain liabilites",
    clawbackEnabled: "Clawback enabled",
  };

  let flags = (opts.setFlags || []).reduce(
    (setFlagsResult, flag) => ({ ...setFlagsResult, [flag]: true }),
    {}
  );

  flags = (opts.clearFlags || []).reduce((clearFlagsResult, flag) => {
    if (clearFlagsResult[flag]) {
      throw new Error(
        `Set Trust Line Flags operation cannot set and clear the same flag (${flagLabels[flag]})`
      );
    }

    return { ...clearFlagsResult, [flag]: false };
  }, flags);

  return Sdk.Operation.setTrustLineFlags({
    asset: Libify.Asset(opts.asset),
    trustor: opts.trustor,
    flags,
    source: opts.sourceAccount,
  });
}

// buildTransaction is not something found js-stellar libs but acts as an
// abstraction to building a transaction with input data in the same format
// as the reducers
Libify.buildTransaction = function(attributes, operations, networkPassphrase) {
  let result = {
    errors: [],
    xdr: '',
  };

  try {
    let account;
    const sequence = Sdk.UnsignedHyper.fromString(attributes.sequence).subtract(1).toString();

    if (Sdk.StrKey.isValidMed25519PublicKey(attributes.sourceAccount)) {
      account = new Sdk.MuxedAccount.fromAddress(attributes.sourceAccount, sequence);
    } else {
      account = new Sdk.Account(attributes.sourceAccount, sequence);
    }

    let opts = {
      networkPassphrase,
      withMuxing: true,
    };
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

    opts.timebounds = defaults(timebounds, {
      minTime: '0',
      maxTime: '0'
    });

    var transaction = new Sdk.TransactionBuilder(account, opts);

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

    each(operations, (op, index) => {
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

Libify.buildFeeBumpTransaction = function(attributes, networkPassphrase) {
  const result = {
    errors: [],
    xdr: '',
  }

  const { innerTxXDR, maxFee, sourceAccount } = attributes;
  let innerTx;
  try {
    innerTx = new Sdk.TransactionBuilder.fromXDR(innerTxXDR, networkPassphrase);
  } catch(e) {
    result.errors.push('Invalid inner transaction XDR.');
    return result;
  }

  if (typeof innerTx.operations === 'undefined') {
    result.errors.push('Inner transaction must be a regular transaction.')
    return result;
  }

  let keyPair;
  try {
    keyPair = Sdk.Keypair.fromPublicKey(sourceAccount)
  } catch(e){
    result.errors.push(e.message);
    return result;
  }

  let feeBumpTx;
  try {
    feeBumpTx = new Sdk.TransactionBuilder.buildFeeBumpTransaction(
      keyPair,
      maxFee,
      innerTx,
      networkPassphrase,
      true // withMuxing
    );
    result.xdr = feeBumpTx.toEnvelope().toXDR('base64');
  } catch(e){
    result.errors.push(e.message);
  }
  return result;
}


Libify.signTransaction = function(txXdr, signers, networkPassphrase, ledgerWalletSigs) {
  let validSecretKeys = [];
  let validPreimages = [];
  for (let i = 0; i < signers.length; i++) {
    let signer = signers[i];
    if (signer !== null && !isUndefined(signer) && signer !== '') {
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

  let newTx = Sdk.TransactionBuilder.fromXDR(txXdr, networkPassphrase);
  let existingSigs = newTx.signatures.length;
  let addedSigs = 0;

  each(validSecretKeys, (signer) => {
    addedSigs++;
    newTx.sign(Sdk.Keypair.fromSecret(signer));
  });
  each(validPreimages, (signer) => {
    addedSigs++;
    newTx.signHashX(Buffer.from(signer, 'hex'));
  });
  each(ledgerWalletSigs, (ledgerSig) => {
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
