export const UPDATE_XDR_INPUT = 'UPDATE_XDR_INPUT';
export function updateXdrInput(input) {
  return {
    type: UPDATE_XDR_INPUT,
    input,
  }
}

export const UPDATE_XDR_TYPE = 'UPDATE_XDR_TYPE';
export function updateXdrType(xdrType) {
  return {
    type: UPDATE_XDR_TYPE,
    xdrType,
  }
}
