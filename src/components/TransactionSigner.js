import React from 'react';
import Picker from './FormComponents/Picker';
import TransactionImporter from './TransactionImporter';

export default class TransactionSigner extends React.Component {
  render() {
    return <div className="TransactionSigner">
      <div className="so-back">
        <div className="so-chunk">
          <div className="TxSignerImport TransactionSigner__import">
            <h2 className="TxSignerImport__title">Import a transaction envelope in XDR format:</h2>
            <TransactionImporter onImport={(xdr)=>{console.log('success',xdr)}}/>
          </div>
        </div>
        <div className="so-chunk">
          <div className="TxSignerOverview TransactionSigner__overview">
            <div className="TxSignerOverview__reset">
              <button className="s-button s-button__light">Clear and start over</button>
            </div>
            <div className="TxSignerOverview__table">
              <div className="TxSignerOverview__table__row">
                <div className="TxSignerOverview__table__row__label">XDR</div>
                <div className="TxSignerOverview__table__row__content">
                  <pre className="TxSignerOverview so-code so-code__wrap"><code>
                    AAAAAAJ6JsqETD62vmfnwnunIbeHkngYuSSR622WfZmHpz9yAAAAyAAAAAAAAATTAAAAAAAAAAEAAAAGdGV3ZmRzAAAAAAACAAAAAQAAAAD5NMv6q1ZjBafbOC4BmHn5UNVYlacnl8kooX5xIOPpYgAAAAEAAAAArqW21g0d1YLqh1F/m+mzhXj5w6T0v0bHkxIwvVllnZEAAAACMjM1MjM0dwAAAAAAAAAAAAJ6JsqETD62vmfnwnunIbeHkngYuSSR622WfZmHpz9yAAAAAA9/IfAAAAAAAAAAAAAAAAACeibKhEw+tr5n58J7pyG3h5J4GLkkkettln2Zh6c/cgAAAAAAmJaAAAAAAAAAAAA=
                  </code></pre>
                </div>
              </div>
              <div className="TxSignerOverview__table__row">
                <div className="TxSignerOverview__table__row__label">Source account</div>
                <div className="TxSignerOverview__table__row__content">GAAAAAAAA</div>
              </div>
              <div className="TxSignerOverview__table__row">
                <div className="TxSignerOverview__table__row__label">Number of operations</div>
                <div className="TxSignerOverview__table__row__content">3</div>
              </div>
            </div>
          </div>
        </div>
        <div className="so-chunk">
          <div className="TxSignerKeys TransactionSigner__keys">
            <div className="TxSignerKeys__row">
              SecretKeyPicker
            </div>
            <div className="TxSignerKeys__row">
              SecretKeyPicker
            </div>
            <div className="TxSignerKeys__row">
              SecretKeyPicker
            </div>
            <div className="TxSignerKeys__row">
              SecretKeyPicker
            </div>
            <div className="TxSignerKeys__row">
              SecretKeyPicker
            </div>
          </div>
        </div>
      </div>
      <div className="so-back TxSignerResult TransactionSigner__result">
        <div className="so-chunk">
          <p className="TxSignerResult__summary">1 signature added Transaction Unmodified</p>
          <pre className="TxSignerResult__xdr so-code so-code__wrap"><code>
            AAAAAAJ6JsqETD62vmfnwnunIbeHkngYuSSR622WfZmHpz9yAAAAyAAAAAAAAATTAAAAAAAAAAEAAAAGdGV3ZmRzAAAAAAACAAAAAQAAAAD5NMv6q1ZjBafbOC4BmHn5UNVYlacnl8kooX5xIOPpYgAAAAEAAAAArqW21g0d1YLqh1F/m+mzhXj5w6T0v0bHkxIwvVllnZEAAAACMjM1MjM0dwAAAAAAAAAAAAJ6JsqETD62vmfnwnunIbeHkngYuSSR622WfZmHpz9yAAAAAA9/IfAAAAAAAAAAAAAAAAACeibKhEw+tr5n58J7pyG3h5J4GLkkkettln2Zh6c/cgAAAAAAmJaAAAAAAAAAAAA=
          </code></pre>
        </div>
      </div>
    </div>
  }
}
