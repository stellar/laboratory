import TextFormGenerator from '../lib/TextFormGenerator';

export default TextFormGenerator({
  defaultLabel: 'Cursor',
  validator: (value) => {
    return value.match(/^[0-9]*$/g) ? null : 'Cursor is invalid.';
  },
});
