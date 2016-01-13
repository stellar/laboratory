import React from 'react';
import TextPicker from './TextPicker';
import {Account} from 'stellar-sdk';

export default function PositiveIntPicker(props) {
  return <TextPicker
    {...props}
    placeholder={props.placeholder || 'Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG'}
    validator={(value) => {
      if (!Account.isValidAccountId(value)) {
        return 'Public key is invalid.';
      }
    }}
  />
}
