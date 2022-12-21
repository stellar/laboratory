import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StrKey, MuxedAccount } from "stellar-sdk";
import OptionsTablePair from "../components/OptionsTable/Pair";
import HelpMark from "../components/HelpMark";
import TxTypePicker from "../components/FormComponents/TxTypePicker";
import PubKeyPicker from "../components/FormComponents/PubKeyPicker";
import SequencePicker from "../components/FormComponents/SequencePicker";
import StroopsPicker from "../components/FormComponents/StroopsPicker";
import MemoPicker from "../components/FormComponents/MemoPicker";
import TimeBoundsPicker from "../components/FormComponents/TimeBoundsPicker";
import NETWORK from "../constants/network";
import {
  fetchSequence,
  fetchBaseFee,
  updateTxType,
  updateFeeBumpAttribute,
} from "../actions/transactionBuilder";
import TransactionImporter from "../components/TransactionImporter";
import TX_TYPES from "../constants/transaction_types";

function TxBuilderAttributes(props) {
  let {
    onUpdate,
    attributes,
    horizonURL,
    dispatch,
    feeBumpAttributes,
    networkPassphrase,
  } = props;
  const { txType, network } = props.state;
  const [networkBaseFee, setNetworkBaseFee] = useState(attributes["baseFee"]);
  const [networkMinFee, setNetworkMinFee] = useState(attributes["minFee"]);

  useEffect(() => {
    dispatch(fetchBaseFee(horizonURL));
  }, []);

  useEffect(() => {
    setNetworkBaseFee(attributes["baseFee"]);
    setNetworkMinFee(attributes["minFee"]);
  }, [attributes["baseFee"], attributes["minFee"]]);

  return (
    <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        <OptionsTablePair
          label={
            <span>
              Transaction Type{" "}
              <HelpMark href="https://developers.stellar.org/docs/encyclopedia/fee-bump-transactions" />
            </span>
          }
        >
          <TxTypePicker
            value={txType}
            onUpdate={(value) => {
              dispatch(updateTxType(value));
            }}
          />
        </OptionsTablePair>
        {txType === TX_TYPES.REGULAR && (
          <React.Fragment>
            <OptionsTablePair
              label={
                <span>
                  Source Account{" "}
                  <HelpMark href="https://developers.stellar.org/docs/fundamentals-and-concepts/stellar-data-structures/accounts" />
                </span>
              }
            >
              <PubKeyPicker
                value={attributes["sourceAccount"]}
                onUpdate={(value) => {
                  onUpdate("sourceAccount", value);
                }}
              />
              <p className="optionsTable__pair__content__note">
                If you don't have an account yet, you can create and fund a test
                net account with the{" "}
                <a href="#account-creator">account creator</a>.
              </p>
            </OptionsTablePair>
            <OptionsTablePair
              label={
                <span>
                  Transaction Sequence Number{" "}
                  <HelpMark href="https://developers.stellar.org/docs/glossary#sequence-number" />
                </span>
              }
            >
              <SequencePicker
                value={attributes["sequence"]}
                onUpdate={(value) => {
                  onUpdate("sequence", value);
                }}
              />
              <p className="optionsTable__pair__content__note">
                The transaction sequence number is usually one higher than
                current account sequence number.
              </p>
              <SequenceFetcher />
            </OptionsTablePair>
            <OptionsTablePair
              label={
                <span>
                  Base Fee{" "}
                  <HelpMark href="https://developers.stellar.org/docs/encyclopedia/fees-surge-pricing-fee-strategies" />
                </span>
              }
            >
              <StroopsPicker
                value={attributes["fee"]}
                onUpdate={(value) => {
                  onUpdate("fee", value);
                }}
              />
              <p className="optionsTable__pair__content__note">
                The{" "}
                <a href="https://developers.stellar.org/docs/glossary#base-fee">
                  network base fee
                </a>{" "}
                is currently set to {networkBaseFee} stroops (
                {networkBaseFee / 1e7} lumens). Based on current network
                activity, we suggest setting it to {networkMinFee} stroops.
                Final transaction fee is equal to base fee times number of
                operations in this transaction.
              </p>
            </OptionsTablePair>
            <OptionsTablePair
              optional={true}
              label={
                <span>
                  Memo{" "}
                  <HelpMark href="https://developers.stellar.org/docs/encyclopedia/memos" />
                </span>
              }
            >
              <MemoPicker
                value={{
                  type: attributes.memoType,
                  content: attributes.memoContent,
                }}
                onUpdate={(value) => {
                  onUpdate("memo", value);
                }}
              />
            </OptionsTablePair>
            <OptionsTablePair
              optional={true}
              label={
                <span>
                  Time Bounds{" "}
                  <HelpMark href="https://developers.stellar.org/docs/fundamentals-and-concepts/stellar-data-structures/operations-and-transactions#time-bounds" />
                </span>
              }
            >
              <TimeBoundsPicker
                value={{
                  minTime: attributes.minTime,
                  maxTime: attributes.maxTime,
                }}
                onUpdate={(value) => {
                  onUpdate("timebounds", value);
                }}
              />
              <p className="optionsTable__pair__content__note">
                Enter{" "}
                <a
                  href="http://www.epochconverter.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  unix timestamp
                </a>{" "}
                values of time bounds when this transaction will be valid.
              </p>
              <p className="optionsTable__pair__content__note">
                For regular transactions, it is highly recommended to set{" "}
                <code>max_time</code> to get{" "}
                <a
                  href="https://github.com/stellar/stellar-core/issues/1811"
                  target="_blank"
                  rel="noreferrer"
                >
                  a final result
                </a>{" "}
                of a transaction in a defined time.
              </p>
              <p className="optionsTable__pair__content__note">
                <a
                  className="s-button"
                  onClick={() =>
                    onUpdate("timebounds", {
                      maxTime: Math.ceil(new Date().getTime() / 1000) + 5 * 60,
                    })
                  }
                >
                  Set to 5 minutes from now
                </a>
                <br />
              </p>
            </OptionsTablePair>
          </React.Fragment>
        )}
        {txType === TX_TYPES.FEE_BUMP && (
          <React.Fragment>
            <OptionsTablePair
              label={
                <span>
                  Source Account{" "}
                  <HelpMark href="https://developers.stellar.org/docs/fundamentals-and-concepts/stellar-data-structures/accounts" />
                </span>
              }
            >
              <PubKeyPicker
                value={feeBumpAttributes["sourceAccount"]}
                onUpdate={(value) => {
                  dispatch(updateFeeBumpAttribute({ sourceAccount: value }));
                }}
              />
              <p className="optionsTable__pair__content__note">
                The account responsible for paying the transaction fee.
              </p>
            </OptionsTablePair>
            <OptionsTablePair
              label={
                <span>
                  Base Fee{" "}
                  <HelpMark href="https://developers.stellar.org/docs/encyclopedia/fees-surge-pricing-fee-strategies" />
                </span>
              }
            >
              <StroopsPicker
                value={feeBumpAttributes["maxFee"]}
                onUpdate={(value) => {
                  dispatch(updateFeeBumpAttribute({ maxFee: value }));
                }}
              />
              <p className="optionsTable__pair__content__note">
                The{" "}
                <a href="https://developers.stellar.org/docs/glossary#base-fee">
                  network base fee
                </a>{" "}
                is currently set to {networkBaseFee} stroops (
                {networkBaseFee / 1e7} lumens). Based on current network
                activity, we suggest setting it to {networkMinFee} stroops.
                Final transaction fee is equal to base fee times number of
                operations in this transaction.
              </p>
            </OptionsTablePair>
            <OptionsTablePair
              label={
                <span>
                  Inner Transaction XDR{" "}
                  <HelpMark href="https://developers.stellar.org/docs/encyclopedia/fee-bump-transactions#existing-transaction-envelope-inner-transaction" />
                </span>
              }
            >
              <TransactionImporter
                value={feeBumpAttributes["innerTxXDR"]}
                networkPassphrase={networkPassphrase}
                onUpdate={(value) => {
                  dispatch(updateFeeBumpAttribute({ innerTxXDR: value }));
                }}
              />
            </OptionsTablePair>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default connect(chooseState)(TxBuilderAttributes);

class sequenceFetcherClass extends React.Component {
  render() {
    let { attributes, sequenceFetcherError } = this.props.state;
    let dispatch = this.props.dispatch;
    let horizonURL = this.props.horizonURL;
    const isMAddress = StrKey.isValidMed25519PublicKey(
      attributes.sourceAccount,
    );
    if (
      !StrKey.isValidEd25519PublicKey(attributes.sourceAccount) &&
      !isMAddress
    ) {
      return null;
    }

    let sourceAccount = attributes.sourceAccount;

    if (isMAddress) {
      const muxedAccount = new MuxedAccount.fromAddress(
        attributes.sourceAccount,
        "0",
      );
      sourceAccount = muxedAccount.baseAccount().accountId();
    }

    let sequenceErrorMessage;
    if (sequenceFetcherError.length > 0) {
      sequenceErrorMessage = (
        <span className="optionsTable__pair__content__note optionsTable__pair__content__note--alert">
          {sequenceFetcherError}
        </span>
      );
    }

    let truncatedAccountId = sourceAccount.substr(0, 10);

    return (
      <>
        {isMAddress ? (
          <p className="optionsTable__pair__content__note">
            Source account is M address, use base account’s G address to get the
            sequence number.
          </p>
        ) : null}
        {sequenceErrorMessage}
        <p className="optionsTable__pair__content__note">
          <a
            className="s-button"
            onClick={() => dispatch(fetchSequence(sourceAccount, horizonURL))}
          >
            Fetch next sequence number for account starting with "
            {truncatedAccountId}"
          </a>
          <br />
          <small>
            Fetching from: <code>{horizonURL}</code>
          </small>
          <br />
        </p>
      </>
    );
  }
}

let SequenceFetcher = connect(chooseState)(sequenceFetcherClass);
function chooseState(state) {
  return {
    state: state.transactionBuilder,
    horizonURL: state.network.current.horizonURL,
    networkPassphrase: state.network.current.networkPassphrase,
  };
}
