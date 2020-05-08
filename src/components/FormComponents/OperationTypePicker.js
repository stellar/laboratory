import React from 'react';
import each from 'lodash/each';
import {operationsMap} from '../../data/operations.js';
import SelectPicker from './SelectPicker';

let operationItemMap = {};
each(operationsMap, (op) => {
  operationItemMap[op.name] = op.label;
})

export default function OperationTypePicker(props) {
  let {value, onUpdate} = props;

  return <SelectPicker
    value={value}
    onUpdate={onUpdate}
    placeholder="Select operation type"
    items={operationItemMap}
    />
}
