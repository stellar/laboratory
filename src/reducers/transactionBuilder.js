import {combineReducers} from 'redux';
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import {BASE_FEE} from 'stellar-sdk'
import {
  UPDATE_ATTRIBUTES,
  FETCH_SEQUENCE_START,
  FETCH_SEQUENCE_SUCCESS,
  FETCH_SEQUENCE_FAIL,
  RESET_TXBUILDER,
  FETCH_BASE_FEE_SUCCESS,
  FETCH_BASE_FEE_FAIL,
  UPDATE_TX_TYPE,
  UPDATE_FEE_BUMP_ATTRIBUTE,
} from '../actions/transactionBuilder';
import {LOAD_STATE} from '../actions/routing';
import {rehydrate} from '../utilities/hydration';
import SLUG from '../constants/slug';
import TX_TYPES from '../constants/transaction_types';

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
        return rehydrate(action.queryObj.params).operations || defaultOperations;
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
    return filter(state.slice(), (op) => op.id != action.opId);
  case 'REORDER_OPERATION':
    return reorderOps(state, action.opId, action.toNth);
  case 'UPDATE_OPERATION_TYPE':
    return updateOperation(state, action.opId, {
      name: action.newType,
      attributes: {},
    });
  case 'UPDATE_OPERATION_ATTRIBUTES':
    return updateOperation(state, action.opId, {
      attributes: assign({}, getAttributes(state, action.opId), action.newAttributes),
    });
  case RESET_TXBUILDER:
    return defaultOperations;
  }
  return state;
}
function getAttributes(state, opId) {
  return find(state, { id: opId }).attributes;
}
function updateOperation(state, opId, newSource) {
  let targetOpIndex = findIndex(state, { id: opId });
  let newOps = state.slice();
  newOps[targetOpIndex] = assign({}, newOps[targetOpIndex], newSource);
  return newOps;
}
function updateSigner(state, opId, newSource) {
  let targetOpIndex = findIndex(state, { id: opId });
  let newOps = state.slice();
  newOps[targetOpIndex] = assign({}, newOps[targetOpIndex], newSource);
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
  let targetOpIndex = findIndex(ops, { id: opId });
  let targetOp = ops[targetOpIndex];
  ops.splice(targetOpIndex, 1);
  ops.splice(toNth - 1, 0, targetOp);
  return ops;
}

const defaultAttributes = {
  sourceAccount: '',
  sequence: '',
  fee: BASE_FEE,
  memoType: '',
  memoContent: '',
  minTime: '',
  maxTime: '',
};

function attributes(state = defaultAttributes, action) {
  switch(action.type) {
  case LOAD_STATE:
    if (action.queryObj.params) {
      return assign({}, defaultAttributes, rehydrate(action.queryObj.params).attributes);
    }
    break;
  case UPDATE_ATTRIBUTES:
    return Object.assign({}, state, action.newAttributes);
  case FETCH_SEQUENCE_SUCCESS:
    return Object.assign({}, state, { sequence: action.sequence });
  case FETCH_BASE_FEE_SUCCESS:
    return Object.assign({}, state, { fee: action.base_fee });
  case FETCH_BASE_FEE_FAIL:
    return Object.assign({}, state, { fee: defaultAttributes.fee });
  case RESET_TXBUILDER:
    return defaultAttributes;
  }
  return state;
}

const defaultFeeBumpAttributes = {
  sourceAccount: '',
  maxFee: BASE_FEE,
  innerTxXDR: '',
}

function feeBumpAttributes(state = defaultFeeBumpAttributes, action) {
  switch(action.type) {
    case LOAD_STATE:
      if (action.queryObj.params) {
        return assign({}, defaultFeeBumpAttributes, rehydrate(action.queryObj.params).feeBumpAttributes);
      }
      break;
    case UPDATE_FEE_BUMP_ATTRIBUTE:
      return Object.assign({}, state, action.newAttribute)
    case RESET_TXBUILDER:
      return defaultFeeBumpAttributes;
  }
  return state;
}

function txType(state = TX_TYPES.REGULAR, action) {
  switch(action.type) {
    case LOAD_STATE:
      if (action.queryObj.params) {
        const prevTxType = rehydrate(action.queryObj.params).txType;
        return [TX_TYPES.REGULAR, TX_TYPES.FEE_BUMP].indexOf(prevTxType) > -1 ? prevTxType : TX_TYPES.REGULAR;
      }
      break;
    case UPDATE_TX_TYPE:
      return action.txType;
    case RESET_TXBUILDER:
      return TX_TYPES.REGULAR;
  }
  return state;
}

function sequenceFetcherError(state = '', action) {
  let payload = action.payload;
  if (action.type === FETCH_SEQUENCE_FAIL) {
    if (payload.response.data.title === 'Resource Missing') {
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
  txType,
  feeBumpAttributes,
})

export default transactionBuilder
