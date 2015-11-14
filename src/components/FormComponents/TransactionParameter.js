import FormComponentGenerator from '../lib/FormComponentGenerator';

export default FormComponentGenerator({
  defaultLabel: 'Transation hash',
  fields: [{
    type: 'text',
    name: 'transaction',
    validator: (value) =>
      value.match(/^[0-9a-f]{64}$/g) ? null : 'Transaction hash is invalid.',
  }],
});
