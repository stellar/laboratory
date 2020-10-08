import React from 'react';

import OptionsTablePair from '../OptionsTable/Pair';
import PubKeyPicker from '../FormComponents/PubKeyPicker.js';

export default function EndSponsoringFutureReserves(props) {
  return [
    <OptionsTablePair label="Source Account" key="sourceAccount">
      <PubKeyPicker
        value={props.values['sourceAccount']}
        onUpdate={(value) => props.onUpdate('sourceAccount', value)}
        />
      <p className="optionsTable__pair__content__note">Sponsored ID from Begin Sponsoring Future Reserves.</p>
    </OptionsTablePair>
  ];
}
