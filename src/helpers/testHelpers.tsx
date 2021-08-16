import { Provider } from "react-redux";
import { createStore } from "redux";
import { render as rtlRender } from "@testing-library/react";

import { reducers } from "config/store";

/* @testing-library/react helpers */

export const render = (
  ui: React.ReactElement,
  { preloadedState, store = createStore(reducers), ...renderOptions }: any = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
