import {combineReducers} from 'redux';
import accountCreator from './accountCreator';
import endpointExplorer from './endpointExplorer';
import transactionBuilder from './transactionBuilder';
import transactionSigner from './transactionSigner';
import xdrViewer from './xdrViewer';
import network from './network';
import routing from './routing';

const rootReducer = combineReducers({
  accountCreator,
  endpointExplorer,
  transactionBuilder,
  transactionSigner,
  xdrViewer,
  network,
  routing,
});

export default rootReducer;
