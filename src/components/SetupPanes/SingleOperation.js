import React from 'react';
import OptionsTablePair from '../OptionsTable/Pair';
import OperationPicker from '../FormComponents/OperationPicker.js';

export default function SingleOperation(props) {
  return <div>
    <OptionsTablePair label="Operation ID">
      <OperationPicker
        value={props.values['operation']}
        onUpdate={(value) => {props.onUpdate('operation', value)}}
        />
    </OptionsTablePair>
  </div>
}
