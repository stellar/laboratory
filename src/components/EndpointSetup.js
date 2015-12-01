import _ from 'lodash';
import React from 'react';

import Picker from './FormComponents/Picker';
import {EasySelect} from './EasySelect';

export function EndpointSetup(props) {
  let {onSubmit, request} = props;

  return <div className="so-chunk">
    <div className="optionsTable">
      <hr className="optionsTable__separator" />
      <UrlRow url={request.url} />
      <SubmitRow onSubmit={onSubmit} />
    </div>
  </div>;
}

function SubmitRow(props) {
  return <div className="optionsTable__blank">
    <button className="s-button" onClick={props.onSubmit}>Submit</button>
  </div>
}

function UrlRow(props) {
  return <div className="optionsTable__blank EndpointSetup__url">
    <EasySelect>{props.url}</EasySelect>
  </div>;
}
