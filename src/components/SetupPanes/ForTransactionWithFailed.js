import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import ForTransaction from './ForTransaction';
import BooleanPicker from '../FormComponents/BooleanPicker';

export default function ForTransactionWithFailed(props) {
  return <ForTransaction {...props}>
    <OptionsTablePair label="Include failed">
      <BooleanPicker
        value={props.values['include_failed']}
        onUpdate={(value) => {props.onUpdate('include_failed', value)}}
        key="include_failed"
        />
    </OptionsTablePair>
  </ForTransaction>
}
