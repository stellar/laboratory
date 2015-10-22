require("./index.html");
require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {EndpointExplorer} from './components/EndpointExplorer';

ReactDOM.render(
  <EndpointExplorer />,
  document.getElementById('app')
);
