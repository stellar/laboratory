import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  defaultLabel: 'Amount',
  fields: [{
    type: 'text',
    name: 'amount',
    validator: (value) => {
      if (!value.match(/^[0-9]*(\.[0-9]+){0,1}$/g)) {
        return 'Amount can only contain numbers and a period for the decimal point.';
      } else if (value.match(/\.([0-9]){8,}$/g)) {
        return 'Amount can only support a precision of 7 decimals.';
      }
      return null
    }
  }],
});
