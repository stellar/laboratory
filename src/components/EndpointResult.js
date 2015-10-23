import React from 'react';
import {RawJsonResponseTab} from './RawJsonResponseTab';

export let EndpointResult = React.createClass({
  // getInitialState: function() {
  //   return {
  //     loading: true
  //   }
  // },
  render: function() {
    return <div className="EndpointResult">
      <div className="EndpointResult__tabs">
        <button className="EndpointResult__tabs__tab is-current">JSON Response</button>
        <button className="EndpointResult__tabs__tab">Table view (coming soon)</button>
      </div>
      <div className="EndpointResult__content">
        <RawJsonResponseTab />
      </div>
    </div>;
  }
});
