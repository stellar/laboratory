import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import AssetPicker from '../FormComponents/AssetPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';
import ManualMultiPicker from '../FormComponents/ManualMultiPicker.js';

export default function PathPayment(props) {
  return [
    <OptionsTablePair label="Sending Asset" key="sendAsset">
      <AssetPicker
        value={props.values['sendAsset']}
        onUpdate={(value) => {props.onUpdate('sendAsset', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Maximum send amount" key="sendMax">
      <AmountPicker
        value={props.values['sendMax']}
        onUpdate={(value) => {props.onUpdate('sendMax', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Destination" key="destination">
      <PubKeyPicker
        value={props.values['destination']}
        onUpdate={(value) => {props.onUpdate('destination', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Destination Asset" key="destAsset">
      <AssetPicker
        value={props.values['destAsset']}
        onUpdate={(value) => {props.onUpdate('destAsset', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Destination Amount" key="destAmount">
      <AmountPicker
        value={props.values['destAmount']}
        onUpdate={(value) => {props.onUpdate('destAmount', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Asset Path" key="path">
      <ManualMultiPicker
        component={AssetPicker}
        value={props.values['path']}
        default={{}}
        onUpdate={(value) => {props.onUpdate('path', value)}}
        />
    </OptionsTablePair>,

  ];
}
