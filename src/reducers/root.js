import {combineReducers} from 'redux';
import endpointExplorer from './endpointExplorer';
import transactionBuilder from './transactionBuilder';
import transactionSigner from './transactionSigner';
import network from './network';
import routing from './routing';

const rootReducer = combineReducers({
  endpointExplorer,
  transactionBuilder,
  transactionSigner,
  network,
  routing,
});

export default rootReducer;
