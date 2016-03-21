import React from 'react';

// @param {object} props.items An object whose keys are the onUpdate values and
//   object values are labels the user will see.
// {
//   'valueToBeStored': 'Human Readable Label',
// }
export default function RadioButtonPicker(props) {
  let {value, onUpdate, items} = props;
  let group = Math.random(); // Allows for tabbing and prevents radio button collisions

  return <div className={`s-buttonGroup picker picker--radio ${props.className}`}>
    {_.map(items, (label, id) => {
      return <label className="s-buttonGroup__wrapper" key={id}>
        <input type="radio" className="s-buttonGroup__radio"
          name={group}
          onChange={onUpdate.bind(null, id)}
          value={id}
          checked={value === id} />
        <span className="s-button s-button--light">{label}</span>
      </label>
    })}
  </div>;
}
