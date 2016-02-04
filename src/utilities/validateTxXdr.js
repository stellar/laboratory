import {Transaction} from 'stellar-sdk';

export default function validateTxXdr(input) {
  input = _.trim(input);

  if (input === '') {
    return {
      result: 'empty',
    };
  }
  if (input.match(/^[-A-Za-z0-9+\/=]*$/) === null) {
    return {
      result: 'error',
      message: 'The input is not valid base64 (a-zA-Z0-9+/=).'
    };
  }
  try {
    new Transaction(input);
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
