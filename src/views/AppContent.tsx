import Loadable from "react-loadable";
import { Footer } from "components/Footer";
import { Header } from "components/Header";
import { LoadingView } from "components/LoadingView";
import { MaintenanceBanner } from "components/MaintenanceBanner";
import { Navigation } from "components/Navigation";
import { NotFoundPage } from "components/NotFoundPage";
import SLUG from "constants/slug";
import { RouterListener } from "helpers/simpleRouter";
import { addEventHandler } from "helpers/metrics";
import { useRedux } from "hooks/useRedux";
import routingMetrics from "metricsHandlers/routing";
import { Introduction } from "views/Introduction";

addEventHandler(routingMetrics);

const makeAsync = (loader: any, namedExport?: string) => {
  if (namedExport) {
    return Loadable({
      loader,
      loading: LoadingView,
      render(loaded: any, props: any) {
        const Component = loaded[namedExport];
        return <Component {...props} />;
      },
    });
  }

  return Loadable({
    loader,
    loading: LoadingView,
  });
};

const AsyncAccountCreator = makeAsync(
  () => import(/* webpackChunkName: 'Creator' */ "views/AccountCreator"),
  "AccountCreator",
);
const AsyncEndpointExplorer = makeAsync(
  () => import(/* webpackChunkName: 'Explorer' */ "views/EndpointExplorer"),
  "EndpointExplorer",
);
const AsyncTransactionBuilder = makeAsync(
  () => import(/* webpackChunkName: 'Builder' */ "views/TransactionBuilder"),
);
const AsyncTransactionSigner = makeAsync(
  () => import(/* webpackChunkName: 'Signer' */ "views/TransactionSigner"),
  "TransactionSigner",
);
const AsyncXdrViewer = makeAsync(
  () => import(/* webpackChunkName: 'Viewer' */ "views/XdrViewer"),
);
const AsyncTransactionSubmitter = makeAsync(
  () =>
    import(/* webpackChunkName: 'Submitter' */ "views/TransactionSubmitter"),
);

const routeSwitch = (slug: string) => {
  switch (slug) {
    case SLUG.HOME:
      return <Introduction />;
    case SLUG.ACCOUNT_CREATOR:
      return <AsyncAccountCreator />;
    case SLUG.EXPLORER:
      return <AsyncEndpointExplorer />;
    case SLUG.TXBUILDER:
      return <AsyncTransactionBuilder />;
    case SLUG.TXSIGNER:
      return <AsyncTransactionSigner />;
    case SLUG.XDRVIEWER:
      return <AsyncXdrViewer />;
    case SLUG.TXSUBMITTER:
      return <AsyncTransactionSubmitter />;
    default:
      return (
        <NotFoundPage>
          <p>Page "{slug}" not found</p>
        </NotFoundPage>
      );
  }
};

// TODO: After MaintenanceBanner is refactored and routeSwitch is replaced with
// React Router, move contents of this file to App.tsx (useRedux hook cannot be
// used directly there).

export const AppContent = () => {
  const { routing } = useRedux("routing");

  return (
    <div>
      <MaintenanceBanner />
      <Header />
      <Navigation />
      {routeSwitch(routing.location)}
      <RouterListener />
      <Footer />
    </div>
  );
};
