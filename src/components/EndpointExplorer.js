import React from 'react';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {EndpointResult} from './EndpointResult';

export let EndpointExplorer = React.createClass({
  render: function() {
    return <div className="so-back">
      <div className="so-chunk">
        <div className="EndpointExplorer">
          <div className="EndpointExplorer__picker">
            <EndpointPicker />
          </div>

          <div className="EndpointExplorer__setup">
            <EndpointSetup />
          </div>

          <div className="EndpointExplorer__result">
            <EndpointResult />
          </div>
        </div>
      </div>
    </div>
  }
});
