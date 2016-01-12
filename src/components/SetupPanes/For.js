import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import TextPicker from '../FormComponents/TextPicker.js';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';
import OrderPicker from '../FormComponents/OrderPicker.js';

// Helper that generates any of the other For SetupPanes.
// Adds the new option row at the top with cursor, limit, and order below.

// Required props:
// - onUpdate
// - values
// - label
// - optional
// - content

export default function For(props) {
  return <div>
    <OptionsTablePair label={props.label} optional={props.optional}>
      {props.content}
    </OptionsTablePair>

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
