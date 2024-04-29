"use client";

import { useState } from "react";
import { Alert, Card, Icon, Text, Button } from "@stellar/design-system";
import {
  TransactionBuilder,
  FeeBumpTransaction,
  Transaction,
} from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { WithInfoText } from "@/components/WithInfoText";
import { validate } from "@/validate";

import { FEE_BUMP_TX_FIELDS, TX_FIELDS } from "@/constants/signTransactionPage";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

export default function SignTransaction() {
  const { network } = useStore();
  const [txEnv, setTxEnv] = useState<string>("");
  const [isTxValid, setIsTxValid] = useState<boolean | undefined>(undefined);
  const [txErrMsg, setTxErrMsg] = useState<string>("");
  const [txSuccessMsg, setTxSuccessMsg] = useState<string>("");
  const [tx, setTx] = useState<FeeBumpTransaction | Transaction | undefined>(
    undefined,
  );

  const [signer, setSigner] = useState<string>("");
  const [signerErrorMsg, setSignerErrorMsg] = useState<string>("");

  const onChange = (value: string) => {
    setTxErrMsg("");
    setTxSuccessMsg("");
    setTxEnv(value);

    if (value.length > 0) {
      const validatedXDR = validate.xdr(value);

      if (validatedXDR.result === "success") {
        setIsTxValid(true);
        setTxSuccessMsg(validatedXDR.message);
      } else {
        setIsTxValid(false);
        setTxErrMsg(validatedXDR.message);
      }
    }
  };

  const onImport = () => {
    try {
      const transaction = TransactionBuilder.fromXDR(txEnv, network.passphrase);

      setTx(transaction);
    } catch (e) {
      setTxErrMsg("Unable to import a transaction envelope");
    }
  };

  const renderImportView = () => {
    return (
      <div className="SignTx__Overview">
        <div className="PageHeader">
          <Text size="md" as="h1" weight="medium">
            Sign Transaction
          </Text>
        </div>
        <Card>
          <div className="SignTx__xdr">
            <XdrPicker
              id="sign-transaction-xdr"
              label={
                <Text size="xs" as="span" weight="medium">
                  Import a transaction envelope in XDR format
                  <span className="SignTx__icon">
                    <Icon.AlertCircle />
                  </span>
                </Text>
              }
              value={txEnv || ""}
              error={txErrMsg}
              success={
                <Text size="xs" as="span" addlClassName="success-message">
                  {txSuccessMsg}
                </Text>
              }
              onChange={(e) => onChange(e.target.value)}
            />

            <div className="SignTx__CTA">
              <Button
                disabled={!txEnv || !isTxValid}
                size="md"
                variant={"secondary"}
                onClick={onImport}
              >
                Import transaction
              </Button>
            </div>
          </div>
        </Card>

        <Alert
          placement="inline"
          variant="primary"
          actionLink="https://developers.stellar.org/network/horizon/resources"
          actionLabel="Read more about signatures on the developer's site"
        >
          <Text size="sm" as="p">
            The transaction signer lets you add signatures to a Stellar
            transaction. Signatures are used in the network to prove that the
            account is authorized to perform the operations in the transaction.
          </Text>
          <Text size="sm" as="p">
            For simple transactions, you only need one signature from the
            correct account. Some advanced transactions may require more than
            one signature if there are multiple source accounts or signing keys.
          </Text>
        </Alert>
      </div>
    );
  };

  const renderOverviewView = () => {
    if (!tx) {
      return null;
    }

    const REQUIRED_FIELDS = [
      {
        label: "Signing for",
        value: network.passphrase,
      },
      {
        label: "Transaction Envelope XDR",
        value: txEnv,
      },
      {
        label: "Transaction Hash",
        value: tx.hash().toString("hex"),
      },
    ];

    let mergedFields;

    if (tx instanceof FeeBumpTransaction) {
      mergedFields = [...REQUIRED_FIELDS, ...FEE_BUMP_TX_FIELDS(tx)];
    } else {
      mergedFields = [...REQUIRED_FIELDS, ...TX_FIELDS(tx)];
    }

    return (
      <>
        <div className="SignTx__Overview">
          <div className="PageHeader">
            <Text size="md" as="h1" weight="medium">
              Transaction Overview
            </Text>
            <Button
              size="md"
              variant="error"
              icon={<Icon.RefreshCw01 />}
              iconPosition="right"
            >
              Clear and import new
            </Button>
          </div>

          <Card>
            <div className="SignTx__FieldViewer">
              {mergedFields.map((field) => {
                const className =
                  field.value.toString().length >=
                  MIN_LENGTH_FOR_FULL_WIDTH_FIELD
                    ? "full-width"
                    : "half-width";

                if (field.label.includes("XDR")) {
                  return (
                    <div className={className} key={field.label}>
                      <XdrPicker
                        readOnly
                        id={field.label}
                        label={field.label}
                        value={field.value.toString()}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className={className} key={field.label}>
                      <TextPicker
                        readOnly
                        id={field.label}
                        label={field.label}
                        value={field.value.toString()}
                        copyButton={{
                          position: "right",
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </Card>
        </div>
        <div className="SignTx__Signs">
          <div className="PageHeader">
            <WithInfoText href="https://developers.stellar.org/docs/learn/encyclopedia/signatures-multisig">
              <Text size="md" as="h1" weight="medium">
                Signatures
              </Text>
            </WithInfoText>
          </div>

          <Card>
            <div className="SignTx__Field">
              <div className="full-width">
                <TextPicker
                  id="signer"
                  label="Add Signer"
                  placeholder="Secret ket (starting with S) or hash preimage (in hex)"
                  onChange={(e) => {
                    setSigner(e.target.value);

                    const error = validate.secretKey(e.target.value);

                    if (error) {
                      setSignerErrorMsg(error);
                    }
                  }}
                  error={signerErrorMsg}
                  value={signer}
                />
              </div>

              <div className="full-width">
                <TextPicker
                  id="bip-path"
                  label="BIP Path"
                  placeholder="BIP path in format: 44'/148'/0'"
                  onChange={(e) => {
                    setSigner(e.target.value);

                    const error = validate.secretKey(e.target.value);

                    if (error) {
                      setSignerErrorMsg(error);
                    }
                  }}
                  error={signerErrorMsg}
                  value={signer}
                  note="Note: Trezor devices require upper time bounds to be set (non-zero), otherwise the signature will not be verified"
                />
              </div>

              <div className="SignTx__Buttons">
                <div>
                  <Button
                    // disabled={isLoading || isFetching}
                    size="md"
                    variant="secondary"
                    // onClick={}
                  >
                    Sign with secret key
                  </Button>

                  <Button
                    // disabled={isLoading || isFetching}
                    size="md"
                    variant="secondary"
                    // onClick={}
                  >
                    Sign with wallet and submit
                  </Button>
                </div>
                <div>
                  <Button
                    // disabled={isLoading || isFetching}
                    size="md"
                    variant="tertiary"
                    // onClick={}
                  >
                    Add signature
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  };

  return (
    <div className="SignTx">
      {isTxValid && tx ? renderOverviewView() : renderImportView()}
    </div>
  );
}
