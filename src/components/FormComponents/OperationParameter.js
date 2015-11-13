import TextFormGenerator from '../lib/TextFormGenerator';

export default TextFormGenerator({
  defaultLabel: 'Operation ID',
  validator: (value) => {
    return value.match(/^[0-9]*$/g) ? null : 'Operation ID is invalid.';
  },
});
