import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import GenericOffer from './GenericOffer';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';

export default function ManageOffer(props) {
  let GenericOfferPickers = GenericOffer(props);
  return GenericOfferPickers.concat(
    <OptionsTablePair label="Offer ID" key="offerId">
      <PositiveIntPicker
        value={props.values['offerId']}
        onUpdate={(value) => {props.onUpdate('offerId', value)}}
        />
      <p className="optionsTable__pair__content__note">If 0, will create a new offer. Existing offer id numbers can be found using the Offers for Account endpoint.</p>
    </OptionsTablePair>
  );
}
