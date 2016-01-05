import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Operation',
  fields: [{
    type: 'text',
    name: 'operationId',
    placeholder: 'Example: 55834578945',
    validator: (value) =>
      value.match(/^[0-9]*$/g) ? null : 'Operation ID is invalid.'
  }],
});
