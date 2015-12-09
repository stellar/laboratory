import {combineReducers} from 'redux';
import endpointExplorer from './endpointExplorer';
import transactionBuilder from './transactionBuilder';
import network from './network';

const rootReducer = combineReducers({
  endpointExplorer,
  transactionBuilder,
  network,
});

export default rootReducer;
