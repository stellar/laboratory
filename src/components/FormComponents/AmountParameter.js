import TextFormGenerator from '../lib/TextFormGenerator';

export default TextFormGenerator({
  defaultLabel: 'Amount',
  validator: (value) => {
    return value.match(/^[0-9]*(\.[0-9]+){0,1}$/g) ? null : 'Amount is invalid.';
  },
});
