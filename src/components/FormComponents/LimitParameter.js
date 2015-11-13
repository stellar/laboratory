import TextFormGenerator from '../lib/TextFormGenerator';

export default TextFormGenerator({
  defaultLabel: 'Limit',
  validator: (value) => {
    if (!value.match(/^[0-9]*$/g) || value < 0 || value > 200) {
      return 'Limit is invalid.';
    }
    return null;
  },
});
