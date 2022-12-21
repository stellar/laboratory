import { useDispatch } from "react-redux";
import StellarSdk from "stellar-sdk";
import SorobanSdk from "soroban-client";
import debounce from "lodash/debounce";
import functions from "lodash/functions";
import indexOf from "lodash/indexOf";
import { FETCHED_SIGNERS } from "constants/fetched_signers";
import { SelectPicker } from "components/FormComponents/SelectPicker";
import extrapolateFromXdr from "helpers/extrapolateFromXdr";
import { TreeView } from "components/TreeView";
import { useRedux } from "hooks/useRedux";
import { useIsSoroban } from "hooks/useIsSoroban";
import { validateBase64 } from "helpers/validateBase64";
import {
  updateXdrInput,
  updateXdrType,
  fetchLatestTx,
  fetchSigners,
} from "actions/xdrViewer";
import { addEventHandler, logEvent } from "helpers/metrics";
import xdrViewerMetrics, { metricsEvents } from "metricsHandlers/xdrViewer";
import { TransactionNode } from "types/types";

// XDR decoding doesn't happen in redux, but is pretty much the only thing on
// this page that we care about. Log metrics from the component as well.
addEventHandler(xdrViewerMetrics);

const tLogEvent = debounce(logEvent, 1000);

export const XdrViewer = () => {
  const dispatch = useDispatch();
  const { xdrViewer, network } = useRedux("xdrViewer", "network");
  const { fetchedSigners, input, type } = xdrViewer;
  const { horizonURL, networkPassphrase } = network.current;
  const isSoroban = useIsSoroban();
  const sdk = isSoroban ? SorobanSdk : StellarSdk;
  // Array of all the xdr types. Then, the most common ones appear at the top
  // again for convenience
  let xdrTypes = functions(sdk.xdr).sort();
  xdrTypes = [
    "TransactionEnvelope",
    "TransactionResult",
    "TransactionMeta",
    "---",
  ].concat(xdrTypes);
  const validation = validateBase64(input);
  const messageClass =
    validation.result === "error"
      ? "xdrInput__message__alert"
      : "xdrInput__message__success";
  const message = <p className={messageClass}>{validation.message}</p>;
  const xdrTypeIsValid = indexOf(xdrTypes, type) >= 0;

  let treeView;
  let errorMessage;

  if (input === "") {
    errorMessage = <p>Enter a base-64 encoded XDR blob to decode.</p>;
  } else if (!xdrTypeIsValid) {
    errorMessage = <p>Please select a XDR type</p>;
  } else {
    try {
      treeView = (
        <TreeView
          nodes={
            extrapolateFromXdr(input, type, isSoroban) as TransactionNode[]
          }
          fetchedSigners={fetchedSigners}
        />
      );
      tLogEvent(metricsEvents.decodeSuccess, { type });
    } catch (e) {
      console.error(e);
      tLogEvent(metricsEvents.decodeFailed, { type });
      errorMessage = <p>Unable to decode input as {type}</p>;
    }
  }

  // Fetch signers on initial load
  if (
    input !== "" &&
    type === "TransactionEnvelope" &&
    fetchedSigners.state === FETCHED_SIGNERS.NONE
  ) {
    dispatch(fetchSigners(input, horizonURL, networkPassphrase, isSoroban));
  }

  return (
    <div data-testid="page-xdr-viewer">
      <div className="XdrViewer__setup so-back">
        <div className="so-chunk">
          <div className="pageIntro">
            <p>
              <a href="https://developers.stellar.org/docs/encyclopedia/xdr">
                External Data Representation (XDR)
              </a>{" "}
              is a standardized protocol that the Stellar network uses to encode
              data.
            </p>
            <p>
              The XDR Viewer is a tool that displays contents of a Stellar XDR
              blob in a human readable format.
            </p>
          </div>
          <p className="XdrViewer__label">
            Input a base-64 encoded XDR blob, or{" "}
            <a
              onClick={() =>
                dispatch(fetchLatestTx(horizonURL, networkPassphrase))
              }
            >
              fetch the latest transaction to try it out
            </a>
            :
          </p>
          <div className="xdrInput__input">
            <textarea
              data-testid="xdr-viewer-input"
              value={input}
              className="xdrInput__input__textarea"
              onChange={(event) => {
                dispatch(updateXdrInput(event.target.value));
                if (type === "TransactionEnvelope") {
                  dispatch(
                    fetchSigners(
                      event.target.value,
                      horizonURL,
                      networkPassphrase,
                      isSoroban,
                    ),
                  );
                }
              }}
              placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."
            ></textarea>
          </div>
          <div className="xdrInput__message">{message}</div>

          <p className="XdrViewer__label">XDR type:</p>
          <SelectPicker
            value={type}
            placeholder="Select XDR type"
            onUpdate={(input: string) => dispatch(updateXdrType(input))}
            items={xdrTypes}
          />
        </div>
      </div>
      <div className="XdrViewer__results so-back">
        <div className="so-chunk" data-testid="xdr-viewer-results">
          {errorMessage}
          {treeView}
        </div>
      </div>
    </div>
  );
};
