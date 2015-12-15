import {combineReducers} from 'redux';
import {UPDATE_ATTRIBUTES} from '../actions/transactionBuilder';
import _ from 'lodash';

const transactionBuilder = combineReducers({
  attributes,
  operations,
})

export default transactionBuilder

function operations(state = [{
    id: 0,
    attributes: {},
    name: '',
  }], action) {
  let targetOpIndex, newOps;
  switch (action.type) {
  case 'ADD_OPERATION':
    return Array.prototype.concat(state, {
      id: action.opId,
      name: '',
      attributes: {},
    });
  case 'REMOVE_OPERATION':
    return _.filter(state.slice(), (op) => op.id != action.opId);
  case 'REORDER_OPERATION':
    return reorderOps(state, action.opId, action.toNth);
  case 'UPDATE_OPERATION_TYPE':
    return updateOperation(state, action.opId, {
      name: action.newType,
      action: {},
    });
  case 'UPDATE_OPERATION_ATTRIBUTES':
    return updateOperation(state, action.opId, {
      attributes: _.assign({}, getAttributes(state, action.opId), action.newAttributes),
    });
  default:
    return state;
  }
}
function getAttributes(state, opId) {
  return _.find(state, { id: opId }).attributes;
}
function updateOperation(state, opId, newSource) {
  let targetOpIndex = _.findIndex(state, { id: opId });
  let newOps = state.slice();
  newOps[targetOpIndex] = _.assign({}, newOps[targetOpIndex], newSource);
  return newOps;
}
function reorderOps(state, opId, toNth) {
  if (toNth < 1) {
    toNth = 1;
  }
  if (toNth > state.length) {
    toNth = state.length;
  }
  let ops = state.slice();
  let targetOpIndex = _.findIndex(ops, { id: opId });
  let targetOp = ops[targetOpIndex];
  ops.splice(targetOpIndex, 1);
  ops.splice(toNth - 1, 0, targetOp);
  return ops;
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
