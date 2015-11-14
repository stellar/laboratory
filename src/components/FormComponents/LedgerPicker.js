import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  defaultLabel: 'Ledger',
  fields: [{
    type: 'text',
    name: 'ledger',
    validator: (value) =>
      value.match(/^[0-9]*$/g) ? null : 'Ledger sequence is invalid.'
  }],
});
