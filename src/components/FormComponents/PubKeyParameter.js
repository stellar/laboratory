import FormComponentGenerator from './FormComponentGenerator';
import {Account} from 'stellar-sdk';

export default FormComponentGenerator({
  labels: { // (optional) key is the form type. Value is the displayed text.
    'account_id': 'Account ID',
    'source_account': 'Source Account',
    'destination_account': 'Destination Account',
  },
  defaultLabel: 'Public Key',
  fields: [
    {
      type: 'text',
      name: 'pubKey',
      validator: (value) => Account.isValidAddress(value) ? null : 'Public key is invalid.',
    },
  ],
});
