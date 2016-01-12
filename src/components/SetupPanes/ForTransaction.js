import React from 'react';

import For from './For';
import TransactionPicker from '../FormComponents/TransactionPicker.js';

export default function ForTransaction(props) {
  let label = 'Transaction Hash';
  let content = <TransactionPicker
    value={props.values['transaction']}
    onUpdate={(value) => {props.onUpdate('transaction', value)}}
    />

  return <For label={label} content={content} {...props} />
}
