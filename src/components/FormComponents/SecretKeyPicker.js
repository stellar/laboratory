import React from 'react';
import _ from 'lodash';
import {Keypair} from 'stellar-sdk';
import PickerError from './PickerError';

export default function SecretKeyPicker(props) {
  let {value, onUpdate} = props;
  return <div>
    <input type="text"
      value={value}
      placeholder={props.placeholder || 'Example: SAEXAMPLE6TLGEF6ASOTVTLFUK7LE2K2PFVPFGTEZMMVHH7KLLBBROEQ'}
      onChange={(event) => {
        onUpdate(event.target.value);
      }}
      className="picker picker--textInput" />
    <PickerError message={validator(value)} />
  </div>
}

function validator(value) {
  if (!_.isString(value) || value.length === 0) {
    return;
  }
  try {
    Keypair.fromSeed(value);
  } catch (err) {
    return 'Invalid secret key.';
  }
}
