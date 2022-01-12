// TreeView is a recursive tree view
// It takes data from extrapolateFromXdr and formats it in a more user friendly way

import has from "lodash/has";
import map from "lodash/map";
import { FETCHED_SIGNERS } from "constants/fetched_signers";
import { SIGNATURE } from "constants/signature";
import { TransactionNode, TransactionNodeValue } from "types/types";
import { EasySelect } from "./EasySelect";

// TODO: Move this to FetchedSigners reducer
type FetchedSignersState = {
  state: FETCHED_SIGNERS;
  data: [{ sig: any; isValid: string }];
};

interface TreeViewProps {
  className?: string;
  fetchedSigners: FetchedSignersState;
  nodes: TransactionNode[];
  parent?: string;
}

// @param {array} props.nodes - Array of TreeView compatible nodes
export const TreeView = ({
  className,
  fetchedSigners,
  nodes,
  parent,
}: TreeViewProps) => {
  let rootClass = "TreeView " + className ? className : "";

  let result = (
    <div className={rootClass}>
      {map(Array.prototype.slice.call(nodes), (node, index) => {
        let childNodes;

        let position = getPosition(node, parent);

        if (typeof node.nodes !== "undefined") {
          childNodes = (
            <div className="TreeView__child">
              <TreeView
                nodes={node.nodes}
                fetchedSigners={fetchedSigners}
                parent={position}
              />
            </div>
          );
        }

        return (
          <div className="TreeView__set" key={index}>
            <div className="TreeView__row" key={index + node.type}>
              <RowValue
                node={node}
                position={position}
                fetchedSigners={fetchedSigners}
              />
            </div>
            {childNodes}
          </div>
        );
      })}
    </div>
  );

  return result;
};

interface RowValueProps {
  node: TransactionNode;
  position: string;
  fetchedSigners: FetchedSignersState;
}

const RowValue = ({ node, position, fetchedSigners }: RowValueProps) => {
  let value, separatorNeeded, separator;

  if (typeof node.value === "string") {
    value = String(node.value);
    separatorNeeded = true;
  } else if (typeof node.value !== "undefined" && has(node.value, "type")) {
    value = convertTypedValue(node.value);
    separatorNeeded = true;
  } else {
    if (typeof node.nodes !== "undefined") {
      value = "";
    } else {
      value = <em>none</em>;
      separatorNeeded = true;
    }
  }
  if (separatorNeeded) {
    separator = ": ";
  }

  if (position.match(/^TransactionEnvelope\.(\w+\.)+signatures$/)) {
    checkSignatures(node, fetchedSigners);
    return formatSignatureCheckState(node, separator);
  }

  if (
    position.match(
      /^TransactionEnvelope\.(\w+\.)+signatures\[[0-9]+\]\.signature$/,
    )
  ) {
    return formatSignature(node, separator);
  }

  // Buffers with possible text representation
  if (
    node.value &&
    (position.match(/^TransactionEnvelope\.(\w+\.)+tx.memo.text$/) ||
      position.match(
        /^TransactionEnvelope\.(\w+\.)+tx.operations\[[0-9]+\]\.body.manageDataOp.data.*$/,
      ) ||
      position.match(
        /^TransactionEnvelope\.(\w+\.)+tx.operations\[[0-9]+\]\.body.setOptionsOp.homeDomain$/,
      ))
  ) {
    return (
      <span>
        <strong>{node.type}</strong>
        {separator}
        <code>{node.value.raw.toString()}</code> [hex: {value}]
      </span>
    );
  }

  return (
    <span>
      <strong>{node.type}</strong>
      {separator}
      {value}
    </span>
  );
};

const checkSignatures = (
  signatures: TransactionNode,
  fetchedSigners: FetchedSignersState,
) => {
  // catch fetch signature errors
  signatures.state = fetchedSigners.state;

  if (fetchedSigners.state !== FETCHED_SIGNERS.SUCCESS) {
    return;
  }

  for (var i = 0; i < signatures.nodes.length; i++) {
    const sig = signatures.nodes[i].nodes.find(
      (n: any) => n.type == "signature",
    );
    if (!sig) {
      /* eslint-disable no-continue */
      continue;
      /* eslint-enable no-continue */
    }
    const fetchedSignature = fetchedSigners.data.find((x) =>
      x.sig.equals(sig.value.raw),
    );

    let isValid = SIGNATURE.NOT_VERIFIED_YET;
    if (fetchedSignature) {
      isValid = fetchedSignature.isValid;
    }

    sig.value.isValid = isValid;
  }
};

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 7,
});

interface ConvertTypedValue {
  type: string;
  value: TransactionNodeValue;
}
// Types values are values that will be displayed with special formatting to
// provide for a more rich experience other than just plain text.
// "untyped" values are simply strings. They will be displayed as strings in the
// tree node.
const convertTypedValue = ({ type, value }: ConvertTypedValue) => {
  switch (type) {
    case "code":
      return (
        <EasySelect>
          <code>{value}</code>
        </EasySelect>
      );
    case "amount":
      return (
        <span>
          {formatter.format(value.parsed)} (raw: <code>{value.raw}</code>)
        </span>
      );
    default:
      return <></>;
  }
};

// Calculating position within xdr tree allows for awareness of location.
// This is useful for many things, for example, adding visual indicators for
// signature verification.
const getPosition = (node: TransactionNode, parent: string | undefined) => {
  let sep = ".";

  if (!parent || node.type.charAt(0) == "[") {
    sep = "";
  }

  return `${parent ? `${parent}${sep}` : ""}${node.type}`;
};

// Signatures have a special verification feature, so they require a
// richer formating with ternary based coloring based on whether the
// signature is valid for one of the signers related to the transaction
// envelope.
const formatSignature = (node: any, separator?: string) => {
  let style = { color: "black" };
  let symbol = "";
  if (node.value.isValid === SIGNATURE.INVALID) {
    style = { color: "red" };
    symbol = " ❌ ";
  } else if (node.value.isValid === SIGNATURE.VALID) {
    style = { color: "green" };
    symbol = " ✅ ";
  }
  return (
    <span style={style} data-testid="tree-view-signature">
      <strong>{node.type}</strong>
      {separator}
      {node.value.value} {symbol}
    </span>
  );
};

// Signature fetch may exist in different states so it requires
// richer formating with ternary based coloring based on whether the
// state is NONE, SUCCCESS, PENDING, FAIL or NOT_EXIST.
const formatSignatureCheckState = (
  node: TransactionNode,
  separator?: string,
) => {
  let message = <span></span>;
  switch (node.state) {
    case FETCHED_SIGNERS.SUCCESS:
      message = (
        <span style={{ fontStyle: "italic" }}> Signatures checked!</span>
      );
      break;
    case FETCHED_SIGNERS.PENDING:
      message = (
        <span style={{ fontStyle: "italic" }}> Checking signatures...</span>
      );
      break;
    case FETCHED_SIGNERS.FAIL:
      message = (
        <span style={{ color: "red" }}> Error checking signatures...</span>
      );
      break;
    case FETCHED_SIGNERS.NOT_EXIST:
      message = (
        <span style={{ color: "red" }}>
          {" "}
          Some source accounts don't exist. Are you on the right network?
        </span>
      );
      break;
  }
  return (
    <span>
      <strong>{node.type}</strong>
      {separator}
      {node.value}
      {message}
    </span>
  );
};
