import React from 'react';
import TextPicker from './TextPicker';

export default function BipPathPicker(props) {
  return <TextPicker
    {...props}
    placeholder={props.placeholder || "BIP path in format: 44'/148'/0'"}
    validator={(value) => {
      let regexp = /44'\/148'\/(\d+)'/;
      let match = regexp.exec(value);
      if (!(match && match[1].length > 0)) {
        return "Invalid BIP path. Please provide it in format 44'/148'/x'. We call 44'/148'/0' the primary account";
      }
    }}
    className={props.className}
  />
}
