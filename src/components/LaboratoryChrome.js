/**
 * @prettier
 */
import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import Loadable from "react-loadable";
import NetworkPicker from "./NetworkPicker";
import MaintenanceBanner from "./MaintenanceBanner";
import Introduction from "./Introduction";
import { RouterListener } from "../utilities/simpleRouter";
import SLUG from "../constants/slug";
import { addEventHandler } from "../utilities/metrics";
import routingMetrics from "../metricsHandlers/routing";

addEventHandler(routingMetrics);

function LaboratoryChrome(props) {
  let tabItem = (name, slug) => {
    return (
      <a
        href={"#" + slug}
        className={classNames("buttonList__item s-button s-button--min", {
          "is-active": props.routing.location === slug,
        })}
        key={slug}
      >
        {name}
      </a>
    );
  };

  return (
    <div>
      <MaintenanceBanner currentNetwork={props.currentNetwork.name} />
      <div className="so-back">
        <div className="so-chunk">
          <div className="so-siteHeader LaboratoryChrome__header">
            <span className="so-logo">
              <a href="https://www.stellar.org/" className="so-logo__main">
                <svg
                  width="100"
                  height="61"
                  className="Navigation__LogoEl-sc-1ng8ds2-1 kCDSHy"
                  viewBox="0 0 799.93 200"
                >
                  <path d="M203 26.16l-28.46 14.5-137.43 70a82.49 82.49 0 0 1-.7-10.69A81.87 81.87 0 0 1 158.2 28.6l16.29-8.3 2.43-1.24A100 100 0 0 0 18.18 100q0 3.82.29 7.61a18.19 18.19 0 0 1-9.88 17.58L0 129.57V150l25.29-12.89 8.19-4.18 8.07-4.11L186.43 55l16.28-8.29 33.65-17.15V9.14zM236.36 50L49.78 145l-16.28 8.31L0 170.38v20.41l33.27-16.95 28.46-14.5 137.57-70.1A83.45 83.45 0 0 1 200 100a81.87 81.87 0 0 1-121.91 71.36l-1 .53-17.66 9A100 100 0 0 0 218.18 100c0-2.57-.1-5.14-.29-7.68a18.2 18.2 0 0 1 9.87-17.58l8.6-4.38zM517.39 64.18c-28.54 0-50.68 21-50.68 54.17 0 30.87 18.25 54.56 51.26 54.56 25.44 0 42.13-14.95 46.79-32.82h-18.25c-4.46 10.29-13 17.28-28.54 17.28-15.34 0-31.65-10.87-32.23-33.39h80.38c2.14-33.2-16.7-59.8-48.73-59.8zm-31.46 44.65c1.56-21 15.92-29.51 31.46-29.51 18.83 0 29.51 14.76 30.09 29.51zM359.26 89.61L343 85.92c-13.25-2.92-23-9.12-23-21.55 0-15.73 19-20.58 29.9-20.58 14 0 30.29 5.63 34.95 21.74h19.23c-5.64-27-28-38.44-53.4-38.44-22.72 0-50.87 11.46-50.87 38.44 0 23.3 19.22 34.18 38.64 38.45l17.55 3.69c17.67 4.08 30.29 9.9 30.29 24.85 0 14-11.84 23.69-32.81 23.69-21.94 0-35.14-10.1-38.83-29.51h-19.46c3.69 28 24.66 46.21 57.86 46.21 28 0 53.59-14.76 53.59-42.14 0-28.34-25.82-36.5-47.38-41.16zM444.58 39.71h-17.67v26.21H410.4V80.1h16.51v64.07c0 21.75 4.66 26.21 24.66 26.21h12.81v-14.75h-8.93c-10.1 0-10.87-2.72-10.87-13.59V80.1h19.8V65.92h-19.8zM794.69 65.34c-13.79.58-24.27 7-29.51 18.83V65.92h-17.29v104.46h17.67v-54.75c0-23.3 8.16-32 24.47-32a63.44 63.44 0 0 1 9.9.78V65.53a52 52 0 0 0-5.24-.19zM730.89 131l.19-24.08c.2-29.71-12.23-43.1-41.55-43.1-20.19 0-40.39 12.62-41.94 35.14h18.25c.78-13 9.13-20.77 23.88-20.77 13.21 0 23.69 6.21 23.69 25.43v2.52c-42.71 4.67-70.67 12-70.67 36.7 0 19.22 16.31 30.1 35.92 30.1 18.64 0 29.32-6 35.72-16.89a114.46 114.46 0 0 0 1.36 14.36h17.86c-2.13-9.93-2.91-21.77-2.71-39.41zm-16.12-4.27c0 24.65-15.72 32.23-32.23 32.23-12.62 0-20.19-6.6-20.19-16.51 0-14.37 20.38-19.22 52.42-22.33zM578.01 29.54h17.67v140.84h-17.67zM613.34 29.54h17.67v140.84h-17.67z"></path>
                </svg>
              </a>
              <span className="so-logo__separator"> </span>
              <a href="#" className="so-logo__subSite">
                Laboratory
              </a>
            </span>
            <NetworkPicker />
          </div>
        </div>
      </div>
      <div className="so-back LaboratoryChrome__siteNavBack">
        <div className="so-chunk">
          <nav className="s-buttonList">
            {tabItem("Introduction", SLUG.HOME)}
            {tabItem("Create Account", SLUG.ACCOUNT_CREATOR)}
            {tabItem("Explore Endpoints", SLUG.EXPLORER)}
            {tabItem("Build Transaction", SLUG.TXBUILDER)}
            {tabItem("Sign Transaction", SLUG.TXSIGNER)}
            {tabItem("Submit Transaction", SLUG.TXSUBMITTER)}
            {tabItem("View XDR", SLUG.XDRVIEWER)}
          </nav>
        </div>
      </div>

      {renamed(props.routing.location)}
      <RouterListener />

      <div className="so-back LaboratoryChrome__terms">
        <div className="so-chunk ">
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.stellar.org/terms-of-service"
          >
            Terms of Service
          </a>
          <span className="spacer" />
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.stellar.org/privacy-policy"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

const Loading = ({ pastDelay, error }) => {
  if (error) {
    return (
      <div className="so-back">
        <div className="so-chunk Introduction">
          <p>
            There was a problem loading this page. If your network connection is
            still working, try reloading.
          </p>
          <p>
            <button
              className="s-button"
              onClick={() => {
                window.history.go(0);
              }}
            >
              Reload
            </button>
          </p>
          <details>
            <summary>View stack trace</summary>
            <pre>{error.stack}</pre>
          </details>
        </div>
      </div>
    );
  } else if (pastDelay) {
    return (
      <div className="so-back">
        <div className="so-chunk">loading…</div>
      </div>
    );
  } else {
    return null;
  }
};
const makeAsync = (loader) =>
  Loadable({
    loader,
    loading: Loading,
  });
const AsyncAccountCreator = makeAsync(() =>
  import(/* webpackChunkName: 'Creator' */ "./AccountCreator"),
);
const AsyncEndpointExplorer = makeAsync(() =>
  import(/* webpackChunkName: 'Explorer' */ "./EndpointExplorer"),
);
const AsyncTransactionBuilder = makeAsync(() =>
  import(/* webpackChunkName: 'Builder' */ "./TransactionBuilder"),
);
const AsyncTransactionSigner = makeAsync(() =>
  import(/* webpackChunkName: 'Signer' */ "./TransactionSigner"),
);
const AsyncXdrViewer = makeAsync(() =>
  import(/* webpackChunkName: 'Viewer' */ "./XdrViewer"),
);
const AsyncTransactionSubmitter = makeAsync(() =>
  import(/* webpackChunkName: 'Submitter' */ "./TransactionSubmitter"),
);

function renamed(slug) {
  switch (slug) {
    case SLUG.HOME:
      return <Introduction />;
    case SLUG.ACCOUNT_CREATOR:
      return <AsyncAccountCreator />;
    case SLUG.EXPLORER:
      return <AsyncEndpointExplorer />;
    case SLUG.TXBUILDER:
      return <AsyncTransactionBuilder />;
    case SLUG.TXSIGNER:
      return <AsyncTransactionSigner />;
    case SLUG.XDRVIEWER:
      return <AsyncXdrViewer />;
    case SLUG.TXSUBMITTER:
      return <AsyncTransactionSubmitter />;
    default:
      return (
        <SimplePage>
          <p>Page "{slug}" not found</p>
        </SimplePage>
      );
  }
}

function SimplePage(props) {
  return (
    <div className="so-back SimplePage__back">
      <div className="so-chunk">{props.children}</div>
    </div>
  );
}

export default connect(chooseState)(LaboratoryChrome);
function chooseState(state) {
  return {
    routing: state.routing,
    currentNetwork: state.network.current,
  };
}
