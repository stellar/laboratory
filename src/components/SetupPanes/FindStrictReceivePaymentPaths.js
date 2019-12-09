import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';
import AssetPicker from '../FormComponents/AssetPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';
import CanonicalAssetTextPicker from '../FormComponents/CanonicalAssetTextPicker.js';

export default function FindStrictReceivePaymentPaths(props) {
  return <div>
    <OptionsTablePair label="Source Account">
      <PubKeyPicker
      value={props.values['source_account']}
      onUpdate={(value) => {props.onUpdate('source_account', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Source Assets">
      <CanonicalAssetTextPicker
      value={props.values['source_assets']}
      onUpdate={(value) => {props.onUpdate('source_assets', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Destination Amount">
      <AmountPicker
      value={props.values['destination_amount']}
      onUpdate={(value) => {props.onUpdate('destination_amount', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Destination Asset">
      <AssetPicker
      value={props.values['destination_asset']}
      onUpdate={(value) => {props.onUpdate('destination_asset', value)}}
      />
    </OptionsTablePair>
  </div>
}
