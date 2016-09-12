// TreeView is a recursive tree view
// It takes data from extrapolateFromXdr and formats it in a more user friendly way

import React from 'react';
import _ from 'lodash';
import {EasySelect} from './EasySelect';

// @param {array} props.nodes - Array of TreeView compatible nodes
export default class TreeView extends React.Component {
  render() {
    let {nodes, className} = this.props;
    let rootClass = 'TreeView ' + (className) ? className : '';

    let result = <div className={rootClass}>
      {_.map(Array.prototype.slice.call(nodes), (node, index) => {
        let childNodes;

        if (typeof node.nodes !== 'undefined') {
          childNodes = <div className="TreeView__child">
            <TreeView nodes={node.nodes} />
          </div>;
        }

        return <div className="TreeView__set" key={index}>
          <div className="TreeView__row" key={index + node.type}>
            <RowValue node={node} />
          </div>
          {childNodes}
        </div>
      })}
    </div>;

    return result;
  }
}

function RowValue(props) {
  let value, childNodes, separatorNeeded, separator;
  let {node} = props;

  if (typeof node.value === 'string') {
    value = String(node.value);
    separatorNeeded = true;
  } else if (typeof node.value !== 'undefined' && _.has(node.value, 'type')) {
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

  return <span><strong>{node.type}</strong>{separator}{value}</span>
}

// Types values are values that will be displayed with special formatting to
// provide for a more rich experience other than just plain text.
// "untyped" values are simply strings. They will be displayed as strings in the
// tree node.
function convertTypedValue({type, value}) {
  switch(type) {
  case 'code':
    return <EasySelect><code>{value}</code></EasySelect>;
  case 'amount':
    return <span>{value.parsed} (raw: <code>{value.raw}</code>)</span>;
  }
}
