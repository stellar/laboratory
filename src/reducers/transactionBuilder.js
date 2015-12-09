import {combineReducers} from 'redux';
import {UPDATE_ATTRIBUTES} from '../actions/transactionBuilder';
import _ from 'lodash';

const transactionBuilder = combineReducers({
  attributes,
  operations,
})

export default transactionBuilder

function operations(state = [], action) {
  switch (action.type) {
  case 'ADD_OPERATION':
    return Array.prototype.concat(state, {
      id: action.opId,
      type: '',
      attributes: {},
    });
  case 'REMOVE_OPERATION':
    return _(state)
      .cloneDeep()
      .remove({
        opId: opId
      })
      .value();
  case 'UPDATE_OPERATION':
    let ops = _(state).cloneDeep();
    let targetOp = _.find(ops, { opId: action.opId });
    // TODO: interpret from picker
    targetOp = Object.assign(targetOp, action.opAttributes);
    return ops;
  default:
    return state;
  }
}

function attributes(state = {
    sourceAccount: '',
    sequence: 0,
    fee: '0.0000100',
    memoType: 'MEMO_NONE',
    memoContent: '',
  }, action) {
  if (action.type == UPDATE_ATTRIBUTES) {
    return Object.assign({}, state, action.newAttributes);
  }
  return state;
}
