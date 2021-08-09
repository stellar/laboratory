import * as React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { render as rtlRender } from "@testing-library/react";

import rootReducer from "../reducers/root";

/* @testing-library/react helpers */

export const render = (
  ui,
  { preloadedState, store = createStore(rootReducer), ...renderOptions } = {},
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
