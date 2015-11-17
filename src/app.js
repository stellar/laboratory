require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import rootReducer from './reducers/root';
import {PlaygroundChrome} from './components/PlaygroundChrome';

document.write('<div id="app"></div>');

let store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <PlaygroundChrome />
  </Provider>,
  document.getElementById('app')
);
