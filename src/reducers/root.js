import {combineReducers} from 'redux';
import introSetup from './introSetup';
import endpointExplorer from './endpointExplorer';
import transactionBuilder from './transactionBuilder';
import transactionSigner from './transactionSigner';
import xdrViewer from './xdrViewer';
import network from './network';
import routing from './routing';

const rootReducer = combineReducers({
  introSetup,
  endpointExplorer,
  transactionBuilder,
  transactionSigner,
  xdrViewer,
  network,
  routing,
});

export default rootReducer;
