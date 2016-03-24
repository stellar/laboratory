import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker';
import TextPicker from '../FormComponents/TextPicker';
import BitfieldPicker from '../FormComponents/BitfieldPicker';
import Unsigned8bitIntPicker from '../FormComponents/Unsigned8bitIntPicker';

const accountFlagsBitfieldItems = {
  1: 'Authorization required',
  2: 'Authorization revocable',
  4: 'Authorization immutable',
};

export default function SetOptions(props) {
  return [
    <OptionsTablePair label="Inflation Destination" optional={true} key="inflationDest">
      <PubKeyPicker
        value={props.values['inflationDest']}
        onUpdate={(value) => {props.onUpdate('inflationDest', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Set Flags" optional={true} key="setFlags">
      <BitfieldPicker
        value={props.values['setFlags']}
        items={accountFlagsBitfieldItems}
        onUpdate={(value) => {props.onUpdate('setFlags', value)}}
        />
      <p className="optionsTable__pair__content__note">Selected flags mean to add selected flags in addition to flags already present on the account.</p>
    </OptionsTablePair>,
    <OptionsTablePair label="Clear Flags" optional={true} key="clearFlags">
      <BitfieldPicker
        value={props.values['clearFlags']}
        items={accountFlagsBitfieldItems}
        onUpdate={(value) => {props.onUpdate('clearFlags', value)}}
        />
      <p className="optionsTable__pair__content__note">Selected flags mean to remove selected flags already present on the account.</p>
    </OptionsTablePair>,
    <OptionsTablePair label="Master Weight" optional={true} key="masterWeight">
      <Unsigned8bitIntPicker
        value={props.values['masterWeight']}
        onUpdate={(value) => {props.onUpdate('masterWeight', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Low Threshold" optional={true} key="lowThreshold">
      <Unsigned8bitIntPicker
        value={props.values['lowThreshold']}
        onUpdate={(value) => {props.onUpdate('lowThreshold', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Medium Threshold" optional={true} key="medThreshold">
      <Unsigned8bitIntPicker
        value={props.values['medThreshold']}
        onUpdate={(value) => {props.onUpdate('medThreshold', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="High Threshold" optional={true} key="highThreshold">
      <Unsigned8bitIntPicker
        value={props.values['highThreshold']}
        onUpdate={(value) => {props.onUpdate('highThreshold', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Signer Public Key" optional={true} key="signerAddress">
      <PubKeyPicker
        value={props.values['signerAddress']}
        onUpdate={(value) => {props.onUpdate('signerAddress', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Signer Weight" optional={true} key="signerWeight">
      <Unsigned8bitIntPicker
        value={props.values['signerWeight']}
        onUpdate={(value) => {props.onUpdate('signerWeight', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Home Domain" optional={true} key="homeDomain">
      <TextPicker
        value={props.values['homeDomain']}
        onUpdate={(value) => {props.onUpdate('homeDomain', value)}}
        />
    </OptionsTablePair>,
  ];
}
