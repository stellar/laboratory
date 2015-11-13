import TextFormGenerator from '../lib/TextFormGenerator';

export default TextFormGenerator({
  defaultLabel: 'Transation hash',
  validator: (value) => {
    return value.match(/^[0-9a-f]{64}$/g) ? null : 'Transaction hash is invalid.';
  },
});
