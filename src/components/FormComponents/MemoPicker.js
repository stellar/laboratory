import PickerGenerator from './PickerGenerator';
import {UnsignedHyper} from 'stellar-sdk';

export default PickerGenerator({
  pickerName: 'Memo',
  fields: [
    {
      type: 'radio',
      options: [
        {
          name: 'MEMO_NONE',
          label: 'None',
          value: 'MEMO_NONE',
        },
        {
          name: 'MEMO_TEXT',
          label: 'Text',
          value: 'MEMO_TEXT',
        },
        {
          name: 'MEMO_ID',
          label: 'ID',
          value: 'MEMO_ID',
        },
        {
          name: 'MEMO_HASH',
          label: 'Hash',
          value: 'MEMO_HASH',
        },
        {
          name: 'MEMO_RETURN',
          label: 'Return',
          value: 'MEMO_RETURN',
        },
      ],
      name: 'type',
      default: 'MEMO_NONE',
      validator: value => null,
    },
    {
      type: 'text',
      name: 'content',
      placeholder: 'Memo content',
      forceRequired: true, // If field is showing, it is required (even if picker is optional)
      showIf: (fields) => {
        return fields.type.value !== 'MEMO_NONE' && fields.type.value !== '';
      },
      validator: (value, fields) => {
        switch (fields.type.value) {
        case 'MEMO_TEXT':
          let memoTextBytes = Buffer.byteLength(value, 'utf8');
          if (memoTextBytes > 28) {
            return `MEMO_TEXT accepts a string of up to 28-bytes. ${memoTextBytes} bytes entered.`
          }
        break;
        case 'MEMO_ID':
          if (!value.match(/^[0-9]*$/g) || value < 0) {
            return 'MEMO_ID accepts a positive integer.';
          }
          if (value !== UnsignedHyper.fromString(value).toString()) {
            return `MEMO_ID is an unsigned 64-bit integer and the max valid
                    value is ${UnsignedHyper.MAX_UNSIGNED_VALUE.toString()}`
          }
        break;
        case 'MEMO_HASH':
        case 'MEMO_RETURN':
          if (!value.match(/^[0-9a-f]{64}$/g)) {
            return `${fields.type.value} accepts a 32-byte hash in hexadecimal format (64 characters).`;
          }
        break;
        }

        return null;
      },
    },
  ],
});
