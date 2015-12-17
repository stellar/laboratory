import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Xdr',
  fields: [{
    type: 'text',
    name: 'xdr',
    validator: (value) => {
      if (value.match(/^[-A-Za-z0-9+\/=]*$/) === null) {
        return 'Input is not valid base64';
      }
      return null;
    },
  }],
});
