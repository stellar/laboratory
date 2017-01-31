import {combineReducers} from 'redux';
import {
  UPDATE_ATTRIBUTES,
  FETCH_SEQUENCE_START,
  FETCH_SEQUENCE_SUCCESS,
  FETCH_SEQUENCE_FAIL,
  RESET_TXBUILDER,
} from '../actions/transactionBuilder';
import {LOAD_STATE} from '../actions/routing';
import _ from 'lodash';
import {rehydrate} from '../utilities/hydration';
import SLUG from '../constants/slug';

const defaultOperations = [{
  id: 0,
  attributes: {},
  name: '',
}];
function operations(state = defaultOperations, action) {
  let targetOpIndex, newOps;
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === SLUG.TXBUILDER) {
      if (action.queryObj.params) {
        // TODO: validate that this is actually a valid operations object
        return rehydrate(action.queryObj.params).operations;
      }
      return defaultOperations;
    }
    break;
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
      attributes: {},
    });
  case 'UPDATE_OPERATION_ATTRIBUTES':
    return updateOperation(state, action.opId, {
      attributes: _.assign({}, getAttributes(state, action.opId), action.newAttributes),
    });
  case RESET_TXBUILDER:
    return defaultOperations;
  }
  return state;
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
function updateSigner(state, opId, newSource) {
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

const defaultAttributes = {
  sourceAccount: '',
  sequence: '',
  fee: '',
  memoType: '',
  memoContent: '',
  minTime: '',
  maxTime: '',
};
function attributes(state = defaultAttributes, action) {
  switch(action.type) {
  case LOAD_STATE:
    if (action.queryObj.params) {
      return _.assign({}, defaultAttributes, rehydrate(action.queryObj.params).attributes);
    }
    break;
  case UPDATE_ATTRIBUTES:
    return Object.assign({}, state, action.newAttributes);
  case FETCH_SEQUENCE_SUCCESS:
    return Object.assign({}, state, { sequence: action.sequence });
  case RESET_TXBUILDER:
    return defaultAttributes;
  }
  return state;
}

function sequenceFetcherError(state = '', action) {
  let payload = action.payload;
  if (action.type === FETCH_SEQUENCE_FAIL) {
    if (payload.data.title === 'Resource Missing') {
      return `Account not found. Make sure the correct network is selected and the account is funded/created.`;
    }
    if (payload.status === 0) {
      return `Unable to reach server at ${payload.config.url}`;
    }
    return JSON.stringify(action.payload, null, 2);
  }
  if (action.type === FETCH_SEQUENCE_START) {
    return '';
  }
  return state;
}

const transactionBuilder = combineReducers({
  attributes,
  operations,
  sequenceFetcherError,
})

export default transactionBuilder
