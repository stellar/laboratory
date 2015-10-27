import React from 'react';
import {AddressParameter} from './ParametersFormComponents/AddressParameter';
import {CursorParameter} from './ParametersFormComponents/CursorParameter';
import {LedgerParameter} from './ParametersFormComponents/LedgerParameter';
import {LimitParameter} from './ParametersFormComponents/LimitParameter';
import {OperationParameter} from './ParametersFormComponents/OperationParameter';
import {OrderParameter} from './ParametersFormComponents/OrderParameter';
import {TransactionParameter} from './ParametersFormComponents/TransactionParameter';
import {ExplorerStore} from '../stores/ExplorerStore';
import {EasySelect} from './EasySelect';

export let EndpointSetup = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let params = ExplorerStore.getCurrentEndpointParams();
    let url = ExplorerStore.getCurrentUrl();
    return {params, url};
  },
  onChange: function() {
    this.setState(this.getState());
  },
  onSubmit: function() {
    ExplorerStore.submitRequest();
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
      return <div className="so-chunk">
          <div className="optionsTable">
            {this.state.params.map(type => {
              switch (type) {
                case 'address':
                  return <AddressParameter key={type} param={type} />;
                case 'cursor':
                  return <CursorParameter key={type} param={type} />;
                case 'ledger':
                  return <LedgerParameter key={type} param={type} />;
                case 'limit':
                  return <LimitParameter key={type} param={type} />;
                case 'operation':
                  return <OperationParameter key={type} param={type} />;
                case 'order':
                  return <OrderParameter key={type} param={type} />;
                case 'transaction':
                  return <TransactionParameter key={type} param={type} />;
                default:
                  throw new Error('Invalid param');
                  return;
              }
            })}
            <hr className="optionsTable__separator" />
            <div className="optionsTable__blank">
              <EasySelect className="EndpointSetup__url">{this.state.url}</EasySelect>
            </div>
            <div className="optionsTable__blank">
              <button className="s-button" onClick={this.onSubmit}>Submit</button>
            </div>
          </div>
        </div>;
    } else {
      return <div></div>;
    }
  }
});
