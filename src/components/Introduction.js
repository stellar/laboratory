import React from 'react';
import {connect} from 'react-redux';
import PubKeyPicker from './FormComponents/PubKeyPicker';
import {
  generateNewKeypair,
  updateFriendbotTarget,
  startFriendbotRequest,
} from '../actions/introSetup';
import {CodeBlock} from './CodeBlock';

class Introduction extends React.Component {
  render() {
    let {state, dispatch} = this.props;
    let keypairGeneratorCodeblock, keypairGeneratorLink, friendbotResultCodeblock;
    if (state.keypairGeneratorResult !== '') {
      keypairGeneratorCodeblock = <CodeBlock className="Introduction__spaceTop" code={state.keypairGeneratorResult} language="json" />
    }
    if (state.keypairGeneratorPubKey !== '') {
      keypairGeneratorLink = <a onClick={() => dispatch(updateFriendbotTarget(state.keypairGeneratorPubKey))}>Fill out the friendbot tool below with this public key</a>
    }
    if (state.friendbotStatus.code) {
      friendbotResultCodeblock = <CodeBlock className="Introduction__spaceTop" code={state.friendbotStatus.code} language="json" />
    }

    return <div className="Introduction">
      <div className="so-back">
        <div className="so-chunk">
          <div className="Introduction__container">
            <h2>Stellar Laboratory</h2>
            <p className="Introduction__lead">The Stellar Laboratory is a set of tools that enables people to try out and learn about the Stellar network. The laboratory can <a href="#txbuilder">build transactions</a>, <a href="#txsigner">sign them</a>, and <a href="#explorer?resource=transactions&endpoint=create">submit them to the network</a>. It can also <a href="#explorer">make requests to any of the Horizon endpoints</a>.</p>

            <p>For Stellar docs, take a look at the <a href="https://www.stellar.org/developers/">Stellar developers site</a>.</p>
          </div>
        </div>
      </div>
      <div className="so-back Introduction__section">
        <div className="so-chunk">
          <h3>Keypair generator</h3>

          <p>These keypairs can be used on the Stellar network where one is required. For example, it can be used as an account master key, account signer, and/or as a stellar-core node key.</p>

          <button className="s-button" onClick={() => {dispatch(generateNewKeypair())}}>Generate keypair</button>
          {keypairGeneratorCodeblock}
          {keypairGeneratorLink}
        </div>
      </div>
      <div className="so-back Introduction__section">
        <div className="so-chunk">
          <h3>Friendbot</h3>
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
          <p className="Introduction__spaceTop">{state.friendbotStatus.message}</p>
          {friendbotResultCodeblock}
        </div>
      </div>
    </div>
  }
}

export default connect(chooseState)(Introduction);
function chooseState(state) {
  return {
    state: state.introSetup,
  }
}
