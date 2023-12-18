import { useDispatch } from "react-redux";
import {
  generateMuxedAccount,
  updateGenerateMuxedAccountInput,
  parseMuxedAccount,
  updateParseMuxedAccountInput,
} from "actions/accountCreator.js";
import MuxedKeyPicker from "components/FormComponents/MuxedKeyPicker";
import PubKeyPicker from "components/FormComponents/PubKeyPicker";
import PositiveIntPicker from "components/FormComponents/PositiveIntPicker.js";
import { useRedux } from "hooks/useRedux";

const muxedAccountLabel = {
  muxedAccountBaseAddress: "Base Account G Address",
  muxedAccountId: "Muxed Account ID",
  muxedAccountAddress: "Muxed Account M Address",
};

export const MuxedAccount = () => {
  const { accountCreator } = useRedux("accountCreator");
  const { muxedAccountGenerated, muxedAccountParsed } = accountCreator;

  const dispatch = useDispatch();

  return (
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
          ) is one that resolves a single Stellar G...account to many different
          underlying IDs.
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
  );
};
