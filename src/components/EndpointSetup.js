import _ from 'lodash';
import React from 'react';
import {AddressParameter} from './ParametersFormComponents/AddressParameter';
import {AmountParameter} from './ParametersFormComponents/AmountParameter';
import {AssetCodeParameter} from './ParametersFormComponents/AssetCodeParameter';
import {AssetTypeParameter} from './ParametersFormComponents/AssetTypeParameter';
import {CursorParameter} from './ParametersFormComponents/CursorParameter';
import {LedgerParameter} from './ParametersFormComponents/LedgerParameter';
import {LimitParameter} from './ParametersFormComponents/LimitParameter';
import {OperationParameter} from './ParametersFormComponents/OperationParameter';
import {OrderParameter} from './ParametersFormComponents/OrderParameter';
import {TransactionParameter} from './ParametersFormComponents/TransactionParameter';
import {ExplorerActions} from '../actions/ExplorerActions';
import {ExplorerStore} from '../stores/ExplorerStore';
import {EasySelect} from './EasySelect';

export let EndpointSetup = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let endpointId = ExplorerStore.getCurrentEndpointId();
    let params = ExplorerStore.getCurrentEndpointParams();
    let requiredParams = ExplorerStore.getCurrentEndpointRequiredParams();
    let url = ExplorerStore.getCurrentUrl();
    return {endpointId, params, requiredParams, url};
  },
  onChange: function() {
    this.setState(this.getState());
  },
  onSubmit: function() {
    ExplorerStore.submitRequest();
  },
  formComponentUpdate: function(param, value, error) {
    ExplorerActions.parameterSet(param, value, error);
  },
  componentDidMount: function() {
    ExplorerStore.addChangeListener(this.onChange);
    ExplorerStore.addUrlChangeListener(this.onChange);
    ExplorerStore.addNetworkChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeChangeListener(this.onChange);
    ExplorerStore.removeUrlChangeListener(this.onChange);
    ExplorerStore.removeNetworkChangeListener(this.onChange);
  },
  render: function() {
    if (this.state.params) {
      let addParameterChangeListener = ExplorerStore.addParameterChangeListener.bind(ExplorerStore);
      let removeParameterChangeListener = ExplorerStore.removeParameterChangeListener.bind(ExplorerStore);
      let addParameterErrorListener = ExplorerStore.addParameterErrorListener.bind(ExplorerStore);
      let removeParameterErrorListener = ExplorerStore.removeParameterErrorListener.bind(ExplorerStore);
      console.log(addParameterChangeListener)
      return <div className="so-chunk">
        <div className="optionsTable">
          {this.state.params.map(type => {
            console.log(addParameterChangeListener)
            let key = `${this.state.endpointId}.${type}`;
            let optional = !_.contains(this.state.requiredParams, type);
            switch (type) {
              case 'address':
              case 'source_account':
              case 'destination_account':
                return <AddressParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'selling_asset_issuer':
              case 'buying_asset_issuer':
              case 'destination_asset_issuer':
                return <AddressParameter key={key} param={type} optional={false} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'selling_asset_code':
              case 'buying_asset_code':
              case 'destination_asset_code':
                return <AssetCodeParameter key={key} param={type} optional={false} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'selling_asset_type':
              case 'buying_asset_type':
              case 'destination_asset_type':
                return <AssetTypeParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'destination_amount':
                return <AmountParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'cursor':
                return <CursorParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'ledger':
                return <LedgerParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'limit':
                return <LimitParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'operation':
                return <OperationParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'order':
                return <OrderParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              case 'transaction':
                return <TransactionParameter key={key} param={type} optional={optional} onUpdate={this.formComponentUpdate} addParameterChangeListener={addParameterChangeListener} removeParameterChangeListener={removeParameterChangeListener} addParameterErrorListener={addParameterErrorListener} removeParameterErrorListener={removeParameterErrorListener} />;
              default:
                throw new Error(`Invalid param: ${type}`);
                return;
            }
          })}
          <hr className="optionsTable__separator" />
          <div className="optionsTable__blank EndpointSetup__url">
            <EasySelect className="">{this.state.url}</EasySelect>
          </div>
          <div className="optionsTable__blank">
            <button className="s-button" onClick={this.onSubmit}>Submit</button>
          </div>
        </div>
      </div>;
    } else {
      return null;
    }
  }
});
