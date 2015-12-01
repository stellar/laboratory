import _ from 'lodash';
import React from 'react';

import Picker from './FormComponents/Picker';
import {EasySelect} from './EasySelect';

export function EndpointSetup(props) {
  let {onSubmit, request, params} = props;
  console.log(params)

  return <div className="so-chunk">
    <div className="optionsTable">
      {
      /*
        TODO: Currently can't be moved out due to a limitation of how the CSS
        expects the dom to be. When restyling, refactor this block to a function
      */
      _.map(params, (param) => {
        console.log(param);
        return Picker({
          type: param.type,
          onUpdate: (type, results, complete) => {
            console.log('Picker updated ',type, results, complete)
          },
          required: param.required,
          label: param.label,
          forceDirty: false,
        });
      })
      }
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
