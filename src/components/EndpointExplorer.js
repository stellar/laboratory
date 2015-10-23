import React from 'react';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {ResponseViewer} from './ResponseViewer';

export let EndpointExplorer = React.createClass({
  render: function() {
    return <div className="EndpointExplorer">
      <div className="EndpointExplorer__picker">
        <EndpointPicker />
      </div>

      <EndpointSetup />

      <ResponseViewer />
    </div>;
  }
});
