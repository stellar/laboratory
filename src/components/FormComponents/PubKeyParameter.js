import {Account} from 'stellar-sdk';
import TextFormGenerator from '../lib/TextFormGenerator';

export default TextFormGenerator({
  labels: { // (optional) key is the form type. Value is the displayed text
    'source_account': 'Source Account',
    'destination_account': 'Destination Account',
    'destination_asset_issuer': 'Destination Asset Issuer',
    'selling_asset_issuer': 'Selling Asset Issuer',
    'buying_asset_issuer': 'Buying Asset Issuer',
  },
  defaultLabel: 'Account ID',
  validator: (value) => {
    return Account.isValidAddress(value) ? null : 'Public key is invalid.';
  },
});
