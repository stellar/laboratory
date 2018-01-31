import React from 'react';
import OptionsTablePair from '../OptionsTable/Pair';
import AssetPicker from '../FormComponents/AssetPicker.js';
import TextPicker from '../FormComponents/TextPicker.js';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';
import OrderPicker from '../FormComponents/OrderPicker.js';

export default function TradeAggregations(props) {
  return <div>
    <OptionsTablePair label="Base Asset" optional={false}>
      <AssetPicker
      value={props.values['base_asset']}
      onUpdate={(value) => {props.onUpdate('base_asset', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Counter Asset" optional={false}>
      <AssetPicker
      value={props.values['counter_asset']}
      onUpdate={(value) => {props.onUpdate('counter_asset', value)}}
      />
    </OptionsTablePair>
    <OptionsTablePair label="Start Time" optional={false}>
      <TextPicker
        value={props.values['start_time']}
        onUpdate={(value) => {props.onUpdate('start_time', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="End Time" optional={false}>
      <TextPicker
        value={props.values['end_time']}
        onUpdate={(value) => {props.onUpdate('end_time', value)}}
        />
    </OptionsTablePair>
    <OptionsTablePair label="Resolution" optional={false}>
      <TextPicker
        value={props.values['resolution']}
        onUpdate={(value) => {props.onUpdate('resolution', value)}}
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
