import React from 'react';
import {EndpointPicker} from './EndpointPicker';
import {ParametersForm} from './ParametersForm';

export let EndpointExplorer = React.createClass({
  render: function() {
    return <div>
      <EndpointPicker />
      <ParametersForm />
    </div>;
  }
});
