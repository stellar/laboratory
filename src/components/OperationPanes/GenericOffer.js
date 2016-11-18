import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';
import PositiveNumberPicker from '../FormComponents/PositiveNumberPicker.js';
import AmountPicker from '../FormComponents/AmountPicker.js';
import AssetPicker from '../FormComponents/AssetPicker.js';

export default function GenericOffer(props) {
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
    <OptionsTablePair label="Amount you are selling" key="amount">
      <AmountPicker
        value={props.values['amount']}
        onUpdate={(value) => {props.onUpdate('amount', value)}}
        />
      <p className="optionsTable__pair__content__note">An amount of zero will delete the offer.</p>
    </OptionsTablePair>,
    <OptionsTablePair label="Price of 1 unit of asset for sale" key="price">
      <PositiveNumberPicker
        value={props.values['price']}
        onUpdate={(value) => {props.onUpdate('price', value)}}
        />
    </OptionsTablePair>,
  ];
}
