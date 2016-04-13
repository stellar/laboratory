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
    let keypairGeneratorCodeblock, keypairGeneratorLink, friendbotResultCodeblock;
    if (state.keypairGeneratorResult !== '') {
      keypairGeneratorCodeblock = <CodeBlock className="AccountCreator__spaceTop" code={state.keypairGeneratorResult} language="json" />
    }
    if (state.keypairGeneratorPubKey !== '') {
      keypairGeneratorLink = <a onClick={() => dispatch(updateFriendbotTarget(state.keypairGeneratorPubKey))}>Fill out the friendbot tool below with this public key</a>
    }
    if (state.friendbotStatus.code) {
      friendbotResultCodeblock = <CodeBlock className="AccountCreator__spaceTop" code={state.friendbotStatus.code} language="json" />
    }

    return <div className="AccountCreator">
      <div className="so-back AccountCreator__section">
        <div className="so-chunk">
          <h3>Keypair generator</h3>

          <p>These keypairs can be used on the Stellar network where one is required. For example, it can be used as an account master key, account signer, and/or as a stellar-core node key.</p>

          <button className="s-button" onClick={() => {dispatch(generateNewKeypair())}}>Generate keypair</button>
          {keypairGeneratorCodeblock}
          {keypairGeneratorLink}
        </div>
      </div>
      <div className="so-back AccountCreator__separator">
      </div>
      <div className="so-back AccountCreator__section">
        <div className="so-chunk">
          <h3>Friendbot: Fund a test network account</h3>
          <p>The friendbot is a horizon API endpoint that will fund an account with 10,000 lumens on the test network.</p>

          <PubKeyPicker
            className="picker--spaceBottom"
            value={state.friendbotTarget}
            onUpdate={(accountId) => {
              dispatch(updateFriendbotTarget(accountId))
            }} />
          <button className="s-button"
            onClick={() => dispatch(startFriendbotRequest(state.friendbotTarget))}
          >Get test network lumens</button>
          <p className="AccountCreator__spaceTop">{state.friendbotStatus.message}</p>
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
