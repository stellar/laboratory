import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'Order',
  fields: [{
    type: 'radio',
    options: [
      // TODO: support the default button. Currently not possible because we
      // can't have an empty string a the value or else the validator will think
      // it is not filled out.
      // {
      //   name: 'default', // Just used internally for keys. Must be unique within this set of options
      //   label: 'default (asc)', // Displayed to the user (can't be used for keys in case of localzation)
      //   value: 'default', // Must be non-empty string
      // },
      {
        name: 'asc',
        label: 'asc',
        value: 'asc',
      },
      {
        name: 'desc',
        label: 'desc',
        value: 'desc',
      },
    ],
    name: 'order',
    // default: 'default', // optional. matches with options[].value
    validator: value => null,
  }],
});
