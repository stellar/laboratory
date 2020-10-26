import React from 'react';
import RevokeSponsorshipPicker from '../FormComponents/RevokeSponsorshipPicker';

export default function RevokeSponsorship(props) {
  return <RevokeSponsorshipPicker
    value={props.values['revoke']}
    onUpdate={(value) => {props.onUpdate('revoke', value)}}
  />;
}
