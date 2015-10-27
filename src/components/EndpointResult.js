import React from 'react';
import {ExplorerStore} from '../stores/ExplorerStore';
import {RawJsonResponseTab} from './RawJsonResponseTab';

export let EndpointResult = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let loading = ExplorerStore.getLoadingState();
    let response = ExplorerStore.getResponse();
    return {loading, response};
  },
  onChange: function() {
    this.setState(this.getState());
  },
  componentDidMount: function() {
    ExplorerStore.addLoadingListener(this.onChange);
    ExplorerStore.addResponseListener(this.onChange);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeLoadingListener(this.onChange);
    ExplorerStore.removeResponseListener(this.onChange);
  },
  render: function() {
    // TODO
    //<div className="EndpointResult__error">
    //Unable to reach <strong>https://somewhere.over.the.rainbow/</strong>
    //</div>
    if (this.state.loading || this.state.response) {
      return <div className="EndpointResult">
        {this.state.loading ?
          <div className="EndpointResult__loading">Loading...</div>
          :
          <div>
            <div className="EndpointResult__tabs">
              <button className="EndpointResult__tabs__tab is-current">JSON Response</button>
            </div>
            <div className={this.state.response.success ? 'EndpointResult__content' : 'EndpointResult__error'}>
              <RawJsonResponseTab />
            </div>
          </div>
        }
      </div>;
    } else {
      return <div></div>;
    }
  }
});
