import React from 'react';
let pickerComponents = {
  PubKeyPicker: require('./PubKeyPicker'),
  AmountPicker: require('./AmountPicker'),
  AssetPicker: require('./AssetPicker'),
  CursorPicker: require('./CursorPicker'),
  LedgerPicker: require('./LedgerPicker'),
  LimitPicker: require('./LimitPicker'),
  OperationPicker: require('./OperationPicker'),
  OrderPicker: require('./OrderPicker'),
  TransactionPicker: require('./TransactionPicker'),
}

/**
Usage example:
  Picker('Amount', { onUpdate: this.onUpdateHandler, label: 'Foo' })

Required props:
  onUpdate
  label

Optional props:
  forceError
  forceDirty
  required
  key
**/
export default function(type, props) {
  if (!('key' in props)) {
    props.key = type;
  }
  props.type = type;

  if (!('label' in props)) {
    throw new Error(`Missing label in Picker props. Check the code where you call the Picker function.`);
  }

  let pickerComponentName;
  pickerComponentName = type + 'Picker';
  let PickerComponent = pickerComponents[pickerComponentName];

  if (typeof PickerComponent === 'undefined') {
    throw new Error(`Unknown picker component ${pickerComponentName}. Check the code where you call the Picker function.`);
  }

  return <PickerComponent {...props} />;
}
