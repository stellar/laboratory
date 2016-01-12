import React from 'react';
import _ from 'lodash';
import OptionsTablePair from '../OptionsTable/Pair';
import AssetPicker from '../FormComponents/AssetPicker.js';
import TextPicker from '../FormComponents/TextPicker.js';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';
import OrderPicker from '../FormComponents/OrderPicker.js';

export default function Trades(props) {
  return <div>
    <OptionsTablePair label="Selling Asset">
      <AssetPicker
      value={props.values['selling_asset']}
      onUpdate={(value) => {props.onUpdate('selling_asset', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Buying Asset">
      <AssetPicker
      value={props.values['buying_asset']}
      onUpdate={(value) => {props.onUpdate('buying_asset', value)}}
      />
    </OptionsTablePair>

    <OptionsTablePair label="Cursor" optional={true}>
      <TextPicker
        value={props.values['cursor']}
        onUpdate={(value) => {props.onUpdate('cursor', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Limit">
      <PositiveIntPicker
      value={props.values['limit']}
        onUpdate={(value) => {props.onUpdate('limit', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Order">
      <OrderPicker
        value={props.values['order']}
        onUpdate={(value) => {props.onUpdate('order', value)}}
        />
    </OptionsTablePair>
  </div>
}
