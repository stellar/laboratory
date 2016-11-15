import React from 'react';
import _ from 'lodash';
import TimestampPicker from './TimestampPicker';

export default function TimeBoundsPicker(props) {
  let {value, onUpdate} = props;

  return <div>
      <TimestampPicker
        value={value.minTime}
        placeholder='Lower time bound unix timestamp. Example: 1479151713'
        onUpdate={(minTimeValue) => onUpdate(_.assign({}, value, {
          minTime: minTimeValue,
        }))}
      />
      <TimestampPicker
        value={value.maxTime}
        placeholder='Upper time bound unix timestamp.  Example: 1479151713'
        onUpdate={(maxTimeValue) => onUpdate(_.assign({}, value, {
          maxTime: maxTimeValue,
        }))}
        />
    </div>
}
