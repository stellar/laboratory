import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Cursor',
  fields: [
    {
      type: 'text',
      name: 'cursor',
      validator: (value) => value.match(/^[0-9]*$/g) ? null : 'Cursor is invalid.',
    },
  ],
});
