import React from 'react';
import {EndpointPicker} from './EndpointPicker';
import {ParametersForm} from './ParametersForm';

export let Explorer = React.createClass({
  render: function() {
    return <div>
      <EndpointPicker />
      <ParametersForm />
    </div>;
  }
});
