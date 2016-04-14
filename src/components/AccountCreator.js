import React from 'react';
import {connect} from 'react-redux';
import PubKeyPicker from './FormComponents/PubKeyPicker';
import {
  generateNewKeypair,
  updateFriendbotTarget,
  startFriendbotRequest,
} from '../actions/accountCreator';
import {CodeBlock} from './CodeBlock';

class AccountCreator extends React.Component {
  render() {
    let {state, dispatch} = this.props;
    let keypairTable, keypairGeneratorLink, friendbotResultCodeblock;
    if (state.keypairGeneratorResult !== null) {
      keypairTable = <div className="simpleTable AccountCreator__generator__table">
        <div className="simpleTable__row">
          <div className="simpleTable__row__label">Account ID</div>
          <div className="simpleTable__row__content">{state.keypairGeneratorResult.pubKey}</div>
        </div>
        <div className="simpleTable__row">
          <div className="simpleTable__row__label">Secret Key</div>
          <div className="simpleTable__row__content">{state.keypairGeneratorResult.secretKey}</div>
        </div>
      </div>
    }
    if (state.keypairGeneratorPubKey !== '') {
      keypairGeneratorLink = <a onClick={() => dispatch(updateFriendbotTarget(state.keypairGeneratorPubKey))}>Fund this account on the test network using the friendbot tool below</a>
    }
    if (state.friendbotStatus.code) {
      friendbotResultCodeblock = <CodeBlock className="AccountCreator__spaceTop" code={state.friendbotStatus.code} language="json" />
    }


    let friendbotMessage;
    if (state.friendbotStatus.message) {

      let messageAlertType;
      if (state.friendbotStatus.status === 'loading') {
        messageAlertType = 's-alert--info';
      } else if (state.friendbotStatus.status === 'success') {
        messageAlertType = 's-alert--success';
      } else if (state.friendbotStatus.status === 'failure') {
        messageAlertType = 's-alert--alert';
      }

      friendbotMessage = <div className={`s-alert AccountCreator__friendbot__alert ${messageAlertType}`}>
        {state.friendbotStatus.message}
      </div>
    }

    return <div className="AccountCreator">
      <div className="so-back AccountCreator__section">
        <div className="so-chunk">
          <h3>1. Keypair generator</h3>

          <p>These keypairs can be used on the Stellar network where one is required. For example, it can be used as an account master key, account signer, and/or as a stellar-core node key.</p>

          <button className="s-button" onClick={() => {dispatch(generateNewKeypair())}}>Generate keypair</button>
          {keypairTable}
          {keypairGeneratorLink}
        </div>
      </div>
      <div className="so-back AccountCreator__separator">
      </div>
      <div className="so-back AccountCreator__section">
        <div className="so-chunk">
          <h3>2. Friendbot: Fund a test network account</h3>
          <p>The friendbot is a horizon API endpoint that will fund an account with 10,000 lumens on the test network.</p>

          <PubKeyPicker
            className="picker--spaceBottom"
            value={state.friendbotTarget}
            onUpdate={(accountId) => {
              dispatch(updateFriendbotTarget(accountId))
            }} />
          <button className="s-button"
            disabled={state.friendbotTarget.length === 0}
            onClick={() => dispatch(startFriendbotRequest(state.friendbotTarget))}
            >Get test network lumens</button>
          {friendbotMessage}
          {friendbotResultCodeblock}
        </div>
      </div>
    </div>
  }
}

export default connect(chooseState)(AccountCreator);
function chooseState(state) {
  return {
    state: state.accountCreator,
  }
}
