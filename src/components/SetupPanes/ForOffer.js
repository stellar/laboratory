import React from 'react';

import For from './For';
import PositiveIntPicker from '../FormComponents/PositiveIntPicker.js';

export default function ForOffer(props) {
  let label = 'Offer ID';
  let content = <PositiveIntPicker
    value={props.values['offer_id']}
    onUpdate={(value) => {props.onUpdate('offer_id', value)}}
    placeholder={'Example: 323223'}
  />

  return <For label={label} content={content} {...props} />
}
