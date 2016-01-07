import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Xdr',
  fields: [{
    type: 'text',
    name: 'xdr',
    placeholder: 'Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL...',
    validator: (value) => {
      if (value.match(/^[-A-Za-z0-9+\/=]*$/) === null) {
        return 'Input is not valid base64';
      }
      return null;
    },
  }],
});
