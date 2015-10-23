import React from 'react';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';

export let EndpointExplorer = React.createClass({
  render: function() {
    return <div className="EndpointExplorer">
      <div className="EndpointExplorer__picker">
        <EndpointPicker />
      </div>

      <EndpointSetup />
    </div>;
  }
});
