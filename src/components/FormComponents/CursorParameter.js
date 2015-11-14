import FormComponentGenerator from '../lib/FormComponentGenerator';

export default FormComponentGenerator({
  defaultLabel: 'Cursor',
  fields: [
    {
      type: 'text',
      name: 'cursor',
      validator: (value) => value.match(/^[0-9]*$/g) ? null : 'Cursor is invalid.',
    },
  ],
});
