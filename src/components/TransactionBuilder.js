import React from 'react';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {EndpointResult} from './EndpointResult';
import {AddressParameter} from './ParametersFormComponents/AddressParameter';
import ImportXDR from './ImportXDR';
import TxBuilderAttributes from './TxBuilderAttributes';
import TxBuilderOperations from './TxBuilderOperations';
import TxBuilderResult from './TxBuilderResult';
import TxBuilderStore from '../stores/TxBuilderStore';

export default class TransactionBuilder extends React.Component {
  render() {
    return <div className="TransactionBuilder">
      <div className="so-back">
        <div className="so-chunk">
          <ImportXDR />
        </div>
      </div>
      <div className="so-back TransactionBuilder__result">
        <div className="so-chunk">
          <TxBuilderResult />
        </div>
      </div>
    </div>
  }
};
