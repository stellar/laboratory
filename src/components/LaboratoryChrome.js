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
import regularWoff from '../assets/suisseintl-regular-webfont.woff';
import regularWoff2 from '../assets/suisseintl-regular-webfont.woff2';
import semiboldWoff from '../assets/suisseintl-semibold-webfont.woff';
import semiboldWoff2 from '../assets/suisseintl-semibold-webfont.woff2';
import monoWoff from '../assets/suisseintlmono-regular-webfont.woff'
import monoWoff2 from '../assets/suisseintlmono-regular-webfont.woff2'

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
    <style dangerouslySetInnerHTML={{__html: `
      @font-face {
        font-display: block;
        font-family: suisse;
        src:
          url('${regularWoff}') format("woff"),
          url('${regularWoff2}') format("woff2");
        font-weight: 400;
      }
      @font-face {
        font-display: block;
        font-family: suisse;
        src:
          url('${semiboldWoff}') format("woff"),
          url('${semiboldWoff2}') format("woff2");
        font-weight: 500;
      }

      @font-face {
        font-display: swap;
        font-family: suisse-mono;
        src:
          url('${monoWoff}') format("woff"),
          url('${monoWoff2}') format("woff2");
        font-weight: 400;
      }`}}
    />
    {props.currentNetwork.name == "test" ?
      <div className="LaboratoryChrome__network_reset_alert s-alert">
        <div className="so-chunk">
          The test network will be reset on July 31st, 2019 at 0900 UTC. Please see our <a href="https://www.stellar.org/developers/guides/concepts/test-net.html#best-practices-for-using-testnet">testnet best practices</a> for more information.
        </div>
      </div> :
      null
    }
    <div className="so-back">
      <div className="so-chunk">
        <div className="so-siteHeader LaboratoryChrome__header">
          <span className="so-logo">
            <a href="https://www.stellar.org/" className="so-logo__main"><svg width="100" height="61" clasNames="Navigation__LogoEl-sc-1ng8ds2-1 kCDSHy" viewBox="0 0 799.93 200"><path d="M203 26.16l-28.46 14.5-137.43 70a82.49 82.49 0 0 1-.7-10.69A81.87 81.87 0 0 1 158.2 28.6l16.29-8.3 2.43-1.24A100 100 0 0 0 18.18 100q0 3.82.29 7.61a18.19 18.19 0 0 1-9.88 17.58L0 129.57V150l25.29-12.89 8.19-4.18 8.07-4.11L186.43 55l16.28-8.29 33.65-17.15V9.14zM236.36 50L49.78 145l-16.28 8.31L0 170.38v20.41l33.27-16.95 28.46-14.5 137.57-70.1A83.45 83.45 0 0 1 200 100a81.87 81.87 0 0 1-121.91 71.36l-1 .53-17.66 9A100 100 0 0 0 218.18 100c0-2.57-.1-5.14-.29-7.68a18.2 18.2 0 0 1 9.87-17.58l8.6-4.38zM517.39 64.18c-28.54 0-50.68 21-50.68 54.17 0 30.87 18.25 54.56 51.26 54.56 25.44 0 42.13-14.95 46.79-32.82h-18.25c-4.46 10.29-13 17.28-28.54 17.28-15.34 0-31.65-10.87-32.23-33.39h80.38c2.14-33.2-16.7-59.8-48.73-59.8zm-31.46 44.65c1.56-21 15.92-29.51 31.46-29.51 18.83 0 29.51 14.76 30.09 29.51zM359.26 89.61L343 85.92c-13.25-2.92-23-9.12-23-21.55 0-15.73 19-20.58 29.9-20.58 14 0 30.29 5.63 34.95 21.74h19.23c-5.64-27-28-38.44-53.4-38.44-22.72 0-50.87 11.46-50.87 38.44 0 23.3 19.22 34.18 38.64 38.45l17.55 3.69c17.67 4.08 30.29 9.9 30.29 24.85 0 14-11.84 23.69-32.81 23.69-21.94 0-35.14-10.1-38.83-29.51h-19.46c3.69 28 24.66 46.21 57.86 46.21 28 0 53.59-14.76 53.59-42.14 0-28.34-25.82-36.5-47.38-41.16zM444.58 39.71h-17.67v26.21H410.4V80.1h16.51v64.07c0 21.75 4.66 26.21 24.66 26.21h12.81v-14.75h-8.93c-10.1 0-10.87-2.72-10.87-13.59V80.1h19.8V65.92h-19.8zM794.69 65.34c-13.79.58-24.27 7-29.51 18.83V65.92h-17.29v104.46h17.67v-54.75c0-23.3 8.16-32 24.47-32a63.44 63.44 0 0 1 9.9.78V65.53a52 52 0 0 0-5.24-.19zM730.89 131l.19-24.08c.2-29.71-12.23-43.1-41.55-43.1-20.19 0-40.39 12.62-41.94 35.14h18.25c.78-13 9.13-20.77 23.88-20.77 13.21 0 23.69 6.21 23.69 25.43v2.52c-42.71 4.67-70.67 12-70.67 36.7 0 19.22 16.31 30.1 35.92 30.1 18.64 0 29.32-6 35.72-16.89a114.46 114.46 0 0 0 1.36 14.36h17.86c-2.13-9.93-2.91-21.77-2.71-39.41zm-16.12-4.27c0 24.65-15.72 32.23-32.23 32.23-12.62 0-20.19-6.6-20.19-16.51 0-14.37 20.38-19.22 52.42-22.33zM578.01 29.54h17.67v140.84h-17.67zM613.34 29.54h17.67v140.84h-17.67z"></path></svg></a>
            <span className="so-logo__separator"> </span>
            <a href="#" className="so-logo__subSite">Laboratory</a>
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
