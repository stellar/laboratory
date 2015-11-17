import React from 'react';
import classNames from 'classnames';
import NetworkPicker from './NetworkPicker';
import EndpointExplorer from './EndpointExplorer';
import TransactionBuilder from './TransactionBuilder';

export let PlaygroundChrome = React.createClass({
  getInitialState: function() {
    return {
      tab: 'TransactionBuilder'
    };
  },
  changeTab: function(tab) {
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
      default:
        throw new Error(`Invalid tab: ${this.state.tab}`);
    }

    let defaultClasses = 'buttonList__item s-button s-button__min';

    return <div>
      <div className="so-back">
        <div className="so-chunk">
          <div className="so-siteHeader PlaygroundChrome__header">
            <span className="so-logo">
              <a href="https://www.stellar.org/" className="so-logo__main">Stellar</a>
              <span className="so-logo__separator"> </span>
              <a href="https://www.stellar.org/laboratory/" className="so-logo__subSite">laboratory</a>
            </span>
            <NetworkPicker />
          </div>
        </div>
      </div>
      <div className="so-back PlaygroundChrome__siteNavBack">
        <div className="so-chunk">
          <nav className="s-buttonList">
            <a href="#"
               onClick={this.changeTab.bind(this, 'EndpointExplorer')}
               className={classNames(defaultClasses, {'is-active': this.state.tab === 'EndpointExplorer'})}>
              Endpoint Explorer
            </a>
            <a href="#"
               onClick={this.changeTab.bind(this, 'TransactionBuilder')}
               className={classNames(defaultClasses, {'is-active': this.state.tab === 'TransactionBuilder'})}>
              Transaction Builder
            </a>
          </nav>
        </div>
      </div>

      {activeTab}
    </div>;
  }
});
