import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { render as rtlRender } from "@testing-library/react";

import { reducers } from "config/store";

/* @testing-library/react helpers */

export const render = (
  ui: React.ReactElement,
  {
    preloadedState,
    store = createStore(reducers, applyMiddleware(thunk)),
    ...renderOptions
  }: any = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
