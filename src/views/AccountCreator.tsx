import { useDispatch } from "react-redux";
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
import { useRedux } from "hooks/useRedux";
import accountCreatorMetrics from "metricsHandlers/accountCreator";
import { ActionStatus } from "types/types.d";

addEventHandler(accountCreatorMetrics);

const muxedAccountLabel = {
  muxedAccountBaseAddress: "Base Account G Address",
  muxedAccountId: "Muxed Account ID",
  muxedAccountAddress: "Muxed Account M Address",
};

export const AccountCreator = () => {
  const { accountCreator, network } = useRedux("accountCreator", "network");
  const {
    keypairGeneratorResult,
    keypairGeneratorPubKey,
    friendbotStatus,
    friendbotTarget,
    muxedAccountGenerated,
    muxedAccountParsed,
  } = accountCreator;
  const baseURL = network.current.horizonURL;
  const IS_TESTNET = baseURL === NETWORK.available.test.horizonURL;

  const dispatch = useDispatch();

  const renderKeypairTable = () => {
    if (keypairGeneratorResult !== null) {
      return (
        <div className="simpleTable AccountCreator__generator__table">
          <div className="simpleTable__row">
            <div className="simpleTable__row__label">Public Key</div>
            <div data-testid="publicKey" className="simpleTable__row__content">
              {keypairGeneratorResult.pubKey}
            </div>
          </div>
          <div className="simpleTable__row">
            <div className="simpleTable__row__label">Secret Key</div>
            <div data-testid="secretKey" className="simpleTable__row__content">
              {keypairGeneratorResult.secretKey}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderKeypairGeneratorLink = () => {
    if (IS_TESTNET && keypairGeneratorPubKey !== "") {
      return (
        <a
          onClick={() =>
            dispatch(updateFriendbotTarget(keypairGeneratorPubKey))
          }
        >
          Fund this account on the test network using the friendbot tool below
        </a>
      );
    }

    return null;
  };

  const renderFriendbotResultCodeblock = () => {
    if (friendbotStatus.code) {
      <CodeBlock
        className="AccountCreator__spaceTop"
        code={friendbotStatus.code}
        language="json"
      />;
    }

    return null;
  };

  const getMessageAlertType = (status: ActionStatus) => {
    switch (status) {
      case ActionStatus.LOADING:
        return "s-alert--info";
      case ActionStatus.SUCCESS:
        return "s-alert--success";
      case ActionStatus.FAILURE:
        return "s-alert--alert";
      default:
        return "";
    }
  };

  const renderFriendbotMessage = () => {
    if (friendbotStatus.message) {
      return (
        <div
          className={`s-alert AccountCreator__friendbot__alert ${getMessageAlertType(
            friendbotStatus.status,
          )}`}
        >
          {friendbotStatus.message}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="AccountCreator" data-testid="page-account-creator">
      {/* TODO: Keypair generator */}
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
          {renderKeypairTable()}
          {renderKeypairGeneratorLink()}
        </div>
      </div>

      {/* TODO: Friendbot */}
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
                value={friendbotTarget}
                onUpdate={(accountId: string) => {
                  dispatch(updateFriendbotTarget(accountId));
                }}
                data-testid="friendbot-test-account"
              />
              <button
                className="s-button"
                disabled={friendbotTarget.length === 0}
                onClick={() => dispatch(startFriendbotRequest(friendbotTarget))}
              >
                Get test network lumens
              </button>
              {renderFriendbotMessage()}
              {renderFriendbotResultCodeblock()}
            </div>
          </div>
        </div>
      )}

      {/* TODO: Muxed account */}
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
            <h4 className="picker--spaceBottom">Create Multiplexed Account</h4>

            <div className="picker--spaceBottom">
              <p className="AccountCreator__label">
                {muxedAccountLabel.muxedAccountBaseAddress}:
              </p>
              <PubKeyPicker
                value={muxedAccountGenerated.gAddress}
                onUpdate={(gAddress: string) => {
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
                value={muxedAccountGenerated.mAccountId}
                onUpdate={(mAccountId: string) => {
                  dispatch(updateGenerateMuxedAccountInput({ mAccountId }));
                }}
                data-testid="muxed-create-m-id"
              />
            </div>

            <button
              className="s-button"
              disabled={
                !(
                  muxedAccountGenerated.gAddress &&
                  muxedAccountGenerated.mAccountId
                )
              }
              onClick={() => {
                dispatch(
                  generateMuxedAccount(
                    muxedAccountGenerated.gAddress,
                    muxedAccountGenerated.mAccountId,
                  ),
                );
              }}
              data-testid="muxed-create-button"
            >
              Create
            </button>

            {muxedAccountGenerated.errorMessage ? (
              <p className="picker__errorMessage">
                {muxedAccountGenerated.errorMessage}
              </p>
            ) : null}

            {muxedAccountGenerated.mAddress ? (
              <div className="simpleTable AccountCreator__generator__table">
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">
                    {muxedAccountLabel.muxedAccountBaseAddress}
                  </div>
                  <div className="simpleTable__row__content">
                    {muxedAccountGenerated.gAddress}
                  </div>
                </div>
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">
                    {muxedAccountLabel.muxedAccountId}
                  </div>
                  <div className="simpleTable__row__content">
                    {muxedAccountGenerated.mAccountId}
                  </div>
                </div>
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">
                    {muxedAccountLabel.muxedAccountAddress}
                  </div>
                  <div className="simpleTable__row__content">
                    {muxedAccountGenerated.mAddress}
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
                value={muxedAccountParsed.mAddress}
                onUpdate={(mAddress: string) => {
                  dispatch(updateParseMuxedAccountInput(mAddress));
                }}
                data-testid="muxed-parse-m-address"
              />
            </div>

            <button
              className="s-button"
              disabled={!muxedAccountParsed.mAddress}
              onClick={() => {
                dispatch(parseMuxedAccount(muxedAccountParsed.mAddress));
              }}
              data-testid="muxed-parse-button"
            >
              Parse
            </button>

            {muxedAccountParsed.errorMessage ? (
              <p className="picker__errorMessage">
                {muxedAccountParsed.errorMessage}
              </p>
            ) : null}

            {muxedAccountParsed.gAddress && muxedAccountParsed.mAccountId ? (
              <div className="simpleTable AccountCreator__generator__table">
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">
                    {muxedAccountLabel.muxedAccountAddress}
                  </div>
                  <div className="simpleTable__row__content">
                    {muxedAccountParsed.mAddress}
                  </div>
                </div>
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">
                    {muxedAccountLabel.muxedAccountBaseAddress}
                  </div>
                  <div className="simpleTable__row__content">
                    {muxedAccountParsed.gAddress}
                  </div>
                </div>
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">
                    {muxedAccountLabel.muxedAccountId}
                  </div>
                  <div className="simpleTable__row__content">
                    {muxedAccountParsed.mAccountId}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
