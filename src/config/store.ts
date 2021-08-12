import { configureStore, createAction, CombinedState } from "@reduxjs/toolkit";
import { combineReducers, Action } from "redux";

import { RESET_STORE_ACTION_TYPE } from "constants/settings";
import metrics from "middleware/metrics";
import { routerMiddleware } from "helpers/simpleRouter";

import accountCreator from "reducers/accountCreator";
import endpointExplorer from "reducers/endpointExplorer";
import transactionBuilder from "reducers/transactionBuilder";
import transactionSigner from "reducers/transactionSigner";
import xdrViewer from "reducers/xdrViewer";
import network from "reducers/network";
import routing from "reducers/routing";

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
