import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import AssetPicker from '../FormComponents/AssetPicker.js';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';

export default function ChangeTrust(props) {
  return [
    <OptionsTablePair label="Asset" key="asset">
      <AssetPicker
        value={props.values['asset']}
        onUpdate={(value) => {props.onUpdate('asset', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Trust Limit" optional="true" key="limit">
      <PositiveIntPicker
        value={props.values['limit']}
        onUpdate={(value) => {props.onUpdate('limit', value)}}
        />
      <p>If empty, will default to the max int64.</p>
    </OptionsTablePair>,
  ];
}
