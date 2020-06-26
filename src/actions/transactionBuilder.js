import axios from 'axios';
import {UnsignedHyper} from 'stellar-sdk';

// Resets everything to it's default state
export const RESET_TXBUILDER = 'RESET_TXBUILDER';
export function resetTxbuilder() {
  return {
    type: RESET_TXBUILDER,
  }
}

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
  return () => {
    return {
      type: ADD_OPERATION,
      opId: Date.now(),
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
// This is only meant to be used for fetching *next* sequence number for txbuilder
export function fetchSequence(accountId, horizonBaseUrl) {
  return dispatch => {
    dispatch({
      type: FETCH_SEQUENCE_START,
    });
    axios.get(horizonBaseUrl + '/accounts/' + accountId)
      .then(r => dispatch({
        type: FETCH_SEQUENCE_SUCCESS,
        sequence: UnsignedHyper.fromString(r.data.sequence).add(1).toString()
      }))
      .catch(r => dispatch({type: FETCH_SEQUENCE_FAIL, payload: r}))
  }
}


export const FETCH_BASE_FEE = 'FETCH_BASE_FEE';
export const FETCH_BASE_FEE_FAIL = 'FETCH_BASE_FEE_FAIL';
export const FETCH_BASE_FEE_SUCCESS = 'FETCH_BASE_FEE_SUCCESS';
export function fetchBaseFee(horizonBaseUrl) {
  return dispatch => {
    dispatch({
      type: FETCH_BASE_FEE
    });
    axios.get(horizonBaseUrl + '/fee_stats')
      .then(r => dispatch({
        type: FETCH_BASE_FEE_SUCCESS,
        base_fee: r.data.fee_charged.mode
      }))
      .catch(r => dispatch({type: FETCH_BASE_FEE_FAIL, payload: r}))
  }
}

export const REGULAR_TX = 'REGULAR_TX';
export const FEE_BUMP_TX = 'FEE_BUMP_TX';
export const UPDATE_TX_TYPE = 'UPDATE_TX_TYPE';
export function updateTxType(txType) {
  return {
    type: UPDATE_TX_TYPE,
    txType,
  }
}

export const UPDATE_FEE_BUMP_ATTRIBUTE = 'UPDATE_FEE_BUMP_ATTRIBUTE';
export function updateFeeBumpAttribute(newAttribute) {
  return {
    type: UPDATE_FEE_BUMP_ATTRIBUTE,
    newAttribute,
  }
}


