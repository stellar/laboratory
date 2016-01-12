import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';

export default function CreateAccount(props) {
  return <div>
    <OptionsTablePair label="Destination">
      <PubKeyPicker
        value={props.values['destination']}
        onUpdate={(value) => {props.onUpdate('destination', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Starting Balance">
      <AmountPicker
        value={props.values['startingBalance']}
        onUpdate={(value) => {props.onUpdate('startingBalance', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Source Account" optional={true}>
      <PubKeyPicker
        value={props.values['sourceAccount']}
        onUpdate={(value) => {props.onUpdate('sourceAccount', value)}}
        />
    </OptionsTablePair>
  </div>
}
