import React from 'react';
import OptionsTablePair from '../OptionsTable/Pair';
import AssetPicker from '../FormComponents/AssetPicker.js';

export default function Trades(props) {
  return <div>
    <OptionsTablePair label="Selling Asset">
      <AssetPicker
      value={props.values['selling_asset']}
      onUpdate={(value) => {props.onUpdate('selling_asset', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Buying Asset">
      <AssetPicker
      value={props.values['buying_asset']}
      onUpdate={(value) => {props.onUpdate('buying_asset', value)}}
      />
    </OptionsTablePair>
  </div>
}
