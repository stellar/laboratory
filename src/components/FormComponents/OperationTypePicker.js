import React from 'react';
import _ from 'lodash';
import {operationsMap} from '../../data/operations.js';
import RadioButtonPicker from './RadioButtonPicker';

let operationItemMap = {};
_.each(operationsMap, (op) => {
  operationItemMap[op.name] = op.label;
})

export default function OperationTypePicker(props) {
  let {value, onUpdate} = props;

  return <RadioButtonPicker
    value={value}
    onUpdate={onUpdate}
    items={operationItemMap}
    />
}
