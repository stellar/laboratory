import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Transation',
  fields: [{
    type: 'text',
    name: 'transaction',
    placeholder: 'Example: 3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889',
    validator: (value) =>
      value.match(/^[0-9a-f]{64}$/g) ? null : 'Transaction hash is invalid.',
  }],
});
