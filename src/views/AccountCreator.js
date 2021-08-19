import React from "react";
import { connect } from "react-redux";
import MuxedKeyPicker from "components/FormComponents/MuxedKeyPicker";
import PubKeyPicker from "components/FormComponents/PubKeyPicker";
import PositiveIntPicker from "components/FormComponents/PositiveIntPicker";
import {
  generateNewKeypair,
  updateFriendbotTarget,
  startFriendbotRequest,
  generateMuxedAccount,
  updateGenerateMuxedAccountInput,
  parseMuxedAccount,
  updateParseMuxedAccountInput,
} from "actions/accountCreator";
import NETWORK from "constants/network";
import { CodeBlock } from "components/CodeBlock";
import { addEventHandler } from "helpers/metrics";
import accountCreatorMetrics from "metricsHandlers/accountCreator";

addEventHandler(accountCreatorMetrics);

const muxedAccountLabel = {
  muxedAccountBaseAddress: "Base Account G Address",
  muxedAccountId: "Muxed Account ID",
  muxedAccountAddress: "Muxed Account M Address",
};

class AccountCreator extends React.Component {
  render() {
    let { state, dispatch } = this.props;
    let keypairTable, keypairGeneratorLink, friendbotResultCodeblock;

    const IS_TESTNET = this.props.baseURL === NETWORK.available.test.horizonURL;

    if (state.keypairGeneratorResult !== null) {
      keypairTable = (
        <div className="simpleTable AccountCreator__generator__table">
          <div className="simpleTable__row">
            <div className="simpleTable__row__label">Public Key</div>
            <div data-testid="publicKey" className="simpleTable__row__content">
              {state.keypairGeneratorResult.pubKey}
            </div>
          </div>
          <div className="simpleTable__row">
            <div className="simpleTable__row__label">Secret Key</div>
            <div data-testid="secretKey" className="simpleTable__row__content">
              {state.keypairGeneratorResult.secretKey}
            </div>
          </div>
        </div>
      );
    }
    if (state.keypairGeneratorPubKey !== "" && IS_TESTNET) {
      keypairGeneratorLink = (
        <a
          onClick={() =>
            dispatch(updateFriendbotTarget(state.keypairGeneratorPubKey))
          }
        >
          Fund this account on the test network using the friendbot tool below
        </a>
      );
    }
    if (state.friendbotStatus.code) {
      friendbotResultCodeblock = (
        <CodeBlock
          className="AccountCreator__spaceTop"
          code={state.friendbotStatus.code}
          language="json"
        />
      );
    }

    let friendbotMessage;
    if (state.friendbotStatus.message) {
      let messageAlertType;
      if (state.friendbotStatus.status === "loading") {
        messageAlertType = "s-alert--info";
      } else if (state.friendbotStatus.status === "success") {
        messageAlertType = "s-alert--success";
      } else if (state.friendbotStatus.status === "failure") {
        messageAlertType = "s-alert--alert";
      }

      friendbotMessage = (
        <div
          className={`s-alert AccountCreator__friendbot__alert ${messageAlertType}`}
        >
          {state.friendbotStatus.message}
        </div>
      );
    }

    return (
      <div className="AccountCreator" data-testid="page-account-creator">
        <div className="so-back AccountCreator__section">
          <div className="so-chunk">
            <h3>Keypair generator</h3>

            <p>
              These keypairs can be used on the Stellar network where one is
              required. For example, it can be used as an account master key,
              account signer, and/or as a stellar-core node key.
            </p>

            <button
              className="s-button"
              onClick={() => {
                dispatch(generateNewKeypair());
              }}
            >
              Generate keypair
            </button>
            {keypairTable}
            {keypairGeneratorLink}
          </div>
        </div>

        {IS_TESTNET && (
          <div>
            <div className="so-back AccountCreator__separator"></div>
            <div
              className="so-back AccountCreator__section"
              data-testid="page-friendbot"
            >
              <div className="so-chunk">
                <h3>Friendbot: Fund a test network account</h3>
                <p>
                  The friendbot is a horizon API endpoint that will fund an
                  account with 10,000 lumens on the test network.
                </p>

                <PubKeyPicker
                  className="picker--spaceBottom"
                  value={state.friendbotTarget}
                  onUpdate={(accountId) => {
                    dispatch(updateFriendbotTarget(accountId));
                  }}
                  data-testid="friendbot-test-account"
                />
                <button
                  className="s-button"
                  disabled={state.friendbotTarget.length === 0}
                  onClick={() =>
                    dispatch(startFriendbotRequest(state.friendbotTarget))
                  }
                >
                  Get test network lumens
                </button>
                {friendbotMessage}
                {friendbotResultCodeblock}
              </div>
            </div>
          </div>
        )}

        <div className="so-back AccountCreator__separator"></div>
        <div
          className="so-back AccountCreator__section"
          data-testid="page-muxed-account"
        >
          <div className="so-chunk">
            <h3>Muxed Account</h3>

            <p className="AccountCreator__note--alert">
              Muxed Account types are not yet widely adopted. Don’t use in a
              production environment unless you know what you’re doing.
            </p>

            <p>
              A muxed (or multiplexed) account (defined in{" "}
              <a
                href="https://stellar.org/protocol/cap-27"
                target="_blank"
                rel="noreferrer"
              >
                CAP-27
              </a>{" "}
              and briefly{" "}
              <a
                href="https://stellar.org/protocol/sep-23"
                target="_blank"
                rel="noreferrer"
              >
                SEP-23
              </a>
              ) is one that resolves a single Stellar G...account to many
              different underlying IDs.
            </p>

            <div className="AccountCreator__spaceTop">
              <h4 className="picker--spaceBottom">
                Create Multiplexed Account
              </h4>

              <div className="picker--spaceBottom">
                <p className="AccountCreator__label">
                  {muxedAccountLabel.muxedAccountBaseAddress}:
                </p>
                <PubKeyPicker
                  value={state.muxedAccountGenerated.gAddress}
                  onUpdate={(gAddress) => {
                    dispatch(updateGenerateMuxedAccountInput({ gAddress }));
                  }}
                  data-testid="muxed-create-g-address"
                />
              </div>

              <div className="picker--spaceBottom">
                <p className="AccountCreator__label">
                  {muxedAccountLabel.muxedAccountId}:
                </p>
                <PositiveIntPicker
                  value={state.muxedAccountGenerated.mAccountId}
                  onUpdate={(mAccountId) => {
                    dispatch(updateGenerateMuxedAccountInput({ mAccountId }));
                  }}
                  data-testid="muxed-create-m-id"
                />
              </div>

              <button
                className="s-button"
                disabled={
                  !(
                    state.muxedAccountGenerated.gAddress &&
                    state.muxedAccountGenerated.mAccountId
                  )
                }
                onClick={() => {
                  dispatch(
                    generateMuxedAccount(
                      state.muxedAccountGenerated.gAddress,
                      state.muxedAccountGenerated.mAccountId,
                    ),
                  );
                }}
                data-testid="muxed-create-button"
              >
                Create
              </button>

              {state.muxedAccountGenerated.errorMessage ? (
                <p className="picker__errorMessage">
                  {state.muxedAccountGenerated.errorMessage}
                </p>
              ) : null}

              {state.muxedAccountGenerated.mAddress ? (
                <div className="simpleTable AccountCreator__generator__table">
                  <div className="simpleTable__row">
                    <div className="simpleTable__row__label">
                      {muxedAccountLabel.muxedAccountBaseAddress}
                    </div>
                    <div className="simpleTable__row__content">
                      {state.muxedAccountGenerated.gAddress}
                    </div>
                  </div>
                  <div className="simpleTable__row">
                    <div className="simpleTable__row__label">
                      {muxedAccountLabel.muxedAccountId}
                    </div>
                    <div className="simpleTable__row__content">
                      {state.muxedAccountGenerated.mAccountId}
                    </div>
                  </div>
                  <div className="simpleTable__row">
                    <div className="simpleTable__row__label">
                      {muxedAccountLabel.muxedAccountAddress}
                    </div>
                    <div className="simpleTable__row__content">
                      {state.muxedAccountGenerated.mAddress}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="AccountCreator__spaceTop">
              <h4 className="picker--spaceBottom">
                Get Muxed Account from M address
              </h4>

              <div className="picker--spaceBottom">
                <MuxedKeyPicker
                  value={state.muxedAccountParsed.mAddress}
                  onUpdate={(mAddress) => {
                    dispatch(updateParseMuxedAccountInput(mAddress));
                  }}
                  data-testid="muxed-parse-m-address"
                />
              </div>

              <button
                className="s-button"
                disabled={!state.muxedAccountParsed.mAddress}
                onClick={() => {
                  dispatch(
                    parseMuxedAccount(state.muxedAccountParsed.mAddress),
                  );
                }}
                data-testid="muxed-parse-button"
              >
                Parse
              </button>

              {state.muxedAccountParsed.errorMessage ? (
                <p className="picker__errorMessage">
                  {state.muxedAccountParsed.errorMessage}
                </p>
              ) : null}

              {state.muxedAccountParsed.gAddress &&
              state.muxedAccountParsed.mAccountId ? (
                <div className="simpleTable AccountCreator__generator__table">
                  <div className="simpleTable__row">
                    <div className="simpleTable__row__label">
                      {muxedAccountLabel.muxedAccountAddress}
                    </div>
                    <div className="simpleTable__row__content">
                      {state.muxedAccountParsed.mAddress}
                    </div>
                  </div>
                  <div className="simpleTable__row">
                    <div className="simpleTable__row__label">
                      {muxedAccountLabel.muxedAccountBaseAddress}
                    </div>
                    <div className="simpleTable__row__content">
                      {state.muxedAccountParsed.gAddress}
                    </div>
                  </div>
                  <div className="simpleTable__row">
                    <div className="simpleTable__row__label">
                      {muxedAccountLabel.muxedAccountId}
                    </div>
                    <div className="simpleTable__row__content">
                      {state.muxedAccountParsed.mAccountId}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(chooseState)(AccountCreator);
function chooseState(state) {
  return {
    state: state.accountCreator,
    baseURL: state.network.current.horizonURL,
  };
}
