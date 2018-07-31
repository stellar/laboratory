import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';

export default function BumpSequence(props) {
  return [
    <OptionsTablePair label="BumpTo" key="bumpTo">
      <PositiveIntPicker
        value={props.values['bumpTo']}
        onUpdate={(value) => {props.onUpdate('bumpTo', value)}}
        />
    </OptionsTablePair>,
  ];
}
