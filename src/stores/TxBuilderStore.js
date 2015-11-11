import {EventEmitter} from 'events';
import _ from 'lodash';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';

class TxBuilderStoreClass extends EventEmitter {
  constructor() {
    super();
    this._txAttributes = {
      'source_account': ''
    };

    // Keys are the unique operation number taken from this.getNextOperationKey
    // Value is the same as the opts passed to js-stellar-base Operation
    this._txOperations = {};

    // Array of numbers which represent the key of an operation in this._txOperations
    this._txOperationsOrder = [];
    this._nextOperationKey = 1;

    // Pre-populate with the initial operation
    this._addOperation();
  }

  // Converts this._txOperations Object to an Array of the operations in order
  getOperationList() {
    return _.map(this._txOperationsOrder, (key, index) => {
      return this._txOperations[key];
    })
  }

  // Internal helper methods
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

  // Methods that respond to actions
  _updateAttributes(txAttributes) {
    // TODO: Validate source account
    this._txAttributes.sourceAccount = txAttributes.sourceAccount;

    // TODO: memo
  }
  _updateOperation(opKey, opAttributes) {
    this._keyIndex(opKey); // Check if key is valid
    _.merge(this._txOperations[opKey], opAttributes); // TODO: validate operation
  }
  _addOperation(opts) {
    let newOpKey = this._getNextOperationKey();
    this._txOperations[newOpKey] = {
      key: newOpKey,
      type: null,
    };
    this._txOperationsOrder.push(newOpKey);
  }
  _removeOperation(key) {
    let opIndex = this._keyIndex(key);

    this._txOperationsOrder.splice(opIndex, 1);
    delete this._txOperations[key];
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
