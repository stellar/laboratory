import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Offer',
  fields: [{
    type: 'text',
    name: 'offer',
    validator: (value) => {
      if (value.match(/^[0-9]*$/g)) {
        return 'Offer ID can only be a positive integer.';
      }
      return null
    }
  }],
});
