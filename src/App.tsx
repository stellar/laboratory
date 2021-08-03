import StellarSdk from "stellar-sdk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import throttle from "lodash/throttle";

import rootReducer from "./reducers/root";
import logging from "./middleware/logging";
import metrics from "./middleware/metrics";
import { routerMiddleware } from "./helpers/simpleRouter";
import LaboratoryChrome from "./views/LaboratoryChrome";
import { loadState, saveState } from "./localStorage";

import "styles/main.scss";

const persistedState = loadState();

if (typeof window !== "undefined") {
  // @ts-ignore
  window.StellarSdk = StellarSdk;
}

let createStoreWithMiddleware = applyMiddleware(
  metrics,
  thunk,
  routerMiddleware,
  logging,
)(createStore);

let store = createStoreWithMiddleware(rootReducer, persistedState);

store.subscribe(
  throttle(() => {
    saveState({
      network: store.getState().network,
    });
  }, 1000),
);

export const App = () => (
  <Provider store={store}>
    <LaboratoryChrome />
  </Provider>
);
