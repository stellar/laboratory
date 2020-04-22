import _ from 'lodash';
import { TransactionBuilder } from 'stellar-sdk';
import validateBase64 from './validateBase64';

export default function validateTxXdr(input, networkPassphrase) {
  input = _.trim(input);

  let base64Validation = validateBase64(input);
  if (base64Validation.result !== 'success') {
    return base64Validation;
  }

  try {
    TransactionBuilder.fromXDR(input, networkPassphrase);
    return {
      result: 'success',
      message: 'Valid Transaction Envelope XDR',
    }
  } catch (e) {
    return {
      result: 'error',
      message: 'Unable to parse input XDR into Transaction Envelope',
    };
  }
}
