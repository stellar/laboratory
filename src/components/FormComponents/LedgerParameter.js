import TextFormGenerator from '../lib/TextFormGenerator';

export default TextFormGenerator({
  defaultLabel: 'Ledger',
  validator: value => {
    return value.match(/^[0-9]*$/g) ? null : 'Ledger sequence is invalid.';
  },
});
