import PickerGenerator from './PickerGenerator';
import {Account} from 'stellar-sdk';

export default PickerGenerator({
  defaultLabel: 'Public Key',
  fields: [{
    type: 'text',
    name: 'pubKey',
    validator: (value) => Account.isValidAddress(value) ? null : 'Public key is invalid.',
  }],
});
