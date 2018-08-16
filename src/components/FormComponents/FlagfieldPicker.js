import React from 'react';
import CheckboxButtonPicker from './CheckboxButtonPicker';
import _ from 'lodash';

// When all the items are empty, then this picker should be equal to ''

// @param {object} props.items An object whose keys are the bitfield number
//   and values are the label displayed to the user. The keys must be consecutive
//   or else it won't work (example: 1, 2, 4, 8, 16...).
// {
//   1: 'Human Readable Label',
// }
export default function FlagfieldPicker(props) {
  let {value, onUpdate, items} = props;
  let group = Math.random(); // Allows for tabbing and prevents checkbox collisions

  let parsedValue = parseInt(value);
  let pickerValue = [];
  if (isInteger(parsedValue)) {
    pickerValue = intToExistenceArray(parsedValue);
  }

  let statusLine;
  if (pickerValue.length > 0) {
    let sumItems = [], total = 0;
    _.each(pickerValue, (bitValue) => {
      sumItems.push(`${items[bitValue]} (${bitValue})`);
      total += parseInt(bitValue);
    });
    statusLine = sumItems.join(' + ') + ` = ${total}`;
  }

  return <div>
    <div className={`s-buttonGroup picker picker--radio ${props.className}`}>
      <CheckboxButtonPicker
        className={statusLine === undefined ? '' : 'picker--spaceBottom'}
        value={pickerValue}
        onUpdate={(valueArray) => onUpdate(existenceArrayToInt(valueArray))}
        items={items}
      />
    </div>

    {statusLine}
  </div>;
}

// Converts an integer to an array of strings with decimal representations of the number
// Example:
//   int input: 5
//   existence array output: [1, 4]
function intToExistenceArray(inputInt) {
  let existenceArray = [];
  // iterate through binary representation of number
  let binaryArray = inputInt.toString(2).split('');
  _.each(binaryArray, (binaryValue, index) => {
    if (binaryValue === '1') {
      existenceArray.push(String(Math.pow(2, binaryArray.length - 1 - index))); // calculate decimal representation of bit in specific index
    }
  });
  return existenceArray;
}

// The reverse of intToExistenceArray
function existenceArrayToInt(existenceArray) {
  return _.reduce(existenceArray, (result, intValue) => {
    return result | parseInt(intValue);
  }, undefined);
}

function isInteger(input) {
  return String(input).match(/^[0-9]*$/g);
}
