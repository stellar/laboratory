import React from 'react';

export default function TextPicker(props) {
  let {value, onUpdate} = props;

  return <div>
    <input type="text"
      value={value}
      onChange={(event) => {
        onUpdate(event.target.value);
      }}
      placeholder={props.placeholder}
      className="picker picker--textInput" />
  </div>
}
