import React from 'react';
import TextPicker from './TextPicker';
import {StrKey, Keypair} from 'stellar-sdk';

export default function SecretKeyPicker(props) {
  return <TextPicker
    {...props}
    placeholder={props.placeholder || 'Secret key (starting with S) or hash preimage (in hex)'}
    validator={(value) => {
      if (value.charAt(0) == 'S') {
        if (!StrKey.isValidEd25519SecretSeed(value)) {
          return 'Invalid secret key.';
        }
      } else {
        if (!value.match(/^[0-9a-f]{2,128}$/gi) || value.length % 2 == 1) {
          return `Invalid hex value. Please provide up to 64 bytes in hexadecimal format.`;
        }
      }
    }}
    className={props.className}
  />
}
