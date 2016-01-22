import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';

export default function CreateAccount(props) {
  return [
    <OptionsTablePair label="Destination" key="destination">
      <PubKeyPicker
        value={props.values['destination']}
        onUpdate={(value) => {props.onUpdate('destination', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Starting Balance" key="startingBalance">
      <AmountPicker
        value={props.values['startingBalance']}
        onUpdate={(value) => {props.onUpdate('startingBalance', value)}}
        />
    </OptionsTablePair>,
  ];
}
