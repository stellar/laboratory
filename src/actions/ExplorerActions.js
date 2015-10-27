import {AppDispatcher} from '../dispatcher/AppDispatcher';
import ExplorerConstants from '../constants/ExplorerConstants';

export class ExplorerActions {
  static resourceSelect(resourceId) {
    AppDispatcher.dispatch({
      type: ExplorerConstants.RESOURCE_SELECT,
      resourceId: resourceId
    });
  }
  static endpointSelect(endpointId) {
    AppDispatcher.dispatch({
      type: ExplorerConstants.ENDPOINT_SELECT,
      endpointId: endpointId
    });
  }
  static networkSelect(network) {
    AppDispatcher.dispatch({
      type: ExplorerConstants.NETWORK_SELECT,
      network: network
    });
  }
  static parameterSet(key, value, error) {
    AppDispatcher.dispatch({
      type: ExplorerConstants.PARAMETER_SET,
      key: key,
      value: value,
      error: error
    });
  }
}
