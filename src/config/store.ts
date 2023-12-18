import { configureStore, createAction, CombinedState } from "@reduxjs/toolkit";
import { combineReducers, Action } from "redux";

import { RESET_STORE_ACTION_TYPE } from "constants/settings";
import metrics from "middleware/metrics.js";
import { routerMiddleware } from "helpers/simpleRouter.js";

import accountCreator from "reducers/accountCreator.js";
import endpointExplorer from "reducers/endpointExplorer.js";
import transactionBuilder from "reducers/transactionBuilder.js";
import transactionSigner from "reducers/transactionSigner.js";
import xdrViewer from "reducers/xdrViewer.js";
import network from "reducers/network.js";
import routing from "reducers/routing.js";

export type RootState = ReturnType<typeof store.getState>;

const loggerMiddleware =
  (storeVal: any) => (next: any) => (action: Action<any>) => {
    console.log("Dispatching: ", action.type);
    const dispatchedAction = next(action);
    console.log("NEW STATE: ", storeVal.getState());
    return dispatchedAction;
  };

export const reducers = combineReducers({
  accountCreator,
  endpointExplorer,
  transactionBuilder,
  transactionSigner,
  xdrViewer,
  network,
  routing,
});

export const resetStoreAction = createAction(RESET_STORE_ACTION_TYPE);

const rootReducer = (state: CombinedState<any>, action: Action) => {
  const newState = action.type === RESET_STORE_ACTION_TYPE ? undefined : state;
  return reducers(newState, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
    }).concat(loggerMiddleware, metrics, routerMiddleware),
});
