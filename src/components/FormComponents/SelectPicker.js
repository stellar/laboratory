import React from 'react';

// @param {object} props.items An object whose keys are the onUpdate values and
//   object values are labels the user will see.
// {
//   'valueToBeStored': 'Human Readable Label',
// }
export default function SelectPicker(props) {
  let {value, onUpdate, items} = props;
  return <select
    className="picker picker--select"
    value={value}
    onChange={(event) => onUpdate(event.target.value)}
    >
    <option value=""></option>
    {_.map(items, (label, id) => {
      return <option key={id} value={id}>{label}</option>
    })}
  </select>;
}
