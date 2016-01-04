export const IMPORT_FROM_XDR = 'IMPORT_FROM_XDR';
export function importFromXdr(xdr) {
  return {
    type: IMPORT_FROM_XDR,
    xdr,
  }
}

export const CLEAR_TRANSACTION = 'CLEAR_TRANSACTION';
export function clearTransaction() {
  return {
    type: CLEAR_TRANSACTION,
  }
}

export const SET_SECRET = 'SET_SECRET';
export function setSecret(key) {
  return {
    type: SET_SECRET,
    key,
  }
}
