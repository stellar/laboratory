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
      name: 'createAccount',
      attributes: {},
    });
  case 'REMOVE_OPERATION':
    return _.filter(state.slice(), (op) => op.id != action.opId);
  case 'UPDATE_OPERATION_TYPE':
    return updateOperation(state, action.opId, {
      name: action.newType,
      action: {},
    });
  case 'UPDATE_OPERATION_ATTRIBUTES':
    return updateOperation(state, action.opId, {
      attributes: _.assign({}, getAttributes(action.opId), newAttributes),
    });
  default:
    return state;
  }
}
function getAttributes(state, opId) {
  return _.find(ops, { opId: action.opId }).attributes;
}
function updateOperation(state, opId, newSource) {
  let targetOpIndex = _.findIndex(ops, { opId: action.opId });
  let newOps = state.slice();
  newOps[targetOpIndex] = _.assign({}, newOps[targetOpIndex], newSource);
  return newOps;
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
