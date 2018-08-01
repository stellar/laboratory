import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker';
import SignerPicker from '../FormComponents/SignerPicker';
import TextPicker from '../FormComponents/TextPicker';
import FlagfieldPicker from '../FormComponents/FlagfieldPicker';
import Unsigned8bitIntPicker from '../FormComponents/Unsigned8bitIntPicker';
import HelpMark from '../HelpMark';

const accountFlagFieldsSet = {
  1: 'Authorization required',
  2: 'Authorization revocable',
  4: 'Authorization immutable',
};

const accountFlagFieldsClear = {
  1: 'Authorization required',
  2: 'Authorization revocable',
};

export default function SetOptions(props) {
  return [
    <OptionsTablePair
      label={<span>Inflation Destination <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html#inflation-destination" /></span>}
      optional={true} key="inflationDest">
      <PubKeyPicker
        value={props.values['inflationDest']}
        onUpdate={(value) => {props.onUpdate('inflationDest', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Set Flags <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html#flags" /></span>}
      optional={true} key="setFlags">
      <FlagfieldPicker
        value={props.values['setFlags']}
        items={accountFlagFieldsSet}
        onUpdate={(value) => {props.onUpdate('setFlags', value)}}
        />
      <p className="optionsTable__pair__content__note">Selected <a href="https://en.wikipedia.org/wiki/Flag_field" target="_blank">flags</a> mean to add selected flags in addition to flags already present on the account.</p>
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Clear Flags <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html#flags" /></span>}
      optional={true} key="clearFlags">
      <FlagfieldPicker
        value={props.values['clearFlags']}
        items={accountFlagFieldsClear}
        onUpdate={(value) => {props.onUpdate('clearFlags', value)}}
        />
      <p className="optionsTable__pair__content__note">Selected <a href="https://en.wikipedia.org/wiki/Flag_field" target="_blank">flags</a> mean to remove selected flags already present on the account.</p>
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Master Weight <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html#thresholds" /></span>}
      optional={true} key="masterWeight">
      <Unsigned8bitIntPicker
        value={props.values['masterWeight']}
        onUpdate={(value) => {props.onUpdate('masterWeight', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Low Threshold <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html#thresholds" /></span>}
      optional={true} key="lowThreshold">
      <Unsigned8bitIntPicker
        value={props.values['lowThreshold']}
        onUpdate={(value) => {props.onUpdate('lowThreshold', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Medium Threshold <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html#thresholds" /></span>}
      optional={true} key="medThreshold">
      <Unsigned8bitIntPicker
        value={props.values['medThreshold']}
        onUpdate={(value) => {props.onUpdate('medThreshold', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>High Threshold <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html#thresholds" /></span>}
      optional={true} key="highThreshold">
      <Unsigned8bitIntPicker
        value={props.values['highThreshold']}
        onUpdate={(value) => {props.onUpdate('highThreshold', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Signer Type <HelpMark href="https://www.stellar.org/developers/learn/concepts/multi-sig.html#additional-signing-keys" /></span>}
      optional={true} key="signer">
      <SignerPicker
        value={props.values['signer']}
        onUpdate={(value) => {props.onUpdate('signer', value)}}
        />
      <p className="optionsTable__pair__content__note">Used to add/remove or adjust weight of an additional signer on the account.</p>
    </OptionsTablePair>,
    <OptionsTablePair
      label={<span>Home Domain <HelpMark href="https://www.stellar.org/developers/learn/concepts/multi-sig.html#additional-signing-keys" /></span>}
      optional={true} key="homeDomain">
      <TextPicker
        value={props.values['homeDomain']}
        placeholder="Example: example.com"
        onUpdate={(value) => {props.onUpdate('homeDomain', value)}}
        />
    </OptionsTablePair>,
  ];
}
