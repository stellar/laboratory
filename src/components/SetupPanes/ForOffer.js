import React from 'react';

import For from './For';
import OfferPicker from '../FormComponents/OfferPicker.js';

export default function ForAccount(props) {
  let label = 'Offer ID';
  let content = <OfferPicker
    value={props.values['offer_id']}
    onUpdate={(value) => {props.onUpdate('offer_id', value)}}
    />

  return <For label={label} content={content} {...props} />
}
