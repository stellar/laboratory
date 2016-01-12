import React from 'react';
import _ from 'lodash';
import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker';
import SequencePicker from '../FormComponents/SequencePicker';
import StroopsPicker from '../FormComponents/StroopsPicker';
import MemoPicker from '../FormComponents/MemoPicker';

export default function TxAttributes(props) {
  return <div>
    <OptionsTablePair label="Source Account">
      <PubKeyPicker
        value={props.values['sourceAccount']}
        onUpdate={(value) => {props.onUpdate('sourceAccount', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Transaction Sequence Number">
      <SequencePicker
        value={props.values['sequence']}
        onUpdate={(value) => {props.onUpdate('sequence', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Transaction Fee" optional={true}>
      <StroopsPicker
        value={props.values['fee']}
        onUpdate={(value) => {props.onUpdate('fee', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Memo" optional={true}>
      <MemoPicker
        value={{
          type: props.values.memoType,
          content: props.values.memoContent,
        }}
        onUpdate={(value) => {props.onUpdate('memo', value)}}
        />
    </OptionsTablePair>
  </div>

}
