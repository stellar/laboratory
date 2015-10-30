import React from 'react';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {EndpointResult} from './EndpointResult';
import {AddressParameter} from './ParametersFormComponents/AddressParameter';

export let TransactionBuilder = React.createClass({
  render: function() {
    return <div className="TransactionBuilder">
      <div className="TransactionImport">
        <button className="s-button">Import from XDR</button>
        <div className="TransactionImport__input">
          <textarea className="TransactionImport__input__textarea" placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
        </div>
        <p className="TransactionImport__alert">The input is not valid base64 (a-zA-Z0-9+/).</p>
        <div className="s-buttonList">
          <button className="s-button">Import Transaction</button>
          <button className="s-button s-button__light">Cancel</button>
        </div>
      </div>
      <div className=""></div>
      <div className="TransactionAttributes">
        <div className="TransactionOp__config TransactionOpConfig optionsTable">
          <AddressParameter param='address' />
          <AddressParameter param='address' />
          <AddressParameter param='address' />
        </div>
      </div>
      <div className="TransactionOperations">
        <div className="TransactionOp">
          <div className="TransactionOp__meta TransactionOpMeta">
            <div className="TransactionOpMeta__order">
              <input className="TransactionOpMeta__order__input" type="text" defaultValue="1" maxLength="2" />
            </div>
            <p className="TransactionOpMeta__remove"><a href=''>remove</a></p>
          </div>
          <div className="TransactionOp__config TransactionOpConfig optionsTable">
            <AddressParameter param='address' />
            <AddressParameter param='address' />
            <hr className="optionsTable__separator" />
            <AddressParameter param='address' />
            <AddressParameter param='address' />
          </div>
        </div>
                                                        <div className="TransactionOp">
                                                          <div className="TransactionOp__meta TransactionOpMeta">
                                                            <div className="TransactionOpMeta__order">
                                                              <input className="TransactionOpMeta__order__input" type="text" defaultValue="2" maxLength="2" />
                                                            </div>
                                                            <p className="TransactionOpMeta__remove"><a href=''>remove</a></p>
                                                          </div>
                                                          <div className="TransactionOp__config TransactionOpConfig optionsTable">
                                                            <AddressParameter param='address' />
                                                            <AddressParameter param='address' />
                                                            <hr className="optionsTable__separator" />
                                                            <AddressParameter param='address' />
                                                            <AddressParameter param='address' />
                                                          </div>
                                                        </div>
                                                        <div className="TransactionOp">
                                                          <div className="TransactionOp__meta TransactionOpMeta">
                                                            <div className="TransactionOpMeta__order">
                                                              <input className="TransactionOpMeta__order__input" type="text" defaultValue="3" maxLength="2" />
                                                            </div>
                                                            <p className="TransactionOpMeta__remove"><a href=''>remove</a></p>
                                                          </div>
                                                          <div className="TransactionOp__config TransactionOpConfig optionsTable">
                                                            <AddressParameter param='address' />
                                                            <AddressParameter param='address' />
                                                            <hr className="optionsTable__separator" />
                                                            <AddressParameter param='address' />
                                                            <AddressParameter param='address' />
                                                          </div>
                                                        </div>
        <div className="TransactionOp"></div>
        <div className="TransactionOp"></div>

        <div className="TransactionOpAdd">
        Add Operation
        </div>
      </div>
      <div className="TransactionXDR"></div>
      <button className="s-button">Sign this transaction</button>
    </div>;
  }
});
