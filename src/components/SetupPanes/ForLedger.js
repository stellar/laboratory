import React from 'react';

import For from './For';
import LedgerPicker from '../FormComponents/LedgerPicker.js';

export default function ForLedger(props) {
  let label = 'Ledger Sequence';
  let content = <LedgerPicker
    value={props.values['ledger']}
    onUpdate={(value) => {props.onUpdate('ledger', value)}}
    />

  return <For label={label} content={content} {...props} />
}
