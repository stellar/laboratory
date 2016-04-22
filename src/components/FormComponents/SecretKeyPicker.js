import React from 'react';
import TextPicker from './TextPicker';
import {Keypair} from 'stellar-base';

export default function SecretKeyPicker(props) {
  return <TextPicker
    {...props}
    placeholder={props.placeholder || 'Example: SAEXAMPLE6TLGEF6ASOTVTLFUK7LE2K2PFVPFGTEZMMVHH7KLLBBROEQ'}
    validator={(value) => {
      try {
        Keypair.fromSeed(value);
      } catch (err) {
        return 'Invalid secret key.';
      }
    }}
    className={props.className}
  />
}
