import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PositiveNumberPicker from '../FormComponents/PositiveNumberPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';
import AssetPicker from '../FormComponents/AssetPicker.js';

export default function GenericOffer(props, isBuy) {
  return [
    <OptionsTablePair label="Selling" key="selling">
      <AssetPicker
        value={props.values['selling']}
        onUpdate={(value) => {props.onUpdate('selling', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair label="Buying" key="buying">
      <AssetPicker
        value={props.values['buying']}
        onUpdate={(value) => {props.onUpdate('buying', value)}}
        />
    </OptionsTablePair>,
    <OptionsTablePair 
      label={isBuy ? "Amount you are buying" : "Amount you are selling"} 
      key={isBuy ? "buyAmount" : "amount"}
    >
      <AmountPicker
        value={props.values[isBuy ? "buyAmount" : 'amount']}
        onUpdate={(value) => {props.onUpdate(isBuy ? "buyAmount" : 'amount', value)}}
        />
      <p className="optionsTable__pair__content__note">An amount of zero will delete the offer.</p>
    </OptionsTablePair>,
    <OptionsTablePair label={isBuy ? "Price of 1 unit of buying in terms of selling" : "Price of 1 unit of selling in terms of buying"} key="price">
      <PositiveNumberPicker
        value={props.values['price']}
        onUpdate={(value) => {props.onUpdate('price', value)}}
        />
    </OptionsTablePair>,
  ];
}
