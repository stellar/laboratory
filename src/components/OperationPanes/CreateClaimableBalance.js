import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import ManualMultiPicker from '../FormComponents/ManualMultiPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';
import AssetPicker from '../FormComponents/AssetPicker.js';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';

export default function CreateClaimableBalance(props) {
  return [
    <OptionsTablePair label="Asset" key="asset">
      <AssetPicker
        value={props.values['asset']}
        onUpdate={(value) => {props.onUpdate('asset', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Amount" key="amount">
      <AmountPicker
        value={props.values['amount']}
        onUpdate={(value) => {props.onUpdate('amount', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Claimants" key="claimants">
      <ManualMultiPicker
        component={PubKeyPicker}
        value={props.values['claimants']}
        default={""}
        addNewLabel="Add new claimant"
        onUpdate={(value) => {props.onUpdate('claimants', value)}}
        />
    </OptionsTablePair>,
  ];
}
