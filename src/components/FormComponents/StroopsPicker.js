import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Stroops',
  fields: [{
    type: 'text',
    name: 'stroops',
    placeholder: 'Amount in stroops (1 lumen = 10,000,000 stroops)',
    validator: (value) => {
      if (value.charAt(0) === '-') {
        return 'Stroop amounts can only be a positive number.';
      } else if (!value.match(/^[0-9]*$/g)) {
        return 'Stroop amounts must be a whole number.';
      }

      return null
    }
  }],
});
