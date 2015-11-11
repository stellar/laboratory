import {EventEmitter} from 'events';
import _ from 'lodash';
import {AppDispatcher} from '../dispatcher/AppDispatcher';

class TxBuilderStoreClass extends EventEmitter {
  constructor() {
    super();
    this._txAttributes = {};

    this._txOperations = {}; // Keys are the unique operation number
    this._txOperationsOrder = [];
    this._nextOperationKey = 0;
  }

  // Converts this._txOperations Object to an Array of the operations in order
  getOperationList() {
    return [];
  }

  // Internal helper methods
  _getNextOperationKey() {
    this._nextOperationKey++;
    return this._nextOperationKey - 1;
  }

  // Methods that respond to actions
  _updateAttributes(txAttributes) {
    this._txAttributes.sourceAccount = txAttributes.sourceAccount;
  }
  _updateOperation(opKey, opAttributes) {
    if (!(opKey in this._txOperations)) {
      throw new Error('Operation key ' + opKey + ' nonexistent');
      return;
    }

    // TODO: Validate source account
    this._txAttributes.sourceAccount = txAttributes.sourceAccount;

    // TODO: memo
  }
  _addOperation() {
    this._txOperations[this._getNextOperationKey];
    this._nextOperationKey++;
  }
}

export let TxBuilderStore = new TxBuilderStoreClass();

AppDispatcher.register(action => {
  switch(action.type) {
    case TxBuilderConstants.UPDATE_ATTRIBUTES:
      // 1. Overview attributes of a transaction is updated (like tx source account and memo)
      TxBuilderStore._updateAttributes(action.txAttributes);
      break;
    case TxBuilderConstants.UPDATE_OPERATION:
      // 1. When parameters of an operation is updated
      TxBuilderStore._updateOperation(action.opKey, action.opAttributes);
      break;
    case TxBuilderConstants.ADD_OPERATION:
      // 1. When a new operation is created
      TxBuilderStore._addOperation();
      break;
    // case TxBuilderConstants.REMOVE_OPERATION:
    //   // 1. When an operation is removed
    //   TxBuilderStore._updateOperationList(action.operationList);
    //   break;
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
