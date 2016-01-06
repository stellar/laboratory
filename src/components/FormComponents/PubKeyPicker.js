import PickerGenerator from './PickerGenerator';
import {Account} from 'stellar-sdk';

export default PickerGenerator({
  pickerName: 'PubKey',
  fields: [{
    type: 'text',
    name: 'pubKey',
    placeholder: 'Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG',
    validator: (value) => Account.isValidAccountId(value) ? null : 'Public key is invalid.',
  }],
});
