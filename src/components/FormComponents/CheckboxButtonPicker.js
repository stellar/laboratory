import React from 'react';

// @param {object} props.items An object whose keys are the onUpdate values and
//   object values are labels the user will see.
// {
//   'valueToBeStored': 'Human Readable Label',
// }
// @param {array} props.value Value is expected to be in an array format containing
//   all the keys of the checked items
export default function CheckboxButtonPicker(props) {
  let {value, onUpdate, items} = props;
  let group = Math.random(); // Allows for tabbing and prevents radio button collisions

  return <div className={`s-buttonGroup picker picker--radio ${props.className}`}>
    {_.map(items, (label, id) => {
      return <label className="s-buttonGroup__wrapper" key={id}>
        <input type="checkbox" className="s-buttonGroup__radio"
          name={group}
          onChange={(e) => {
            onUpdate(calculateNewValue(props.value, e.target.value, e.target.checked))
          }}
          value={id}
          checked={value.indexOf(id) >= 0} />
        <span className="s-button s-button--light">{label}</span>
      </label>
    })}
  </div>;
}

// Calculate the new value of the array when changing around the array
function calculateNewValue(previousValue, value, checked) {
  let valueArray = [].concat(previousValue);
  let valueIndex = valueArray.indexOf(value);
  let valueExists = valueIndex >= 0;

  if (checked && !valueExists) {
    valueArray.push(value);
  }
  if (!checked && valueExists) {
    valueArray.splice(valueIndex, 1);
  }

  valueArray.sort();
  return valueArray;
}