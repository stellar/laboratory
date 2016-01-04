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
      return <LoadingPane />;
    } else if (typeof error !== 'undefined') {
      return ErrorPane(error);
    }

    return ResultPane(response);
  }
}

function LoadingPane(props) {
  return <div className="EndpointResult">
    <div className="EndpointResult__loading">Loading...</div>
  </div>
}

function ErrorPane(error) {
  let errorContent = error.status === 0 ?
    'Unable to reach Horizon server.'
    :
    JSON.stringify(error.data, null, 2);

  return <div className="EndpointResult">
    <div className='EndpointResult__error'>
      <CodeBlock code={errorContent} language="json" />
    </div>
  </div>;
}

function ResultPane(response) {
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
