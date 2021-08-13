import StellarSdk from "stellar-sdk";
import { Provider } from "react-redux";
import { store } from "config/store";
import LaboratoryChrome from "views/LaboratoryChrome";

import "styles/main.scss";

if (typeof window !== "undefined") {
  // @ts-ignore
  window.StellarSdk = StellarSdk;
}

export const App = () => (
  <Provider store={store}>
    <LaboratoryChrome />
  </Provider>
);
