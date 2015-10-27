import React from 'react';
import {EndpointExplorer} from './EndpointExplorer';
import {NetworkPicker} from './NetworkPicker';

export let PlaygroundChrome = React.createClass({
  render: function() {
    return <div>
      <div className="so-back">
        <div className="so-chunk">
          <div className="so-siteHeader PlaygroundChrome__header">
            <span className="so-logo">
              <a href="https://www.stellar.org/" className="so-logo__main">Stellar</a>
              <span className="so-logo__separator"> </span>
              <a href="#check" className="so-logo__subSite">laboratory</a>
            </span>
            <NetworkPicker />
          </div>
        </div>
      </div>
      <div className="so-back PlaygroundChrome__siteNavBack">
        <div className="so-chunk">
          <nav className="s-buttonList">
            <a href="#" className="s-buttonList__item s-button s-button__min is-active">Endpoint Explorer</a>
            <a className="s-buttonList__item s-button s-button__min">More coming soon</a>
          </nav>
        </div>
      </div>
      <div className="so-back">
        <div className="so-chunk">
          <EndpointExplorer />
        </div>
      </div>

    </div>;
  }
});
