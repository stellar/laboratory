// Attributes
export const UPDATE_ATTRIBUTES = 'UPDATE_ATTRIBUTES';
export function updateAttributes(newAttributes) {
  return {
    type: UPDATE_ATTRIBUTES,
    b: UPDATE_ATTRIBUTES,
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

export const UPDATE_OPERATION = 'UPDATE_OPERATION';
export function updateOperation(opId, newContent) {
  return {
    type: UPDATE_OPERATION,
    opId,
    newContent,
  };
}

export const REORDER_OPERATION = 'REORDER_OPERATION';
export function reorderOperation() {
  return {
    type: REORDER_OPERATION,
  };
}
