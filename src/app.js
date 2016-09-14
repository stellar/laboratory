require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';

import rootReducer from './reducers/root';
import logging from './middleware/logging';
import {routerMiddleware} from './utilities/simpleRouter';
import LaboratoryChrome from './components/LaboratoryChrome';

import StellarSdk from 'stellar-sdk'

if (typeof window !== "undefined") {
  window.StellarSdk = StellarSdk;
}

document.write('<div id="app"></div>');


let createStoreWithMiddleware = applyMiddleware(
  thunk,
  routerMiddleware,
  logging
)(createStore);

let store = createStoreWithMiddleware(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <LaboratoryChrome />
  </Provider>,
  document.getElementById('app')
);
