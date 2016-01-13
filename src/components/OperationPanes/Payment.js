import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';
import AssetPicker from '../FormComponents/AssetPicker.js';

export default function Payment(props) {
  return <div>
    <OptionsTablePair label="Destination">
      <PubKeyPicker
        value={props.values['destination']}
        onUpdate={(value) => {props.onUpdate('destination', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Asset">
      <AssetPicker
        value={props.values['asset']}
        onUpdate={(value) => {props.onUpdate('asset', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Amount">
      <AmountPicker
        value={props.values['amount']}
        onUpdate={(value) => {props.onUpdate('amount', value)}}
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
