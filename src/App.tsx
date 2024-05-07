import * as StellarSdk from "@stellar/stellar-sdk";
import { Provider } from "react-redux";
import { store } from "config/store";
import { AppContent } from "views/AppContent";

import "styles/main.scss";

if (typeof window !== "undefined") {
  // @ts-ignore
  window.StellarSdk = StellarSdk;
}

export const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);
