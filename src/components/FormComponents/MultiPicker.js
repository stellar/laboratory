import React from 'react';
import _ from 'lodash';

// Takes in a prop `value` that gets normalized to have one empty element at the end.
// MultiPicker is a compound picker interface that ensures there is always
// enough rows for the user to add more data. MultiPicker accomplishes this
// by making sure there is only one consecutive empty picker at the end.
//
// An empty element is defined as null, undefined, or ''. This means that only
// string value pickers (like PositiveIntPicker but not AssetPicker) can be
// used inside the MultiPicker. In the future, support can be added for Pickers
// with compound values.
//
// MultiPicker will also shrink the amount of pickers if there more than one
// consecutive "empty pickers". This is so that if the user enters in many values
// and deletes them all, there won't be an excess of extra
export default function MultiPicker(props) {
  let {onUpdate, component} = props;
  if (!_.isArray(props.value)) {
    return <div></div>;
  }

  let normalizedValues = adjustTrailingEmptyElements(props.value);

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

// Makes sure there is only one consecutive trailing element in the value array.
// Does not mutate value.
function adjustTrailingEmptyElements(values) {
  values = values.slice();

  // Add a trailing empty element. May be removed in the next step
  // This is to ensure that we have at least one trailing empty element. In many
  // cases, this will cause two trailing empty elements, but it will be removed
  // in the next step.
  values.push(null);

  // Remove trailing empty elements until there is only one trailing empty element.
  // This makes sure we will only have one consecutive trailing element (especially)
  // remove the defensive one we just added before.
  while (values.length > 1 && arelastTwoEmpty(values)) {
    values.pop();
  }

  return values;
}
