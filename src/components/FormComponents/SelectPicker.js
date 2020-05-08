import React from 'react';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

// @param {object|array} props.items An object whose keys are the onUpdate values and
//   object values are labels the user will see.
// {
//   'valueToBeStored': 'Human Readable Label',
// }
//
// For array values, the UI label and onUpdate values are the same.
// The benefit of using an array is that it can contain duplicate items.
export default function SelectPicker(props) {
  let {value, onUpdate, items} = props;

  let optionsList;
  if (isArray(items)) {
    optionsList = map(items, (value, index) => {
      return <option key={index} value={value}>{value}</option>
    })
  } else {
    optionsList = map(items, (value, index) => {
      return <option key={index} value={index}>{value}</option>
    })
  }

  let selectPlaceholderClass;
  if (value === '') {
    selectPlaceholderClass = 'so-dropdown__select--placeholder'
  }

  return <div className={`so-dropdown ${props.className}`}>
    <select
      className={'picker picker--select so-dropdown__select ' + selectPlaceholderClass}
      value={value}
      onChange={(event) => onUpdate(event.target.value)}
      >
      <option value="">{props.placeholder}</option>
      {optionsList}
    </select>
  </div>
}
