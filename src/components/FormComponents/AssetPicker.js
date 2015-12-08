import PickerGenerator from './PickerGenerator';
import {Account} from 'stellar-sdk';

export default PickerGenerator({
  pickerName: 'Asset',
  fields: [
    {
      type: 'radio',
      options: [
        {
          name: 'native', // Just used internally for keys. Must be unique within this set of options
          label: 'native', // Displayed to the user (can't be used for keys in case of localization)
          value: 'native', // Must be non-empty string
        },
        {
          name: 'alphanum4',
          label: 'Alphanumeric 4',
          value: 'alphanum4',
        },
        {
          name: 'alphanum12',
          label: 'Alphanumeric 12',
          value: 'alphanum12',
        },
      ],
      name: 'type',
      validator: value => null,
    },
    {
      type: 'text',
      name: 'code',
      placeholder: 'asset code',
      forceRequired: true, // If field is showing, it is required (even if picker is optional)
      showIf: isNonNativeAsset,
      validator: (value, fields) => { // We rarely need the second argument to validator, but in this case, we do
        let minLength, maxLength;
        if (fields.type.value === 'alphanum4') {
          minLength = 1;
          maxLength = 4;
        } else if (fields.assetType.value === 'alphanum12') {
          minLength = 5;
          maxLength = 12;
        }

        if (value && !value.match(/^[a-zA-Z0-9]+$/g)) {
          return 'Asset code must consist of only letters and numbers.';
        } else if (value.length > maxLength || value.length < minLength) {
          return `Asset code must be between ${minLength} and ${maxLength} characters long.`;
        }

        return null;
      },
    },
    {
      type: 'text',
      name: 'issuer',
      placeholder: 'issuer account ID',
      forceRequired: true, // If field is showing, it is required (even if picker is optional)
      showIf: isNonNativeAsset,
      validator: (value) => Account.isValidAddress(value) ? null : 'Public key is invalid.',
    },
  ],
});

function isNonNativeAsset(fields) {
  return fields.type.value !== 'native' && fields.type.value !== '';
}
