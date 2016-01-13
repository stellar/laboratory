import React from 'react';
import _ from 'lodash';
import PickerError from './PickerError';

export default function XdrPicker(props) {
  let {value, onUpdate} = props;

  return <div>
    <textarea type="text"
      value={value}
      onChange={(event) => {
        onUpdate(event.target.value);
      }}
      placeholder='Example: AAAAABbxCy3mLg3hiTqX4VUEEp60pFOrJNxYM1JtxXTwXhY2AAAAZAAAAAMAAAAGAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAJAAAAAAAAAAHwXhY2AAAAQCPAo8QwsZe9FA0sz/deMdhlu6/zrk7SgkBG22ApvtpETBhnGkX4trSFDz8sVlKqvweqGUVgvjUyM0AcHxyXZQw='
      className="picker picker--textarea picker--breakContent" />
    <PickerError message={validator(value)} />
  </div>
}

function validator(value) {
  if (_.isString(value) && value.match(/^[-A-Za-z0-9+\/=]*$/) === null) {
    return 'Input is not valid base64';
  }
}
