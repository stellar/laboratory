require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';

import rootReducer from './reducers/root';
import logging from "./middleware/logging";
import {PlaygroundChrome} from './components/PlaygroundChrome';



document.write('<div id="app"></div>');


let createStoreWithMiddleware = applyMiddleware(
  thunk,
  logging,
)(createStore);

let store = createStoreWithMiddleware(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <PlaygroundChrome />
  </Provider>,
  document.getElementById('app')
);
