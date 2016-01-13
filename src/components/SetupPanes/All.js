import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import TextPicker from '../FormComponents/TextPicker.js';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';
import OrderPicker from '../FormComponents/OrderPicker.js';

export default function All(props) {
  return <div>
    <OptionsTablePair label="Cursor" optional={true}>
      <TextPicker
        value={props.values['cursor']}
        onUpdate={(value) => {props.onUpdate('cursor', value)}}
        key="cursor"
        />
    </OptionsTablePair>

    <OptionsTablePair label="Limit">
      <PositiveIntPicker
      value={props.values['limit']}
        onUpdate={(value) => {props.onUpdate('limit', value)}}
        key="limit"
        />
    </OptionsTablePair>

    <OptionsTablePair label="Order">
      <OrderPicker
        value={props.values['order']}
        onUpdate={(value) => {props.onUpdate('order', value)}}
        key="order"
        />
    </OptionsTablePair>
  </div>
}
