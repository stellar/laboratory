import React from 'react';

import All from './All';
import TextPicker from '../FormComponents/TextPicker.js';
import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';

export default function AllAssets(props) {
  return <div>
    <OptionsTablePair label="Asset Code" optional={true}>
      <TextPicker
        value={props.values['asset_code']}
        onUpdate={(value) => {props.onUpdate('asset_code', value)}}
        />
    </OptionsTablePair>

    <OptionsTablePair label="Asset Issuer" optional={true}>
      <PubKeyPicker
        value={props.values['asset_issuer']}
        onUpdate={(value) => {props.onUpdate('asset_issuer', value)}}
        />
    </OptionsTablePair>

    <All {...props} />
  </div>
}
