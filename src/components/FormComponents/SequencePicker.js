import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Sequence',
  fields: [{
    type: 'text',
    name: 'sequence',
    validator: (value) =>
      (!value.match(/^[0-9]*$/g) || value < 0) ? 'Sequence number is invalid. It must be a positive integer.' : null,
  }],
});
