import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// ManualMultiPicker is a compound picker interface that displays multiple
// instances of a Picker. It is manual in that the user uses to add or reduce
// the amount of pickers displayed. This picker is useful for instances where
// the number of items are more precise (like payment paths) or the picker has a
// compound value (AssetPicker values are objects).

// @param {array} props.value - Array of values. If empty or non array, then it will default to a zero element array
// @param {Picker|function} props.component - A React Picker component function to be repeated
// @param {object|string} [props.default] - This is the default value for new elements that are added
// @param {function} props.onUpdate - Picker callback function called when the values change.
// @param {stromg} (props.addNewLabel) - Custom label for the `add new` button.
export default function ManualMultiPicker(props) {
  let {onUpdate, component} = props;
  let values = _.isArray(props.value) ? props.value : [props.default];
  let addNewLabel = props.addNewLabel || 'Add new';

  return <div className="ManualMultiPicker">
    {_.map(values, (singleValue, index) => {
      return <div key={index} className={classNames(
          'ManualMultiPicker__item',
          {'ManualMultiPicker__item--last': index === values.length - 1},
        )}>
        <div className="ManualMultiPicker__item__infobar">
          <span><strong>#{index + 1}</strong></span>
          <button
            className="s-button ManualMultiPicker__item__remove"
            onClick={() => onUpdate(removeValueAt(values, index))}>
            remove
          </button>
        </div>

        <props.component
          onUpdate={(newValue) => onUpdate(updateValueAt(values, index, newValue))}
          value={singleValue}
        />
      </div>
    })}
    <div className="ManualMultiPicker__addNew">
      <button className="s-button" onClick={() => onUpdate(values.concat(props.default))}>
        {addNewLabel}
      </button>
    </div>
  </div>
}

// Removes a item in specific area of index
function removeValueAt(values, index) {
  values = [].concat(values);
  values.splice(index, 1);
  return values;
}

// Replaces a value of the array at a specific index
function updateValueAt(values, index, newValue) {
  values = values.slice();
  values[index] = newValue;
  return values;
}
