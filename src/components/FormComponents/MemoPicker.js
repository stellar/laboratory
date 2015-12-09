import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Memo',
  fields: [
    {
      type: 'radio',
      options: [
        {
          name: 'MEMO_NONE',
          label: 'MEMO_NONE',
          value: 'MEMO_NONE',
        },
        {
          name: 'MEMO_TEXT',
          label: 'MEMO_TEXT',
          value: 'MEMO_TEXT',
        },
        {
          name: 'MEMO_ID',
          label: 'MEMO_ID',
          value: 'MEMO_ID',
        },
        {
          name: 'MEMO_HASH',
          label: 'MEMO_HASH',
          value: 'MEMO_HASH',
        },
        {
          name: 'MEMO_RETURN',
          label: 'MEMO_RETURN',
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
      placeholder: 'memo content',
      forceRequired: true, // If field is showing, it is required (even if picker is optional)
      showIf: (fields) => {
        return fields.type.value !== 'MEMO_NONE' && fields.type.value !== '';
      },
      validator: (value, fields) => {
        // TODO: memo picker vlaidation
        switch (fields.type.value) {
        case 'MEMO_TEXT':
          return 'TEXT type';
        case 'MEMO_ID':
          return 'ID type';
        case 'MEMO_HASH':
        case 'MEMO_RETURN':
          return 'HASH type';
        default:
          return null;
        }
      },
    },
  ],
});
