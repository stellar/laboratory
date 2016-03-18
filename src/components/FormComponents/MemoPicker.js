import React from 'react';
import _ from 'lodash';
import RadioButtonPicker from './RadioButtonPicker';
import TextPicker from './TextPicker';
import PickerError from './PickerError';
import {UnsignedHyper} from 'stellar-sdk';

export default function MemoPicker(props) {
  let {onUpdate} = props;
  let contentPicker;
  let normalizedValue = _.assign({}, props.value);
  normalizedValue.type = (props.value.type === '') ? 'MEMO_NONE' : props.value.type;

  if (normalizedValue.type !== 'MEMO_NONE') {
    contentPicker = <TextPicker
      value={normalizedValue.content}
      onUpdate={(contentValue) => onUpdate(_.assign({}, normalizedValue, {
        content: contentValue,
      }))}
      placeholder={memoPlaceholder(normalizedValue.type)}
      validator={contentValidator.bind(null, normalizedValue)} // Use entire Memo value and not just the content value
    />;
  }

  return <div>
    <RadioButtonPicker
      value={normalizedValue.type}
      onUpdate={(typeValue) => onUpdate(_.assign({}, normalizedValue, {
        type: typeValue,
      }))}
      className="picker--spaceBottom"
      items={{
        'MEMO_NONE': 'None',
        'MEMO_TEXT': 'Text',
        'MEMO_ID': 'ID',
        'MEMO_HASH': 'Hash',
        'MEMO_RETURN': 'Return',
      }}
      />
    {contentPicker}
  </div>
}

function contentValidator(value) {
  switch (value.type) {
  case 'MEMO_TEXT':
    let memoTextBytes = Buffer.byteLength(value.content, 'utf8');
    if (memoTextBytes > 28) {
      return `MEMO_TEXT accepts a string of up to 28 bytes. ${memoTextBytes} bytes entered.`
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
    if (!value.content.match(/^[0-9a-f]{64}$/gi)) {
      return `${value.type} accepts a 32-byte hash in hexadecimal format (64 characters).`;
    }
    break;
  }
}

function memoPlaceholder(type) {
  switch (type) {
  case 'MEMO_TEXT':
    return `UTF-8 string of up to 28 bytes`;
  case 'MEMO_ID':
    return `Unsigned 64-bit integer`;
  case 'MEMO_HASH':
  case 'MEMO_RETURN':
    return `32-byte hash in hexadecimal format (64 [0-9a-f] characters)`;
  }
}
