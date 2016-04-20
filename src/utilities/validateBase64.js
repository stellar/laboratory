import _ from 'lodash';

export default function validateBase64(input) {
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

  return {result: 'success'};
}
