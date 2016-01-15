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

export const SET_SECRETS = 'SET_SECRETS';
export function setSecrets(secrets) {
  return {
    type: SET_SECRETS,
    secrets,
  }
}
