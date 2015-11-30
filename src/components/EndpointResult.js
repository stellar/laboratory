import React from 'react';
import {any} from 'lodash'
import {CodeBlock} from './CodeBlock';


export class EndpointResult extends React.Component {
  render() {
    let {isLoading, error, response} = this.props;

    if (!any([isLoading, error, response])) {
      return null;
    }

    if (isLoading) {
      return <Loading />;
    }

    return <div className="EndpointResult">
      <div>
        <div className="EndpointResult__tabs">
          <button className="EndpointResult__tabs__tab is-current">JSON Response</button>
        </div>
        <div className='EndpointResult__content'>
          <CodeBlock code={JSON.stringify(response.data, null, 2)} language="json" />
        </div>
      </div>
    </div>;
  }
}

let Loading = (props) => {
  return <div className="EndpointResult">
    <div className="EndpointResult__loading">Loading...</div>
  </div>
}
