import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import XdrPicker from '../FormComponents/XdrPicker.js';

export default function PostTransaction(props) {
  return <div>
    <OptionsTablePair label="Transaction Envelope XDR">
      <XdrPicker
        value={props.values['tx']}
        onUpdate={(value) => {props.onUpdate('tx', value)}}
        />
    </OptionsTablePair>
  </div>
}
