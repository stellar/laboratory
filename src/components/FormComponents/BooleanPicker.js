import React from 'react';
import RadioButtonPicker from './RadioButtonPicker';

export default function BooleanPicker(props) {
  let {value, onUpdate} = props;

  return <RadioButtonPicker
    value={value}
    onUpdate={(value) => onUpdate(value)}
    items={{
      'true': 'true',
      'false': 'false',
    }}
    />
}
