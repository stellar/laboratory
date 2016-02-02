import axios from 'axios';

// Attributes
export const UPDATE_ATTRIBUTES = 'UPDATE_ATTRIBUTES';
export function updateAttributes(newAttributes) {
  return {
    type: UPDATE_ATTRIBUTES,
    newAttributes,
  }
}

// Operations
export const ADD_OPERATION = 'ADD_OPERATION';
export let addOperation = (() => {
  let counter = 0;

  return () => {
    counter++;
    return {
      type: ADD_OPERATION,
      opId: counter
    };
  }
})();

export const REMOVE_OPERATION = 'REMOVE_OPERATION';
export function removeOperation(opId) {
  return {
    type: REMOVE_OPERATION,
    opId,
  };
}

export const UPDATE_OPERATION_TYPE = 'UPDATE_OPERATION_TYPE';
export function updateOperationType(opId, newType) {
  return {
    type: UPDATE_OPERATION_TYPE,
    opId,
    newType,
  };
}

export const UPDATE_OPERATION_ATTRIBUTES = 'UPDATE_OPERATION_ATTRIBUTES';
export function updateOperationAttributes(opId, newAttributes) {
  return {
    type: UPDATE_OPERATION_ATTRIBUTES,
    opId,
    newAttributes,
  };
}

export const REORDER_OPERATION = 'REORDER_OPERATION';
export function reorderOperation(opId, toNth) {
  return {
    type: REORDER_OPERATION,
    opId,
    toNth,
  };
}

export const FETCH_SEQUENCE = 'FETCH_SEQUENCE';
export const FETCH_SEQUENCE_START = 'FETCH_SEQUENCE_START';
export const FETCH_SEQUENCE_FAIL = 'FETCH_SEQUENCE_FAIL';
export const FETCH_SEQUENCE_SUCCESS = 'FETCH_SEQUENCE_SUCCESS';
export function fetchSequence(accountId, horizonBaseUrl) {
  return dispatch => {
    dispatch({
      type: FETCH_SEQUENCE_START,
    });
    axios.get(horizonBaseUrl + '/accounts/' + accountId)
      .then(r => dispatch({type: FETCH_SEQUENCE_SUCCESS, sequence: r.data.sequence}))
      .catch(r => dispatch({type: FETCH_SEQUENCE_FAIL, payload: r}))
  }
}
