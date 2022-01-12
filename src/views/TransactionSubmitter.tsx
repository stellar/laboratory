import { useMemo } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import { FETCHED_SIGNERS } from "constants/fetched_signers";
import extrapolateFromXdr from "helpers/extrapolateFromXdr";
import { validateBase64 } from "helpers/validateBase64";
import { addEventHandler, logEvent } from "helpers/metrics";
import { useRedux } from "hooks/useRedux";
import xdrViewerMetrics, { metricsEvents } from "metricsHandlers/xdrViewer";
import { TreeView } from "components/TreeView";
import { TxSubmitterResult } from "components/TxSubmitterResult";
import { updateXdrInput, fetchSigners } from "actions/xdrViewer";
import { TransactionNode } from "types/types";

// XDR decoding doesn't happen in redux, but is pretty much the only thing on
// this page that we care about. Log metrics from the component as well.
addEventHandler(xdrViewerMetrics);

const tLogEvent = debounce(logEvent, 1000);

export const TransactionSubmitter = () => {
  const dispatch = useDispatch();
  const { xdrViewer, network } = useRedux("xdrViewer", "network");
  const { fetchedSigners, input } = xdrViewer;
  const { horizonURL, networkPassphrase } = network.current;
  const { error, nodes } = useMemo(() => {
    if (input === "") {
      return {
        error: `Enter a base-64 encoded XDR blob to decode.`,
        nodes: null,
      };
    } else {
      let validation = validateBase64(input);
      if (validation.result === "error") {
        return {
          error: validation.message,
          nodes: null,
        };
      }
      try {
        return {
          error: null,
          nodes: extrapolateFromXdr(input, "TransactionEnvelope"),
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
  }, [input]);

  // Fetch signers on initial load
  if (fetchedSigners.state === FETCHED_SIGNERS.NONE) {
    dispatch(fetchSigners(input, horizonURL, networkPassphrase));
  }

  return (
    <div data-testid="page-transaction-submitter">
      <div className="XdrViewer__setup so-back">
        <div className="so-chunk">
          <p className="XdrViewer__label" style={{ marginTop: "2em" }}>
            Input a base-64 encoded TransactionEnvelope:
          </p>
          <div className="xdrInput__input">
            <textarea
              value={input || ""}
              className="xdrInput__input__textarea"
              data-testid="transaction-submitter-input"
              onChange={(event) => {
                dispatch(updateXdrInput(event.target.value));
                dispatch(
                  fetchSigners(
                    event.target.value,
                    horizonURL,
                    networkPassphrase,
                  ),
                );
              }}
              placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."
            ></textarea>
          </div>
        </div>
      </div>
      <TxSubmitterResult
        txXdr={input}
        networkPassphrase={networkPassphrase}
        horizonURL={horizonURL}
      />
      <div className="XdrViewer__submit so-back">
        <div className="so-chunk">
          {error && (
            <div className="xdrInput__message">
              <p
                className="xdrInput__message__alert"
                data-testid="transaction-submitter-alert"
              >
                {error}
              </p>
            </div>
          )}
          {nodes && (
            <TreeView
              nodes={nodes as TransactionNode[]}
              fetchedSigners={fetchedSigners}
            />
          )}
        </div>
      </div>
    </div>
  );
};
