import React from 'react';
import PositiveIntPicker from './PositiveIntPicker';

export default function OfferPicker(props) {
  return <PositiveIntPicker
    {...props}
    placeholder={props.placeholder || 'Example: 323223'}
  />
}
