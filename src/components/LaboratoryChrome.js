import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import NetworkPicker from './NetworkPicker';
import Introduction from './Introduction';
import AccountCreator from './AccountCreator';
import EndpointExplorer from './EndpointExplorer';
import TransactionBuilder from './TransactionBuilder';
import TransactionSigner from './TransactionSigner';
import XdrViewer from './XdrViewer';
import {RouterListener} from '../utilities/simpleRouter';
import SLUG from '../constants/slug';
import {addEventHandler} from '../utilities/metrics'
import routingMetrics from '../metricsHandlers/routing'

addEventHandler(routingMetrics)

function LaboratoryChrome(props) {
  let tabItem = (name, slug) => {
    return <a
      href={'#' + slug}
      className={classNames(
        'buttonList__item s-button s-button--min',
        {'is-active': props.routing.location === slug})}
      key={slug}>
      {name}
    </a>
  }

  return <div>
    {props.currentNetwork.name == "test" ?
      <div className="LaboratoryChrome__network_reset_alert s-alert">
        <div className="so-chunk">
          The test network will be reset on October 30th 2019, 0900 UTC. Please see our <a href="https://www.stellar.org/developers/guides/concepts/test-net.html#best-practices-for-using-testnet">testnet best practices</a> for more information.
        </div>
      </div> :
      null
    }
    <div className="so-back">
      <div className="so-chunk">
        <div className="so-siteHeader LaboratoryChrome__header">
          <span className="so-logo">
            <a href="https://www.stellar.org/" className="so-logo__main">Stellar</a>
            <span className="so-logo__separator"> </span>
            <a href="#" className="so-logo__subSite">laboratory</a>
          </span>
          <NetworkPicker />
        </div>
      </div>
    </div>
    <div className="so-back LaboratoryChrome__siteNavBack">
      <div className="so-chunk">
        <nav className="s-buttonList">
          {tabItem('Introduction', SLUG.HOME)}
          {tabItem('Account Creator', SLUG.ACCOUNT_CREATOR)}
          {tabItem('Endpoint Explorer', SLUG.EXPLORER)}
          {tabItem('Transaction Builder', SLUG.TXBUILDER)}
          {tabItem('Transaction Signer', SLUG.TXSIGNER)}
          {tabItem('XDR Viewer', SLUG.XDRVIEWER)}
        </nav>
      </div>
    </div>

    {getContent(props.routing.location)}
    <RouterListener />
  </div>;
}

function getContent(slug) {
  switch (slug) {
    case SLUG.HOME:
      return <Introduction />
    case SLUG.ACCOUNT_CREATOR:
      return <AccountCreator />;
    case SLUG.EXPLORER:
      return <EndpointExplorer />;
    case SLUG.TXBUILDER:
      return <TransactionBuilder />;
    case SLUG.TXSIGNER:
      return <TransactionSigner />;
    case 'xdr-viewer':
      return <XdrViewer />;
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
    routing: state.routing,
    currentNetwork: state.network.current
  }
}
