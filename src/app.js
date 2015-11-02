require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {PlaygroundChrome} from './components/PlaygroundChrome';

document.write('<div id="app"></div>');

ReactDOM.render(
  <PlaygroundChrome />,
  document.getElementById('app')
);
