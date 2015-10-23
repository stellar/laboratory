require("./index.html");
require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {PlaygroundChrome} from './components/PlaygroundChrome';

ReactDOM.render(
  <PlaygroundChrome />,
  document.getElementById('app')
);
