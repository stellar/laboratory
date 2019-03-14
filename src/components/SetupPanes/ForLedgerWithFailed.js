import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import ForLedger from './ForLedger';
import BooleanPicker from '../FormComponents/BooleanPicker';

export default function ForLedgerWithFailed(props) {
  return <ForLedger {...props}>
    <OptionsTablePair label="Include failed">
      <BooleanPicker
        value={props.values['include_failed']}
        onUpdate={(value) => {props.onUpdate('include_failed', value)}}
        key="include_failed"
        />
    </OptionsTablePair>
  </ForLedger>
}
