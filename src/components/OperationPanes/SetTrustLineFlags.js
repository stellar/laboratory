import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import AssetPicker from '../FormComponents/AssetPicker.js';
import PubKeyPicker from '../FormComponents/PubKeyPicker';
import FlagfieldPicker from '../FormComponents/FlagfieldPicker';
import CheckboxButtonPicker from "../FormComponents/CheckboxButtonPicker";
import HelpMark from '../HelpMark';

const flagsSet = {
  'authorized': 'Authorized',
  'authorizedToMaintainLiabilities': 'Authorized to maintain liabilites',
};

const flagsClear = {
  'authorized': 'Authorized',
  'authorizedToMaintainLiabilities': 'Authorized to maintain liabilites',
  'clawbackEnabled': 'Clawback enabled',
};

export default function SetTrustLineFlags(props) {
  return [
    <OptionsTablePair label="Asset" key="asset">
      <AssetPicker
        value={props.values['asset']}
        disableNative={true}
        onUpdate={(value) => {props.onUpdate('asset', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Trustor" key="trustor">
      <PubKeyPicker
        value={props.values['trustor']}
        onUpdate={(value) => {props.onUpdate('trustor', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Set Flags</span>}
      optional={true} key="setFlags">
      <CheckboxButtonPicker
        className=""
        value={props.values['setFlags'] || []}
        onUpdate={(value) => {props.onUpdate('setFlags', value)}}
        items={flagsSet}
        />
    </OptionsTablePair>,
    <OptionsTablePair
    label={<span>Clear Flags</span>}
    optional={true} key="clearFlags">
    <CheckboxButtonPicker
      className=""
      value={props.values['clearFlags'] || []}
      onUpdate={(value) => {props.onUpdate('clearFlags', value)}}
      items={flagsClear}
      />
  </OptionsTablePair>,
  ];
}
