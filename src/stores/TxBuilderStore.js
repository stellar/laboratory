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
    this._nextOperationKey = 0;

    // Pre-populate with the initial operation
    this._addOperation({
      type: 'payment', // TODO: type can be undefined meaning operation type not picked yet
      destination: 'GAAAA',
      asset: {
        code: 'xlm',
        issuer: undefined,
      },
      amount: '100'
    });
  }

  // Converts this._txOperations Object to an Array of the operations in order
  getOperationList() {
    return _.map(this._txOperationsOrder, (key, value) => {
      return this._txOperations[key];
    })
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
  _addOperation(opts) {
    let newOpKey = this._getNextOperationKey();
    this._txOperations[newOpKey] = opts;
    this._txOperationsOrder.push(newOpKey);
  }
  _removeOperation(key) {
    let opIndex = this._txOperationsOrder.indexOf(key);
    if (opIndex === -1) {
      throw new Error('No operation with key ' + key + ' found when removing operation');
      return;
    }

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
    case TxBuilderConstants.UPDATE_OPERATION:
      // 1. When parameters of an operation is updated
      TxBuilderStore._updateOperation(action.opKey, action.opAttributes);
      break;
    case TxBuilderConstants.ADD_OPERATION:
      // 1. When a new operation is created
      TxBuilderStore._addOperation(action.opts);
      break;
    case TxBuilderConstants.REMOVE_OPERATION:
      // 1. When an operation is removed
      TxBuilderStore._removeOperation(action.key);
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
