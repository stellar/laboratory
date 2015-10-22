require("./index.html");
require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {Explorer} from './components/Explorer';

ReactDOM.render(
  <Explorer />,
  document.getElementById('app')
);
