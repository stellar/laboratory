import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import SelectPicker from './FormComponents/SelectPicker';
import extrapolateFromXdr from '../utilities/extrapolateFromXdr';
import TreeView from './TreeView';
import validateBase64 from '../utilities/validateBase64';
import {updateXdrInput, updateXdrType} from '../actions/xdrViewer';
import StellarSdk from 'stellar-sdk';

function XdrViewer(props) {
  let {dispatch, state} = props;

  let validation = validateBase64(state.input);
  let messageClass = validation.result === 'error' ? 'xdrInput__message__alert' : 'xdrInput__message__success';
  let message = <p className={messageClass}>{validation.message}</p>

  let xdrNodes, treeView, errorMessage;
  if (state.input === '') {
    errorMessage = <p>Enter a base-64 encoded xdr blob to decode.</p>;
  } else if (state.type === '' || !_.has(xdrTypes, state.type)) {
    errorMessage = <p>Please select a xdr type</p>;
  } else {
    try {
      xdrNodes = extrapolateFromXdr(state.input, 'TransactionEnvelope');
      treeView = <TreeView nodes={extrapolateFromXdr(state.input, state.type)} />
    } catch (e) {
      errorMessage = <p>Unable to decode xdr input as {state.type}</p>;
    }
  }

  return <div>
    <div className="XdrViewer__setup so-back">
      <div className="so-chunk">
        <p className="XdrViewer__label">Input base-64 encoded xdr blob:</p>
        <div className="xdrInput__input">
          <textarea
            value={state.input}
            className="xdrInput__input__textarea"
            onChange={(event) => dispatch(updateXdrInput(event.target.value))}
            placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
        </div>
        <div className="xdrInput__message">
          {message}
        </div>

        <p className="XdrViewer__label">Xdr type:</p>
        <SelectPicker
          value={state.type}
          onUpdate={(input) => dispatch(updateXdrType(input))}
          items={xdrTypes}
        />
      </div>
    </div>
    <div className="XdrViewer__results so-back">
      <div className="so-chunk">
        {errorMessage}
        {treeView}
      </div>
    </div>
  </div>
}

export default connect(chooseState)(XdrViewer);
function chooseState(state) {
  return {
    state: state.xdrViewer,
  }
}

// Array of all the xdr types. Then, the most common ones appear at the top
// again for convenience
let xdrTypes = _(StellarSdk.xdr).functions().sort().value();
xdrTypes = ['TransactionEnvelope', 'TransactionResult', 'TransactionMeta', '---'].concat(xdrTypes)
