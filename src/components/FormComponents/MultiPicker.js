import React from 'react';
import _ from 'lodash';

// Takes in a prop `value` that gets normalized to have one "empty" element at the end
export default function MultiPicker(props) {
  let {onUpdate, component} = props;
  let rawValues = props.value;
  if (!_.isArray(rawValues)) {
    return <div></div>;
  }

  // Create a new array that is normalized to have only one "empty" element
  // defined as null, undefined, or '' at the last index of the array.
  let normalizedValues = rawValues.slice();

  // Add a trailing "empty" element. May be removed in the next step
  normalizedValues.push(null);

  // Remove trailing "empty" elements until there is only one trailing "empty" element
  while (normalizedValues.length > 1 && arelastTwoEmpty(normalizedValues)) {
    normalizedValues.pop();
  }

  let SingleComponent = props.component;
  return <div>
    {_.map(normalizedValues, (value, index) => {
      return <SingleComponent
        onUpdate={(newValue) => {
          let newFullValue = normalizedValues.slice();
          newFullValue[index] = newValue;
          onUpdate(newFullValue);
        }}
        value={value}
        key={index}
      />
    })}
  </div>
}
MultiPicker.propTypes = {
  value: React.PropTypes.array.isRequired
}

function isEmpty(value) {
  return value === null || _.isUndefined(value) || value === '';
}
function arelastTwoEmpty(values) {
  return isEmpty(values[values.length - 1]) && isEmpty(values[values.length - 2]);
}
