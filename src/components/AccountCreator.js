import React from 'react';
import {connect} from 'react-redux';
import PubKeyPicker from './FormComponents/PubKeyPicker';
import PositiveIntPicker from "./FormComponents/PositiveIntPicker"
import {
  generateNewKeypair,
  updateFriendbotTarget,
  startFriendbotRequest,
  generateMuxedAccount,
  updateGenerateMuxedAccountInput
} from '../actions/accountCreator';
import NETWORK from '../constants/network';
import {CodeBlock} from './CodeBlock';
import {addEventHandler} from '../utilities/metrics'
import accountCreatorMetrics from '../metricsHandlers/accountCreator'

addEventHandler(accountCreatorMetrics)

class AccountCreator extends React.Component {
  render() {
    let {state, dispatch} = this.props;
    let keypairTable, keypairGeneratorLink, friendbotResultCodeblock;

    const IS_TESTNET = this.props.baseURL === NETWORK.available.test.horizonURL;

    if (state.keypairGeneratorResult !== null) {
      keypairTable = <div className="simpleTable AccountCreator__generator__table">
        <div className="simpleTable__row">
          <div className="simpleTable__row__label">Public Key</div>
          <div className="simpleTable__row__content">{state.keypairGeneratorResult.pubKey}</div>
        </div>
        <div className="simpleTable__row">
          <div className="simpleTable__row__label">Secret Key</div>
          <div className="simpleTable__row__content">{state.keypairGeneratorResult.secretKey}</div>
        </div>
      </div>
    }
    if (state.keypairGeneratorPubKey !== '' && IS_TESTNET) {
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

      {IS_TESTNET && (
        <div>
          <div className="so-back AccountCreator__separator"></div>
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
      )}

      <div className="so-back AccountCreator__separator"></div>
      <div className="so-back AccountCreator__section">
        <div className="so-chunk">
          <h3>Muxed Accounts (experimental)</h3>
          <p>A muxed (or multiplexed) account (defined in <a href="https://stellar.org/protocol/cap-27" target="_blank" rel="noreferrer">CAP-27</a> and briefly <a href="https://stellar.org/protocol/sep-23" target="_blank" rel="noreferrer">SEP-23</a>) is one that resolves a single Stellar G...account to many different underlying IDs.</p>

          <h4 className="picker--spaceBottom">Create muxed account</h4>

          <div className="picker--spaceBottom">
            <p className="AccountCreator__label">Base account public address:</p>
            <PubKeyPicker
              value={state.muxedAccountGenerated.gAddress}
              onUpdate={(gAddress) => {
                dispatch(updateGenerateMuxedAccountInput({ gAddress }))
              }} />
          </div>

          <div className="picker--spaceBottom">
            <p className="AccountCreator__label">Muxed account ID:</p>
            <PositiveIntPicker
              value={state.muxedAccountGenerated.mAccountId}
              onUpdate={(mAccountId) => {
                dispatch(updateGenerateMuxedAccountInput({ mAccountId }))
              }} />
          </div>

          <button className="s-button" disabled={!(state.muxedAccountGenerated.gAddress && state.muxedAccountGenerated.mAccountId)} onClick={() => {dispatch(
            generateMuxedAccount(
              state.muxedAccountGenerated.gAddress,
              state.muxedAccountGenerated.mAccountId,
              this.props.baseURL,
            ))}}>Create</button>

          {state.muxedAccountGenerated.errorMessage ? <p className="picker__errorMessage">{state.muxedAccountGenerated.errorMessage}</p> : null}

          {state.muxedAccountGenerated.mAddress ? <div className="simpleTable AccountCreator__generator__table">
            <div className="simpleTable__row">
              <div className="simpleTable__row__label">Base account public address</div>
              <div className="simpleTable__row__content">{state.muxedAccountGenerated.gAddress}</div>
            </div>
            <div className="simpleTable__row">
              <div className="simpleTable__row__label">Muxed account ID</div>
              <div className="simpleTable__row__content">{state.muxedAccountGenerated.mAccountId}</div>
            </div>
            <div className="simpleTable__row">
              <div className="simpleTable__row__label">Muxed account address</div>
              <div className="simpleTable__row__content">{state.muxedAccountGenerated.mAddress}</div>
            </div>
          </div> : null }
        </div>
      </div>
    </div>
  }
}

export default connect(chooseState)(AccountCreator);
function chooseState(state) {
  return {
    state: state.accountCreator,
    baseURL: state.network.current.horizonURL,
  }
}
