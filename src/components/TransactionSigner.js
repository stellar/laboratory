import React from "react";
import { connect } from "react-redux";
import { TransactionBuilder, FeeBumpTransaction, Networks } from "stellar-sdk";
import { isConnected } from "@stellar/freighter-api";
import isUndefined from "lodash/isUndefined";
import map from "lodash/map";
import TransactionImporter from "./TransactionImporter";
import {
  importFromXdr,
  clearTransaction,
  setSecrets,
  setBIPPath,
  signWithLedger,
  signWithTrezor,
  signWithFreighter,
  signWithAlbedo,
} from "../actions/transactionSigner";
import { EasySelect } from "./EasySelect";
import OptionsTablePair from "./OptionsTable/Pair";
import SecretKeyPicker from "./FormComponents/SecretKeyPicker";
import MultiPicker from "./FormComponents/MultiPicker";
import BipPathPicker from "./FormComponents/BipPathPicker";
import { txPostLink, xdrViewer, feeBumpTxLink } from "../helpers/linkBuilder";
import HelpMark from "./HelpMark";
import clickToSelect from "../helpers/clickToSelect";
import scrollOnAnchorOpen from "../helpers/scrollOnAnchorOpen";
import extrapolateFromXdr from "../helpers/extrapolateFromXdr";
import validateTxXdr from "../helpers/validateTxXdr";
import NETWORK from "../constants/network";
import Libify from "../helpers/Libify";
import { addEventHandler } from "../helpers/metrics";
import transactionSignerMetrics from "../metricsHandlers/transactionSigner";

const { signTransaction } = Libify;

addEventHandler(transactionSignerMetrics);

class TransactionSigner extends React.Component {
  render() {
    let { dispatch, networkPassphrase } = this.props;
    let {
      xdr,
      signers,
      bipPath,
      hardwarewalletStatus,
      freighterwalletStatus,
      albedowalletStatus,
    } = this.props.state;
    let content;

    if (validateTxXdr(xdr, networkPassphrase).result !== "success") {
      content = (
        <div className="so-back">
          <div className="so-chunk">
            <div className="TxSignerImport TransactionSigner__import">
              <p className="TxSignerImport__title">
                Import a transaction envelope in XDR format:
              </p>
              <TransactionImporter
                networkPassphrase={networkPassphrase}
                onImport={(xdr) => dispatch(importFromXdr(xdr))}
              />
            </div>
          </div>
        </div>
      );
    } else {
      let walletSigs = hardwarewalletStatus.signatures;
      let result = signTransaction(xdr, signers, networkPassphrase, walletSigs);
      let transaction = TransactionBuilder.fromXDR(xdr, networkPassphrase);

      let infoTable = {
        "Signing for": (
          <pre className="so-code so-code__wrap">
            <code>{networkPassphrase}</code>
          </pre>
        ),
        "Transaction Envelope XDR": (
          <EasySelect plain={true}>
            <pre className="so-code so-code__wrap">
              <code>{xdr}</code>
            </pre>
          </EasySelect>
        ),
        "Transaction Hash": (
          <EasySelect plain={true}>
            <pre className="so-code so-code__wrap">
              <code>{transaction.hash().toString("hex")}</code>
            </pre>
          </EasySelect>
        ),
      };

      if (transaction instanceof FeeBumpTransaction) {
        infoTable = {
          ...infoTable,
          ...{
            "Fee source account": transaction.feeSource,
            "Transaction Fee (stroops)": transaction.fee,
            "Number of existing signatures": transaction.signatures.length,
            "Inner transaction hash": (
              <EasySelect plain={true}>
                <pre className="so-code so-code__wrap">
                  <code>
                    {transaction.innerTransaction.hash().toString("hex")}
                  </code>
                </pre>
              </EasySelect>
            ),
            "Inner transaction source account":
              transaction.innerTransaction.source,
            "Inner transaction sequence number":
              transaction.innerTransaction.sequence,
            "Inner transaction fee (stroops)": transaction.innerTransaction.fee,
            "Inner transaction number of operations":
              transaction.innerTransaction.operations.length,
            "Inner transaction number of existing signatures":
              transaction.innerTransaction.signatures.length,
          },
        };
      } else {
        infoTable = {
          ...infoTable,
          ...{
            "Source account": transaction.source,
            "Sequence number": transaction.sequence,
            "Transaction Fee (stroops)": transaction.fee,
            "Number of operations": transaction.operations.length,
            "Number of existing signatures": transaction.signatures.length,
          },
        };
      }

      let codeResult,
        submitLink,
        xdrLink,
        resultTitle,
        submitInstructions,
        feeBumpLink;

      const signedXdr =
        freighterwalletStatus.signedTx ||
        albedowalletStatus.signedTx ||
        result.xdr;

      if (!isUndefined(signedXdr)) {
        codeResult = (
          <pre
            className="TxSignerResult__xdr so-code so-code__wrap"
            onClick={clickToSelect}
          >
            <code>{signedXdr}</code>
          </pre>
        );
        submitLink = (
          <a
            className="s-button TxSignerResult__submit"
            href={txPostLink(signedXdr)}
            onClick={scrollOnAnchorOpen}
          >
            Submit in Transaction Submitter
          </a>
        );
        xdrLink = (
          <a
            className="s-button TxSignerResult__submit"
            href={xdrViewer(signedXdr, "TransactionEnvelope")}
            onClick={scrollOnAnchorOpen}
          >
            View in XDR Viewer
          </a>
        );
        feeBumpLink = (
          <a
            className="s-button TxSignerResult__submit"
            href={feeBumpTxLink(signedXdr)}
            onClick={scrollOnAnchorOpen}
          >
            Wrap with Fee Bump
          </a>
        );
        resultTitle = (
          <h3 className="TxSignerResult__title">Transaction signed!</h3>
        );
        submitInstructions = (
          <p className="TxSignerResult__instructions">
            Now that this transaction is signed, you can submit it to the
            network. Horizon provides an endpoint called Post Transaction that
            will relay your transaction to the network and inform you of the
            result.
          </p>
        );
      }

      let hardwarewalletMessage;
      if (hardwarewalletStatus.message) {
        let messageAlertType;
        if (hardwarewalletStatus.status === "loading") {
          messageAlertType = "s-alert--info";
        } else if (hardwarewalletStatus.status === "success") {
          messageAlertType = "s-alert--success";
        } else if (hardwarewalletStatus.status === "failure") {
          messageAlertType = "s-alert--alert";
        }

        hardwarewalletMessage = (
          <div>
            <br />
            <div
              className={`s-alert TxSignerKeys__ledgerwallet_message ${messageAlertType}`}
            >
              {" "}
              {hardwarewalletStatus.message}{" "}
            </div>
          </div>
        );
      }

      let freighterwalletMessage;
      if (freighterwalletStatus.message) {
        let messageAlertType;
        if (freighterwalletStatus.status === "loading") {
          messageAlertType = "s-alert--info";
        } else if (freighterwalletStatus.status === "success") {
          messageAlertType = "s-alert--success";
        } else if (freighterwalletStatus.status === "failure") {
          messageAlertType = "s-alert--alert";
        }

        freighterwalletMessage = (
          <div>
            <br />
            <div
              className={`s-alert TxSignerKeys__ledgerwallet_message ${messageAlertType}`}
            >
              {" "}
              {freighterwalletStatus.message}{" "}
            </div>
          </div>
        );
      }

      let albedowalletMessage;
      if (albedowalletStatus.message) {
        let messageAlertType;
        if (albedowalletStatus.status === "loading") {
          messageAlertType = "s-alert--info";
        } else if (albedowalletStatus.status === "success") {
          messageAlertType = "s-alert--success";
        } else if (albedowalletStatus.status === "failure") {
          messageAlertType = "s-alert--alert";
        }

        albedowalletMessage = (
          <div>
            <br />
            <div
              className={`s-alert TxSignerKeys__ledgerwallet_message ${messageAlertType}`}
            >
              {" "}
              {albedowalletStatus.message}{" "}
            </div>
          </div>
        );
      }

      content = (
        <div>
          <div className="so-back">
            <div className="so-chunk">
              <div className="TxSignerOverview TransactionSigner__overview">
                <div className="TxSignerOverview__titleBar">
                  <p className="TxSignerOverview__titleBar__title">
                    Transaction overview
                  </p>
                  <a
                    className="TxSignerOverview__titleBar__reset"
                    onClick={() => dispatch(clearTransaction())}
                  >
                    Clear and import new transaction
                  </a>
                </div>
                <div className="simpleTable">
                  {map(infoTable, (content, label) => {
                    return (
                      <div className="simpleTable__row" key={label}>
                        <div className="simpleTable__row__label">{label}</div>
                        <div className="simpleTable__row__content">
                          {content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="so-chunk">
              <div className="TxSignerKeys TransactionSigner__keys">
                <p className="TxSignerKeys__title">
                  Signatures{" "}
                  <HelpMark href="https://developers.stellar.org/docs/glossary/multisig/" />
                </p>
                <div className="optionsTable">
                  <OptionsTablePair label="Add Signer">
                    <MultiPicker
                      component={SecretKeyPicker}
                      value={signers}
                      onUpdate={(value) => dispatch(setSecrets(value))}
                    />
                  </OptionsTablePair>
                  <OptionsTablePair label="BIP Path">
                    <BipPathPicker
                      value={bipPath}
                      onUpdate={(value) => dispatch(setBIPPath(value))}
                    />
                    <div className="TxSignerKeys__signBipPath">
                      <button
                        className="s-button"
                        onClick={() => {
                          dispatch(
                            signWithLedger(xdr, bipPath, networkPassphrase),
                          );
                        }}
                      >
                        Sign with Ledger
                      </button>
                      <button
                        className="s-button"
                        onClick={() => {
                          dispatch(
                            signWithTrezor(xdr, bipPath, networkPassphrase),
                          );
                        }}
                      >
                        Sign with Trezor
                      </button>
                    </div>
                    <p className="optionsTable__pair__content__note">
                      NOTE: Trezor devices require upper time bounds to be set
                      (non-zero), otherwise the signature will not be verified.
                    </p>
                    {hardwarewalletMessage}
                  </OptionsTablePair>
                  {isConnected() && (
                    <OptionsTablePair label="Freighter">
                      <button
                        className="s-button"
                        onClick={() => {
                          dispatch(
                            signWithFreighter(
                              xdr,
                              networkPassphrase === Networks.TESTNET
                                ? "TESTNET"
                                : "PUBLIC",
                            ),
                          );
                        }}
                      >
                        Sign with Freighter
                      </button>
                      {freighterwalletMessage}
                    </OptionsTablePair>
                  )}
                  <OptionsTablePair label="Albedo">
                    <button
                      className="s-button"
                      onClick={() => {
                        dispatch(
                          signWithAlbedo(
                            xdr,
                            networkPassphrase === Networks.TESTNET
                              ? "TESTNET"
                              : "PUBLIC",
                          ),
                        );
                      }}
                    >
                      Sign with Albedo
                    </button>
                    {albedowalletMessage}
                  </OptionsTablePair>
                </div>
              </div>
            </div>
          </div>
          <div className="so-back TxSignerResult TransactionSigner__result">
            <div className="so-chunk">
              {resultTitle}
              <p className="TxSignerResult__summary">{result.message}</p>
              {codeResult}
              {submitInstructions}
              {submitLink} {xdrLink} {feeBumpLink}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="TransactionSigner">
        <div className="so-back">
          <div className="so-chunk">
            <div className="pageIntro">
              <p>
                The transaction signer lets you add signatures to a Stellar
                transaction. Signatures are used in the network to prove that
                the account is authorized to perform the operations in the
                transaction.
              </p>
              <p>
                For simple transactions, you only need one signature from the
                correct account. Some advanced signatures may require more than
                one signature if there are multiple source accounts or signing
                keys.
              </p>
              <p>
                <a
                  href="https://developers.stellar.org/docs/glossary/multisig/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Read more about signatures on the developer's site.
                </a>
              </p>
            </div>
          </div>
        </div>
        {content}
      </div>
    );
  }
}

export default connect(chooseState)(TransactionSigner);

function chooseState(state) {
  return {
    state: state.transactionSigner,
    networkPassphrase: state.network.current.networkPassphrase,
  };
}
