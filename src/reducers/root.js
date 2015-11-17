import {combineReducers} from 'redux';
import endpointExplorer from './endpointExplorer';
import network from './network';


const rootReducer = combineReducers({
  endpointExplorer,
  network,
});

export default rootReducer
