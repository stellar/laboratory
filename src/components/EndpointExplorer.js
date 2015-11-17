import React from 'react';
import {chooseEndpoint} from "../actions/endpointExplorer"
import {connect} from 'react-redux';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {EndpointResult} from './EndpointResult';

class EndpointExplorer extends React.Component {
  render() {
    let {currentResource, currentEndpoint, dispatch} = this.props;

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
            <EndpointSetup />
          </div>

          <div className="EndpointExplorer__result">
            <EndpointResult />
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(chooseState)(EndpointExplorer)

function chooseState(state) {
  return state.endpointExplorer;
}
