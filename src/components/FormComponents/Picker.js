import React from 'react';
let pickerComponents = {
  AmountPicker: require('./AmountPicker'),
  AssetPicker: require('./AssetPicker'),
  CursorPicker: require('./CursorPicker'),
  LedgerPicker: require('./LedgerPicker'),
  LimitPicker: require('./LimitPicker'),
  MemoPicker: require('./MemoPicker'),
  SequencePicker: require('./SequencePicker'),
  OperationPicker: require('./OperationPicker'),
  OperationTypePicker: require('./OperationTypePicker'),
  OrderPicker: require('./OrderPicker'),
  OfferPicker: require('./OfferPicker'),
  PubKeyPicker: require('./PubKeyPicker'),
  SecretKeyPicker: require('./SecretKeyPicker'),
  TransactionPicker: require('./TransactionPicker'),
  XdrPicker: require('./XdrPicker'),
}

/**
Usage example:
  return Picker({
    type: 'Amount',
    onUpdate: this.props.onUpdateHandler,
    label: 'Foo'
  });

Required props:
  type
  onUpdate
  label

Optional props:
  forceError
  forceDirty
  required
  key
**/
export default function(props) {
  if (!('key' in props)) {
    props.key = props.type;
  }

  if (!('label' in props)) {
    throw new Error(`Missing label in Picker props. Check the code where you call the Picker function.`);
  }

  let pickerComponentName;
  pickerComponentName = props.type + 'Picker';
  let PickerComponent = pickerComponents[pickerComponentName];

  if (typeof PickerComponent === 'undefined') {
    throw new Error(`Unknown picker component ${pickerComponentName}. Check the code where you call the Picker function.`);
  }

  return <PickerComponent {...props} />;
}
