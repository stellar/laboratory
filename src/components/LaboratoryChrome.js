import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import NetworkPicker from './NetworkPicker';
import EndpointExplorer from './EndpointExplorer';
import TransactionBuilder from './TransactionBuilder';
import TransactionSigner from './TransactionSigner';
import {RouterListener} from '../utilities/simpleRouter';

function LaboratoryChrome(props) {
  let tabItem = (name, slug) => {
    return <a
      href={'#' + slug}
      className={classNames(
        'buttonList__item s-button s-button__min',
        {'is-active': props.routing.location === slug})}
      key={slug}>
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
          {tabItem('Endpoint Explorer', 'explorer')}
          {tabItem('Transaction Builder', 'txbuilder')}
          {tabItem('Transaction Signer', 'txsigner')}
        </nav>
      </div>
    </div>

    {getContent(props.routing.location)}
    <RouterListener />
  </div>;
}

function getContent(slug) {
  switch (slug) {
    case '':
      return <SimplePage><p>To begin, select a tool from above.</p></SimplePage>
    case 'explorer':
      return <EndpointExplorer />;
    case 'txbuilder':
      return <TransactionBuilder />;
    case 'txsigner':
      return <TransactionSigner />;
    default:
      return <SimplePage><p>Page "{slug}" not found</p></SimplePage>
  }
}

function SimplePage(props) {
  return <div className="so-back SimplePage__back">
    <div className="so-chunk">
      {props.children}
    </div>
  </div>
}

export default connect(chooseState)(LaboratoryChrome);
function chooseState(state) {
  return {
    routing: state.routing
  }
}
