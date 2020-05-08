// TreeView is a recursive tree view
// It takes data from extrapolateFromXdr and formats it in a more user friendly way

import React from 'react';
import has from 'lodash/has';
import map from 'lodash/map';
import {EasySelect} from './EasySelect';
import SIGNATURE from '../constants/signature';
import FETCHED_SIGNERS from '../constants/fetched_signers';

// @param {array} props.nodes - Array of TreeView compatible nodes
export default class TreeView extends React.Component {
  render() {
    let {nodes, className, fetchedSigners, parent} = this.props;
    let rootClass = 'TreeView ' + (className) ? className : '';

    let result = <div className={rootClass}>
      {map(Array.prototype.slice.call(nodes), (node, index) => {
        let childNodes;

        let position = getPosition(node, parent);

        if (typeof node.nodes !== 'undefined') {
          childNodes = <div className="TreeView__child">
           <TreeView nodes={node.nodes} fetchedSigners={fetchedSigners} parent={position} />
          </div>;
        }

        return <div className="TreeView__set" key={index}>
          <div className="TreeView__row" key={index + node.type}>
            <RowValue node={node} position={position} fetchedSigners={fetchedSigners} />
          </div>
          {childNodes}
        </div>
      })}
    </div>;

    return result;
  }
}

function RowValue(props) {
  let value, separatorNeeded, separator;
  let {node, position, fetchedSigners} = props;

  if (typeof node.value === 'string') {
    value = String(node.value);
    separatorNeeded = true;
  } else if (typeof node.value !== 'undefined' && has(node.value, 'type')) {
    value = convertTypedValue(node.value);
    separatorNeeded = true;
  } else {
    if (typeof node.nodes !== 'undefined') {
      value = '';
    } else {
      value = <em>none</em>;
      separatorNeeded = true;
    }
  }
  if (separatorNeeded) {
    separator = ': ';
  }

  if (position.match(/^TransactionEnvelope\.(\w+\.)+signatures$/)) {
    checkSignatures(node, fetchedSigners);
    return formatSignatureCheckState(node, separator)
  }

  if (position.match(/^TransactionEnvelope\.(\w+\.)+signatures\[[0-9]+\]\.signature$/)) {
    return formatSignature(node, separator);
  }

  // Buffers with possible text representation
  if (node.value &&
    (position.match(/^TransactionEnvelope\.(\w+\.)+tx.memo.text$/) ||
     position.match(/^TransactionEnvelope\.(\w+\.)+tx.operations\[[0-9]+\]\.body.manageDataOp.data.*$/) ||
     position.match(/^TransactionEnvelope\.(\w+\.)+tx.operations\[[0-9]+\]\.body.setOptionsOp.homeDomain$/)
    )) {
    return <span>
      <strong>{node.type}</strong>{separator}<code>{node.value.raw.toString()}</code> [hex: {value}]
    </span>
  }

  return <span><strong>{node.type}</strong>{separator}{value}</span>
}

function checkSignatures(signatures, fetchedSigners) {
  // catch fetch signature errors
  signatures.state = fetchedSigners.state;

  if (fetchedSigners.state !== FETCHED_SIGNERS.SUCCESS) {
    return;
  }

  for (var i = 0; i < signatures.nodes.length; i ++) {
    const sig = signatures.nodes[i].nodes.find(n => n.type == 'signature');
    const fetchedSignature = fetchedSigners.data.find(x => x.sig.equals(sig.value.raw));

    let isValid = SIGNATURE.NOT_VERIFIED_YET;
    if (fetchedSignature) {
      isValid = fetchedSignature.isValid;
    }

    sig.value.isValid = isValid;
  }
}

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 7,
});
// Types values are values that will be displayed with special formatting to
// provide for a more rich experience other than just plain text.
// "untyped" values are simply strings. They will be displayed as strings in the
// tree node.
function convertTypedValue({type, value}) {
  switch(type) {
  case 'code':
    return <EasySelect><code>{value}</code></EasySelect>;
  case 'amount':
    return <span>{formatter.format(value.parsed)} (raw: <code>{value.raw}</code>)</span>;
  }
}

// Calculating position within xdr tree allows for awareness of location.
// This is useful for many things, for example, adding visual indicators for
// signature verification.
function getPosition(node, parent) {
  let sep = '.';

  if (!parent || node.type.charAt(0) == '[') {
    sep = '';
  }

  return (parent ? parent + sep : '') + node.type;
}

// Signatures have a special verification feature, so they require a
// richer formating with ternary based coloring based on whether the
// signature is valid for one of the signers related to the transaction
// envelope.
function formatSignature(node, separator) {
  let style = {color: "black"};
  let symbol = '';
  if (node.value.isValid === SIGNATURE.INVALID) {
    style = {color: "red"};
    symbol = ' ❌ ';
  } else if (node.value.isValid === SIGNATURE.VALID) {
    style = {color: "green"};
    symbol = ' ✅ ';
  }
  return <span style={style}><strong>{node.type}</strong>{separator}{node.value.value} {symbol}</span>
}

// Signature fetch may exist in different states so it requires
// richer formating with ternary based coloring based on whether the
// state is NONE, SUCCCESS, PENDING, FAIL or NOT_EXIST.
function formatSignatureCheckState(node, separator) {
  let message = "";
  switch (node.state) {
    case FETCHED_SIGNERS.SUCCESS:
      message = <span style={{fontStyle: "italic"}}> Signatures checked!</span>;
      break;
    case FETCHED_SIGNERS.PENDING:
      message = <span style={{fontStyle: "italic"}}> Checking signatures...</span>;
      break;
    case FETCHED_SIGNERS.FAIL:
      message = <span style={{color: "red"}}> Error checking signatures...</span>;
      break;
    case FETCHED_SIGNERS.NOT_EXIST:
      message = <span style={{color: "red"}}> Some source accounts does not exist...</span>;
      break;
  }
  return <span><strong>{node.type}</strong>{separator}{node.value}{message}</span>;
}
