import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Limit',
  fields: [{
    type: 'text',
    name: 'limit',
    validator: (value) =>
      (!value.match(/^[0-9]*$/g) || value < 0) ? 'Limit is invalid.' : null,
  }],
});
