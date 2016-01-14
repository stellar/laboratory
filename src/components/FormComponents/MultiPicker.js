import React from 'react';
import _ from 'lodash';

// The value is extended so that at the end there is always an element that is null or undefined.
// NOTE: The elements that are empty also include empty strings
export default function MultiPicker(props) {
  let {value, onUpdate, component} = props;
  if (!_.isArray(value)) {
    return <div></div>;
  }
  let lastItem = value[value.length - 1];
  let extendedValue = value.slice();

  while (extendedValue.length > 1 && arelastTwoEmpty(extendedValue)) {
    extendedValue.pop();
  }

  if (!isEmpty(lastItem) || extendedValue.length === 0) {
    extendedValue.push(null);
  }

  let SingleComponent = props.component;
  return <div>
    {_.map(extendedValue, (value, index) => {
      return <SingleComponent
        onUpdate={(newValue) => {
          let newFullValue = extendedValue.slice();
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
function arelastTwoEmpty(value) {
  return isEmpty(value[value.length - 1]) && isEmpty(value[value.length - 2]);
}
