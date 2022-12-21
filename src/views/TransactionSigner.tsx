import { useDispatch } from "react-redux";
import StellarSdk from "stellar-sdk";
import SorobanSdk from "soroban-client";
import { isConnected } from "@stellar/freighter-api";
import isUndefined from "lodash/isUndefined";
import map from "lodash/map";
import {
  importFromXdr,
  clearTransaction,
  setSecrets,
  setBIPPath,
  signWithLedger,
  signWithTrezor,
  signWithFreighter,
  signWithAlbedo,
} from "actions/transactionSigner";
import TransactionImporter from "components/TransactionImporter";
import { EasySelect } from "components/EasySelect";
import OptionsTablePair from "components/OptionsTable/Pair";
import SecretKeyPicker from "components/FormComponents/SecretKeyPicker";
import { MultiPicker } from "components/FormComponents/MultiPicker";
import { BipPathPicker } from "components/FormComponents/BipPathPicker";
import HelpMark from "components/HelpMark";
import { txPostLink, xdrViewer, feeBumpTxLink } from "helpers/linkBuilder";
import { useRedux } from "hooks/useRedux";
import { clickToSelect } from "helpers/clickToSelect";
import scrollOnAnchorOpen from "helpers/scrollOnAnchorOpen";
import { validateTxXdr } from "helpers/validateTxXdr";
import Libify from "helpers/Libify";
import { addEventHandler } from "helpers/metrics";
import transactionSignerMetrics from "metricsHandlers/transactionSigner";
import { useIsSoroban } from "hooks/useIsSoroban";

const { signTransaction } = Libify;

addEventHandler(transactionSignerMetrics);

export const TransactionSigner = () => {
  const dispatch = useDispatch();
  const { transactionSigner, network } = useRedux(
    "transactionSigner",
    "network",
  );
  const networkPassphrase = network.current.networkPassphrase;
  const isSoroban = useIsSoroban();

  let TransactionBuilder, FeeBumpTransaction, Networks;
  if (isSoroban) {
    TransactionBuilder = SorobanSdk.TransactionBuilder;
    FeeBumpTransaction = SorobanSdk.FeeBumpTransaction;
    Networks = SorobanSdk.Networks;
  } else {
    TransactionBuilder = StellarSdk.TransactionBuilder;
    FeeBumpTransaction = StellarSdk.FeeBumpTransaction;
    Networks = StellarSdk.Networks;
  }

  const {
    xdr,
    signers,
    bipPath,
    hardwarewalletStatus,
    freighterwalletStatus,
    albedowalletStatus,
  } = transactionSigner;
  let content;

  if (validateTxXdr(xdr, isSoroban).result !== "success") {
    content = (
      <div className="so-back">
        <div className="so-chunk">
          <div className="TxSignerImport TransactionSigner__import">
            <p className="TxSignerImport__title">
              Import a transaction envelope in XDR format:
            </p>
            <TransactionImporter
              networkPassphrase={networkPassphrase}
              onImport={(xdr: string) => dispatch(importFromXdr(xdr))}
            />
          </div>
        </div>
      </div>
    );
  } else {
    let walletSigs = hardwarewalletStatus.signatures;
    let result = signTransaction(
      xdr,
      signers,
      networkPassphrase,
      walletSigs,
      isSoroban,
    );
    let transaction = TransactionBuilder.fromXDR(xdr, networkPassphrase);

    let infoTable = {
      "Signing for": (
        <pre
          className="so-code so-code__wrap"
          data-testid="transaction-signer-network"
        >
          <code>{networkPassphrase}</code>
        </pre>
      ),
      "Transaction Envelope XDR": (
        <EasySelect plain={true}>
          <pre
            className="so-code so-code__wrap"
            data-testid="transaction-signer-xdr"
          >
            <code>{xdr}</code>
          </pre>
        </EasySelect>
      ),
      "Transaction Hash": (
        <EasySelect plain={true}>
          <pre
            className="so-code so-code__wrap"
            data-testid="transaction-signer-hash"
          >
            <code>{transaction.hash().toString("hex")}</code>
          </pre>
        </EasySelect>
      ),
    };

    if (transaction instanceof FeeBumpTransaction) {
      infoTable = {
        ...infoTable,
        ...{
          "Fee source account": (
            <span data-testid="transaction-signer-fee-source">
              {transaction.feeSource}
            </span>
          ),
          "Transaction Fee (stroops)": (
            <span data-testid="transaction-signer-transaction-fee">
              {transaction.fee}
            </span>
          ),
          "Number of existing signatures": (
            <span data-testid="transaction-signer-fee-sig-length">
              {transaction.signatures.length}
            </span>
          ),
          "Inner transaction hash": (
            <EasySelect plain={true}>
              <pre
                className="so-code so-code__wrap"
                data-testid="transaction-signer-inner-hash"
              >
                <code>
                  {transaction.innerTransaction.hash().toString("hex")}
                </code>
              </pre>
            </EasySelect>
          ),
          "Inner transaction source account": (
            <span data-testid="transaction-signer-inner-source">
              {transaction.innerTransaction.source}
            </span>
          ),
          "Inner transaction sequence number": (
            <span data-testid="transaction-signer-inner-sequence">
              {transaction.innerTransaction.sequence}
            </span>
          ),
          "Inner transaction fee (stroops)": (
            <span data-testid="transaction-signer-inner-fee">
              {transaction.innerTransaction.fee}
            </span>
          ),
          "Inner transaction number of operations": (
            <span data-testid="transaction-signer-inner-op-length">
              {transaction.innerTransaction.operations.length}
            </span>
          ),
          "Inner transaction number of existing signatures": (
            <span data-testid="transaction-signer-inner-sig-length">
              {transaction.innerTransaction.signatures.length}
            </span>
          ),
        },
      };
    } else {
      infoTable = {
        ...infoTable,
        ...{
          "Source account": (
            <span data-testid="transaction-signer-source">
              {transaction.source}
            </span>
          ),
          "Sequence number": (
            <span data-testid="transaction-signer-sequence">
              {transaction.sequence}
            </span>
          ),
          "Transaction Fee (stroops)": (
            <span data-testid="transaction-signer-fee">{transaction.fee}</span>
          ),
          "Number of operations": (
            <span data-testid="transaction-signer-op-length">
              {transaction.operations.length}
            </span>
          ),
          "Number of existing signatures": (
            <span data-testid="transaction-signer-sig-length">
              {transaction.signatures.length}
            </span>
          ),
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
          data-testid="transaction-signer-result"
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
          Now that this transaction is signed, you can submit it to the network.
          Horizon provides an endpoint called Post Transaction that will relay
          your transaction to the network and inform you of the result.
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
              <div
                className="simpleTable"
                data-testid="transaction-signer-transaction-overview"
              >
                {map(infoTable, (content, label) => {
                  return (
                    <div className="simpleTable__row" key={label}>
                      <div className="simpleTable__row__label">{label}</div>
                      <div className="simpleTable__row__content">{content}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="so-chunk">
            <div
              className="TxSignerKeys TransactionSigner__keys"
              data-testid="transaction-signer-signatures"
            >
              <p className="TxSignerKeys__title">
                Signatures{" "}
                <HelpMark href="https://developers.stellar.org/docs/encyclopedia/signatures-multisig" />
              </p>
              <div className="optionsTable">
                <OptionsTablePair label="Add Signer">
                  <MultiPicker
                    component={SecretKeyPicker}
                    value={signers}
                    onUpdate={(value: string) => dispatch(setSecrets(value))}
                  />
                </OptionsTablePair>
                <OptionsTablePair label="BIP Path">
                  <BipPathPicker
                    id="strig"
                    value={bipPath}
                    onUpdate={(value: string) => dispatch(setBIPPath(value))}
                  />
                  <div className="TxSignerKeys__signBipPath">
                    <button
                      className="s-button"
                      data-testid="transaction-signer-ledger-sign-button"
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
                      data-testid="transaction-signer-trezor-sign-button"
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
                      data-testid="transaction-signer-freighter-sign-button"
                      onClick={() => {
                        dispatch(signWithFreighter(xdr, { networkPassphrase }));
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
    <div className="TransactionSigner" data-testid="page-transaction-signer">
      <div className="so-back">
        <div className="so-chunk">
          <div className="pageIntro">
            <p>
              The transaction signer lets you add signatures to a Stellar
              transaction. Signatures are used in the network to prove that the
              account is authorized to perform the operations in the
              transaction.
            </p>
            <p>
              For simple transactions, you only need one signature from the
              correct account. Some advanced transactions may require more than
              one signature if there are multiple source accounts or signing
              keys.
            </p>
            <p>
              <a
                href="https://developers.stellar.org/docs/encyclopedia/signatures-multisig"
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
};
