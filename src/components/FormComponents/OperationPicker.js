import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  defaultLabel: 'Operation ID',
  fields: [{
    type: 'text',
    name: 'operationId',
    validator: (value) =>
      value.match(/^[0-9]*$/g) ? null : 'Operation ID is invalid.'
  }],
});
