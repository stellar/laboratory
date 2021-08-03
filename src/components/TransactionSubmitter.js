import React from "react";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import functions from "lodash/functions";
import { xdr } from "stellar-sdk";
import FETCHED_SIGNERS from "../constants/fetched_signers";
import extrapolateFromXdr from "../helpers/extrapolateFromXdr";
import TreeView from "./TreeView";
import validateBase64 from "../helpers/validateBase64";
import { updateXdrInput, fetchSigners } from "../actions/xdrViewer";
import { addEventHandler, logEvent } from "../helpers/metrics";
import xdrViewerMetrics, { metricsEvents } from "../metricsHandlers/xdrViewer";
import { TxSubmitterResult } from "./TxSubmitterResult";

// XDR decoding doesn't happen in redux, but is pretty much the only thing on
// this page that we care about. Log metrics from the component as well.
addEventHandler(xdrViewerMetrics);

const tLogEvent = debounce(logEvent, 1000);

function TransactionSubmitter(props) {
  let { dispatch, state, baseURL, networkPassphrase, horizonURL } = props;

  const { error, nodes } = React.useMemo(() => {
    if (state.input === "") {
      return {
        error: `Enter a base-64 encoded XDR blob to decode.`,
        nodes: null,
      };
    } else {
      let validation = validateBase64(state.input);
      if (validation.result === "error") {
        return {
          error: validation.message,
          nodes: null,
        };
      }
      try {
        return {
          error: null,
          nodes: extrapolateFromXdr(state.input, "TransactionEnvelope"),
        };
      } catch (e) {
        console.error(e);
        tLogEvent(metricsEvents.decodeFailed, { type: "TransactionEnvelope" });
        return {
          error: `Unable to decode input as TransactionEnvelope`,
          nodes: null,
        };
      }
    }
  }, [state.input]);

  // Fetch signers on initial load
  if (state.fetchedSigners.state === FETCHED_SIGNERS.NONE) {
    dispatch(fetchSigners(state.input, baseURL, networkPassphrase));
  }

  return (
    <div>
      <div className="XdrViewer__setup so-back">
        <div className="so-chunk">
          <p className="XdrViewer__label" style={{ marginTop: "2em" }}>
            Input a base-64 encoded TransactionEnvelope:
          </p>
          <div className="xdrInput__input">
            <textarea
              value={state.input || ""}
              className="xdrInput__input__textarea"
              onChange={(event) => {
                dispatch(updateXdrInput(event.target.value));
                dispatch(
                  fetchSigners(event.target.value, baseURL, networkPassphrase),
                );
              }}
              placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."
            ></textarea>
          </div>
        </div>
      </div>
      <TxSubmitterResult
        txXdr={state.input}
        networkPassphrase={networkPassphrase}
        horizonURL={horizonURL}
      />
      <div className="XdrViewer__submit so-back">
        <div className="so-chunk">
          {error && (
            <div className="xdrInput__message">
              <p className="xdrInput__message__alert">{error}</p>
            </div>
          )}
          {nodes && (
            <TreeView nodes={nodes} fetchedSigners={state.fetchedSigners} />
          )}
        </div>
      </div>
    </div>
  );
}

export default connect(chooseState)(TransactionSubmitter);
function chooseState(state) {
  return {
    state: state.xdrViewer,
    baseURL: state.network.current.horizonURL,
    networkPassphrase: state.network.current.networkPassphrase,
    horizonURL: state.network.current.horizonURL,
  };
}

// Array of all the xdr types. Then, the most common ones appear at the top
// again for convenience
let xdrTypes = functions(xdr).sort();
xdrTypes = [
  "TransactionEnvelope",
  "TransactionResult",
  "TransactionMeta",
  "---",
].concat(xdrTypes);
