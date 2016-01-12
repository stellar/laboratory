import React from 'react';
import _ from 'lodash';
import RadioButtonPicker from './RadioButtonPicker';
import PickerError from './PickerError';
import {UnsignedHyper} from 'stellar-sdk';

export default function MemoPicker(props) {
  let {value, onUpdate} = props;

  let contentPicker, contentPickerError;

  if (value.type !== 'MEMO_NONE') {
    contentPicker = <input type="text"
      value={value.content}
      onChange={(event) => onUpdate(_.assign({}, props.value, {
        content: event.target.value,
      }))}
      placeholder="Memo content"
      className="picker picker--textInput" />
    contentPickerError = <PickerError message={contentValidator(value)} />
  }

  return <div>
    <RadioButtonPicker
      value={value.type}
      onUpdate={(typeValue) => onUpdate(_.assign({}, props.value, {
        type: typeValue,
      }))}
      items={{
        'MEMO_NONE': 'None',
        'MEMO_TEXT': 'Text',
        'MEMO_ID': 'ID',
        'MEMO_HASH': 'Hash',
        'MEMO_RETURN': 'Return',
      }}
      />
    {contentPicker}
    {contentPickerError}
  </div>
}

function contentValidator(value) {
  if (!_.isUndefined(value.content) || !_.isString(value) || value.length === 0) {
    return;
  }

  switch (value.type) {
  case 'MEMO_TEXT':
    let memoTextBytes = Buffer.byteLength(value.content, 'utf8');
    if (memoTextBytes > 28) {
      return `MEMO_TEXT accepts a string of up to 28-bytes. ${memoTextBytes} bytes entered.`
    }
  break;
  case 'MEMO_ID':
    if (!value.content.match(/^[0-9]*$/g) || value < 0) {
      return 'MEMO_ID accepts a positive integer.';
    }
    if (value.content !== UnsignedHyper.fromString(value.content).toString()) {
      return `MEMO_ID is an unsigned 64-bit integer and the max valid
              value is ${UnsignedHyper.MAX_UNSIGNED_VALUE.toString()}`
    }
  break;
  case 'MEMO_HASH':
  case 'MEMO_RETURN':
    if (!value.content.match(/^[0-9a-f]{64}$/g)) {
      return `${value.type} accepts a 32-byte hash in hexadecimal format (64 characters).`;
    }
  break;
  }
}
