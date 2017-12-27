import React from 'react';
import _ from 'lodash';
import OptionsTablePair from '../OptionsTable/Pair';
import AssetPicker from '../FormComponents/AssetPicker.js';
import TextPicker from '../FormComponents/TextPicker.js';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';
import OrderPicker from '../FormComponents/OrderPicker.js';

export default function Trades(props) {
  return <div>
    <OptionsTablePair label="Base Asset" optional={true}>
      <AssetPicker
      value={props.values['base_asset']}
      onUpdate={(value) => {props.onUpdate('base_asset', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Counter Asset" optional={true}>
      <AssetPicker
      value={props.values['counter_asset']}
      onUpdate={(value) => {props.onUpdate('counter_asset', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Offer id" optional={true}>
      <TextPicker
          value={props.values['offer_id']}
          onUpdate={(value) => {props.onUpdate('offer_id', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Cursor" optional={true}>
      <TextPicker
        value={props.values['cursor']}
        onUpdate={(value) => {props.onUpdate('cursor', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Limit" optional={true}>
      <PositiveIntPicker
      value={props.values['limit']}
        onUpdate={(value) => {props.onUpdate('limit', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Order" optional={true}>
      <OrderPicker
        value={props.values['order']}
        onUpdate={(value) => {props.onUpdate('order', value)}}
        />
    </OptionsTablePair>
  </div>
}
