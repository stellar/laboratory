import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Operation',
  fields: [{
    type: 'text',
    name: 'operationId',
    validator: (value) =>
      value.match(/^[0-9]*$/g) ? null : 'Operation ID is invalid.'
  }],
});
