import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import NetworkPicker from './NetworkPicker';
import EndpointExplorer from './EndpointExplorer';
import TransactionBuilder from './TransactionBuilder';
import TransactionSigner from './TransactionSigner';
import {changePage} from '../actions/routing';

let LaboratoryChrome = React.createClass({
  getInitialState: function() {
    return {
      tab: 'EndpointExplorer'
    };
  },
  setTab: function(tab) {
    this.props.dispatch(changePage());
    this.setState({tab})
  },
  render: function() {
    let activeTab;
    switch (this.state.tab) {
      case 'EndpointExplorer':
        activeTab = <EndpointExplorer />;
        break;
      case 'TransactionBuilder':
        activeTab = <TransactionBuilder />;
        break;
      case 'TransactionSigner':
        activeTab = <TransactionSigner />;
        break;
      default:
        throw new Error(`Invalid tab: ${this.state.tab}`);
    }

    let defaultClasses = 'buttonList__item s-button s-button__min';

    let tabItem = (name, key) => {
      return <a
        onClick={() => {this.setTab(key)}}
        className={classNames(
          'buttonList__item s-button s-button__min',
          {'is-active': this.state.tab === key})}
        key={key}>
        {name}
      </a>
    }

    return <div>
      <div className="so-back">
        <div className="so-chunk">
          <div className="so-siteHeader LaboratoryChrome__header">
            <span className="so-logo">
              <a href="https://www.stellar.org/" className="so-logo__main">Stellar</a>
              <span className="so-logo__separator"> </span>
              <a href="https://www.stellar.org/laboratory/" className="so-logo__subSite">laboratory</a>
            </span>
            <NetworkPicker />
          </div>
        </div>
      </div>
      <div className="so-back LaboratoryChrome__siteNavBack">
        <div className="so-chunk">
          <nav className="s-buttonList">
            {tabItem('Endpoint Explorer', 'EndpointExplorer')}
            {tabItem('Transaction Builder', 'TransactionBuilder')}
            {tabItem('Transaction Signer', 'TransactionSigner')}
          </nav>
        </div>
      </div>

      {activeTab}
    </div>;
  }
});

export default connect(chooseState)(LaboratoryChrome);
function chooseState(state) {
  return {}
}
