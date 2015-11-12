import {EventEmitter} from 'events';
import _ from 'lodash';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';
import {Account, TransactionBuilder, Operation, Asset} from 'stellar-sdk';

const UPDATE_EVENT = 'update';

class TxBuilderStoreClass extends EventEmitter {
  constructor() {
    super();
    this._txAttributes = {
      'source_account': '',
      'sequence': 0,
    };

    // Keys are the unique operation number taken from this.getNextOperationKey
    // Value is the same as the opts passed to js-stellar-base Operation
    this._txOperations = {};

    // Array of numbers which represent the key of an operation in this._txOperations
    this._txOperationsOrder = [];
    this._nextOperationKey = 0;

    this._Xdr = '';

    // Pre-populate with the initial operation
    this._addOperation();

    // When support for operation type picking comes, this following line won't
    // be necessary since type will be able to be null.
    this._updateOperation(0, {
      type: 'payment',
      destination: 'GAIRISXKPLOWZBMFRPU5XRGUUX3VMA3ZEWKBM5MSNRU3CHV6P4PYZ74D',
      amount: '100',
    })
  }

  /*
    Getters
  */
  getTxAttributes() {
    return _.cloneDeep(this._txAttributes);
  }

  // Converts this._txOperations Object to an Array of the operations in order
  getOperationList() {
    return _.map(this._txOperationsOrder, (key, index) => {
      return _.cloneDeep(this._txOperations[key]);
    })
  }

  getXdr() {
    return this._Xdr;
  }

  addUpdateListener(callback) {
    this.on(UPDATE_EVENT, callback);
  }

  removeUpdateListener(callback) {
    this.removeListener(UPDATE_EVENT, callback);
  }

  /*
    Internal helper methods
  */
  _getNextOperationKey() {
    this._nextOperationKey++;
    return this._nextOperationKey - 1;
  }
  _keyIndex(key) {
    if (typeof key === 'undefined') {
      throw new Error('Operation key is undefined. The key attribute might be missing from the action that called this.');
    }

    let opIndex = this._txOperationsOrder.indexOf(key);
    if (opIndex === -1) {
      throw new Error('No operation with key ' + key + ' found.');
    }
    if (typeof this._txOperations[key] === 'undefined') {
      throw new Error(`Invariant broken: Operation with key ${key} exists in this._txOperationsOrder but not in this._txOperations`);
    }
    return opIndex;
  }

  /*
    Invariant keeper

    Gets run after every action to calculate the XDR result (and later source
    code examples).
  */
  _recalculate() {
    try {
      var account = new Account(this._txAttributes.source_account,this._txAttributes.sequence);
      var transaction = new TransactionBuilder(account)

      _.each(this.getOperationList(), (op, index) => {
        transaction = transaction.addOperation(Operation[op.type]({
          destination: op.destination,
          asset: Asset.native(),
          amount: op.amount,
        }))
      })

      transaction = transaction.build();
      this._Xdr = transaction.toEnvelope().toXDR('base64');
    } catch(e) {
      console.error(e)
    }
  }

  /*
    Action handling methods
  */
  _updateAttributes(txAttributes) {
    // TODO: Validate source account
    this._txAttributes['source_account'] = txAttributes['source_account'];

    this._recalculate();
  }
  _updateOperation(opKey, opAttributes) {
    this._keyIndex(opKey); // Check if key is valid
    _.merge(this._txOperations[opKey], opAttributes); // TODO: validate operation

    this._recalculate();
  }
  _addOperation(opts) {
    let newOpKey = this._getNextOperationKey();
    this._txOperations[newOpKey] = {
      key: newOpKey,
      type: null,
    };
    this._txOperationsOrder.push(newOpKey);

    this._recalculate();
  }
  _removeOperation(key) {
    let opIndex = this._keyIndex(key);

    this._txOperationsOrder.splice(opIndex, 1);
    delete this._txOperations[key];

    this._recalculate();
  }
}

let TxBuilderStore = new TxBuilderStoreClass();
export default TxBuilderStore;

AppDispatcher.register(action => {
  switch(action.type) {
    case TxBuilderConstants.UPDATE_ATTRIBUTES:
      // 1. Overview attributes of a transaction is updated (like tx source account and memo)
      TxBuilderStore._updateAttributes(action.txAttributes);
      break;
    case TxBuilderConstants.ADD_OPERATION:
      // 1. When a new operation is created. addOperation can (and should) only
      // create a new blank operation
      TxBuilderStore._addOperation();
      break;
    case TxBuilderConstants.REMOVE_OPERATION:
      // 1. When an operation is removed
      TxBuilderStore._removeOperation(action.key);
      break;
    case TxBuilderConstants.UPDATE_OPERATION:
      // 1. When parameters of an operation is updated
      TxBuilderStore._updateOperation(action.key, action.opAttributes);
      break;
    // case TxBuilderConstants.ORDER_OPREATIONS:
    //   // 1. When operations are reordered
    //   TxBuilderStore._updateOperationList(action.operationList);
    //   break;
    // case TxBuilderConstants.IMPORT_OPERATION:
    //   // 1. When a transaction is imported from XDR
    //   TxBuilderStore._importOperation(action.resourceId);
    //   break;
    default:
  }
});
