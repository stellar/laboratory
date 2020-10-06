import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';

export default function BeginSponsoringFutureReserves(props) {
  return [
    <OptionsTablePair label="Sponsored ID" key="sponsoredId">
      <PubKeyPicker
        value={props.values['sponsoredId']}
        onUpdate={(value) => {props.onUpdate('sponsoredId', value)}}
        />
    </OptionsTablePair>,
  ];
}
