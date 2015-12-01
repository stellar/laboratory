import React from 'react';
import {chooseEndpoint, submitRequest} from "../actions/endpointExplorer"
import {connect} from 'react-redux';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {EndpointResult} from './EndpointResult';

class EndpointExplorer extends React.Component {
  render() {
    let {dispatch} = this.props;
    let {
      currentResource,
      currentEndpoint,
      currentRequest,
      pendingRequest,
    } = this.props.state;

    let request = {
      url: this.props.baseURL + this.props.state.pendingRequest.template,
    };

    return <div className="so-back">
      <div className="so-chunk">
        <div className="EndpointExplorer">
          <div className="EndpointExplorer__picker">
            <EndpointPicker
              currentResource={currentResource}
              currentEndpoint={currentEndpoint}
              onChange={(r,e)=> dispatch(chooseEndpoint(r,e))}
              />
          </div>

          <div className="EndpointExplorer__setup">
            <EndpointSetup request={request} params={pendingRequest.params} onSubmit={() => dispatch(submitRequest(request))} />
          </div>

          <div className="EndpointExplorer__result">
            <EndpointResult {...currentRequest} />
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(chooseState)(EndpointExplorer)

function chooseState(state) {
  return {
    state: state.endpointExplorer,
    baseURL: state.network.available[state.network.current],
  };
}
