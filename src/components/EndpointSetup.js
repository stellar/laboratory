import _ from 'lodash';
import React from 'react';

import HelpMark from './HelpMark';
import {EasySelect} from './EasySelect';

export function EndpointSetup(props) {
  let {onSubmit, onUpdate, request, params, endpoint, values} = props;

  return <div className="so-chunk">
    <p className="EndpointSetup__title">{endpoint.label} <HelpMark href={endpoint.helpUrl}/></p>
    <div className="optionsTable">
      <endpoint.setupComponent
        onUpdate={onUpdate}
        values={values}
        />
      <hr className="optionsTable__separator" />
      <StreamingRow onUpdate={onUpdate} checked={values.streaming}/>
      <hr className="optionsTable__separator" />
      <UrlRow url={request.url} method={request.method} />
      <PostDataRow formData={request.formData} />
      <SubmitRow onSubmit={onSubmit} />
    </div>
  </div>;
}

function StreamingRow(props) {
  return <div className="optionsTable__blank EndpointSetup__streaming">
    <label>
      <input type="checkbox" className="EndpointSetup__streaming__checkbox"
        onChange={(event) => {props.onUpdate('streaming', event.target.checked)}}
        checked={props.checked}
        />
      <span className="EndpointSetup__streaming__title">Server-Sent Events (streaming) mode</span>
    </label>
  </div>;
}

function UrlRow(props) {
  return <div className="optionsTable__blank EndpointSetup__url">
    <span className="EndpointSetup__url__method">{props.method}</span>
    <span>&nbsp;</span>
    <EasySelect>{props.url}</EasySelect>
  </div>;
}

function PostDataRow({formData}) {
  if (formData === '') {
    return <div></div>
  }
  return <div className="optionsTable__blank EndpointSetup__url">
    <span>{formData}</span>
  </div>;
}

function SubmitRow(props) {
  return <div className="optionsTable__blank">
    <button className="s-button" onClick={props.onSubmit}>Submit</button>
  </div>
}
