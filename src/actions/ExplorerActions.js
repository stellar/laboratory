import {AppDispatcher} from '../dispatcher/AppDispatcher';
import ExplorerConstants from '../constants/ExplorerConstants';

export class ExplorerActions {
  static resourceSelect(resourceId) {
    AppDispatcher.dispatch({
      type: ExplorerConstants.RESOURCE_SELECT,
      resourceId: resourceId
    });
  }
  static endpointSelect(resourceId, endpointId) {
    AppDispatcher.dispatch({
      type: ExplorerConstants.RESOURCE_SELECT,
      resourceId: resourceId,
      endpointId: endpointId
    });
  }
}
