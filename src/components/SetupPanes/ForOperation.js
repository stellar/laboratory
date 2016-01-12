import React from 'react';

import For from './For';
import OperationPicker from '../FormComponents/OperationPicker.js';

export default function ForOperation(props) {
  let label = 'Operation ID';
  let content = <OperationPicker
    value={props.values['operation']}
    onUpdate={(value) => {props.onUpdate('operation', value)}}
    />

  return <For label={label} content={content} {...props} />
}
