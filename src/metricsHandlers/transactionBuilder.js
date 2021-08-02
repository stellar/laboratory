import debounce from "lodash/debounce";
import {
  ADD_OPERATION,
  REMOVE_OPERATION,
  UPDATE_OPERATION_TYPE,
  UPDATE_OPERATION_ATTRIBUTES,
} from "../actions/transactionBuilder";
import { logEvent } from "../utilities/metrics";
import { LOAD_STATE } from "../actions/routing";

const metricsEvents = {
  changeOperation: "transaction builder: changed operation type",
  addOperation: "transaction builder: added operation",
  removeOperation: "transaction builder: removed operation",
  updateAttributes: "transaction builder: changed operation attributes",
  signTransaction: "transaction builder: began signing transaction",
  viewTransaction: "transaction builder: view XDR",
};

// "Update attribute" events might fire in quick succession as somebody types
// information in. Aggressively debounce it to minimize duplicates.
const slowLogEvent = debounce(logEvent, 3000);

export default function networkMetrics(state, action) {
  const { type, ...payload } = action;
  switch (type) {
    case UPDATE_OPERATION_TYPE: {
      logEvent(metricsEvents.changeOperation, {
        type: payload.newType,
      });
      return;
    }
    case ADD_OPERATION: {
      logEvent(metricsEvents.addOperation);
      return;
    }
    case REMOVE_OPERATION: {
      logEvent(metricsEvents.removeOperation);
      return;
    }
    case UPDATE_OPERATION_ATTRIBUTES: {
      slowLogEvent(metricsEvents.updateAttributes, {
        changedAttributes: Object.keys(payload.newAttributes),
        operationType: (
          state.transactionBuilder.operations.find(
            (o) => o.id === payload.opId,
          ) || { name: "" }
        ).name,
      });
      return;
    }
    case LOAD_STATE: {
      const { location } = state.routing;
      // If we're on the txbuilder and loading state, we might be transitioning
      // to another feature with a complete transaction.
      if (location === "txbuilder") {
        if (payload.slug === "txsigner") {
          logEvent(metricsEvents.signTransaction, {
            operations: state.transactionBuilder.operations.map((o) => o.name),
          });
        } else if (payload.slug === "xdr-viewer") {
          logEvent(metricsEvents.viewTransaction, {
            operations: state.transactionBuilder.operations.map((o) => o.name),
          });
        }
      }
    }
  }
}
