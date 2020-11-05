import React from 'react';
import map from 'lodash/map'

// @param {object} props.items An object whose keys are the onUpdate values and
//   object values are labels the user will see.
// {
//   'valueToBeStored': 'Human Readable Label',
// }
export default function RadioButtonPicker(props) {
  let {value, onUpdate, items, disabledItems = []} = props;
  let group = Math.random(); // Allows for tabbing and prevents radio button collisions

  return <div className={`s-buttonGroup picker picker--radio ${props.className || ""}`}>
    {map(items, (label, id) => {
      return <label className="s-buttonGroup__wrapper" key={id}>
        <input type="radio" className="s-buttonGroup__radio"
          name={group}
          onChange={onUpdate.bind(null, id)}
          value={id}
          checked={value === id}
          disabled={disabledItems.includes(id)} />
        <span className={`s-button s-button--light ${disabledItems.includes(id) ? "is-disabled" : ""}`} disabled={disabledItems.includes(id)}>{label}</span>
      </label>
    })}
  </div>;
}
