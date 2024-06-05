"use client";

import { useEffect, useState } from "react";
import { Card, Icon, Text, Button } from "@stellar/design-system";
import {
  FeeBumpTransaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

import { FEE_BUMP_TX_FIELDS, TX_FIELDS } from "@/constants/signTransactionPage";

import { useStore } from "@/store/useStore";

import { transactionSigner } from "@/helpers/transactionSigner";

import { validate } from "@/validate";

import { Box } from "@/components/layout/Box";
import { MultiPicker } from "@/components/FormElements/MultiPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { WithInfoText } from "@/components/WithInfoText";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { XdrPicker } from "@/components/FormElements/XdrPicker";

import { SignWithWallet } from "./SignWithWallet";
import { SignWithLedger } from "./SignWithLedger";
import { SignWithTrezor } from "./SignWithTrezor";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

export const Overview = () => {
  const { network, transaction } = useStore();
  const {
    sign,
    updateSignActiveView,
    updateSignImportTx,
    updateSignedTx,
    updateBipPath,
    resetSign,
  } = transaction;

  const [secretInputs, setSecretInputs] = useState<string[]>([""]);

  // Adding hardware wallets sig (signatures) related
  const [bipPathErrorMsg, setBipPathErrorMsg] = useState<string>("");
  const [hardwareSigSuccess, setHardwareSigSuccess] = useState<boolean>(false);
  const [hardwareSigErrorMsg, setHardwareSigErrorMsg] = useState<string>("");

  // Sign tx status related
  const [signedTxSuccessMsg, setSignedTxSuccessMsg] = useState<string>("");
  const [signedTxErrorMsg, setSignedTxErrorMsg] = useState<string>("");
  const [signError, setSignError] = useState<string>("");

  const HAS_SECRET_KEYS = secretInputs.some((input) => input !== "");
  const HAS_INVALID_SECRET_KEYS = secretInputs.some((input) =>
    validate.secretKey(input),
  );

  useEffect(() => {
    if (!sign.importTx) {
      if (sign.importXdr) {
        // used to persist page data when accessed by query string
        const transaction = TransactionBuilder.fromXDR(
          sign.importXdr,
          network.passphrase,
        );

        updateSignImportTx(transaction);
      } else {
        updateSignActiveView("import");
      }
    }
  }, [
    network.passphrase,
    sign.importTx,
    sign.importXdr,
    updateSignActiveView,
    updateSignImportTx,
  ]);

  const onUpdateSecretInputs = (val: string[]) => {
    setSecretInputs(val);
    updateSignedTx("");
  };

  const addSignature = () => {
    setSecretInputs([...secretInputs, ""]);
  };

  const signTransaction = (
    txXdr: string,
    signers: string[],
    networkPassphrase: string,
    hardWalletSigners?: xdr.DecoratedSignature[],
  ) => {
    const { xdr, message } = transactionSigner.signTx({
      txXdr,
      signers,
      networkPassphrase,
      hardWalletSigners,
    });

    if (xdr && message) {
      updateSignedTx(xdr);
      setSignedTxSuccessMsg(message);
    } else if (!xdr && message) {
      setSignedTxErrorMsg(message);
    }
  };

  const REQUIRED_FIELDS = [
    {
      label: "Signing for",
      value: network.passphrase,
    },
    {
      label: "Transaction Envelope XDR",
      value: sign.importXdr,
    },
    {
      label: "Transaction Hash",
      value: sign.importTx?.hash().toString("hex"),
    },
  ];

  let mergedFields;

  if (sign.importTx instanceof FeeBumpTransaction) {
    mergedFields = [...REQUIRED_FIELDS, ...FEE_BUMP_TX_FIELDS(sign.importTx)];
  } else if (sign.importTx) {
    mergedFields = [...REQUIRED_FIELDS, ...TX_FIELDS(sign.importTx)];
  }

  return (
    <>
      <Box gap="md">
        <div className="PageHeader">
          <Text size="md" as="h1" weight="medium">
            Transaction Overview
          </Text>

          <Button
            size="md"
            variant="error"
            icon={<Icon.RefreshCw01 />}
            iconPosition="right"
            onClick={() => {
              resetSign();
            }}
          >
            Clear and import new
          </Button>
        </div>

        <Card>
          <div className="SignTx__FieldViewer">
            {mergedFields?.map((field) => {
              const className =
                field.value &&
                field.value.toString().length >= MIN_LENGTH_FOR_FULL_WIDTH_FIELD
                  ? "full-width"
                  : "half-width";

              if (field.label.includes("XDR")) {
                return (
                  <div className={className} key={field.label}>
                    <XdrPicker
                      readOnly
                      id={field.label}
                      label={field.label}
                      value={field.value ? field.value.toString() : ""}
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
                      value={field.value ? field.value.toString() : ""}
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
      </Box>

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
              <MultiPicker
                id="signer"
                label="Add Signer"
                value={secretInputs}
                onUpdate={onUpdateSecretInputs}
                validate={validate.secretKey}
                placeholder="Secret key (starting with S) or hash preimage (in hex)"
              />
            </div>

            <div className="Input__buttons full-width">
              <TextPicker
                id="bip-path"
                label="BIP Path"
                placeholder="BIP path in format: 44'/148'/0'"
                onChange={(e) => {
                  updateBipPath(e.target.value);

                  const error = validate.bipPath(e.target.value);

                  if (error) {
                    setBipPathErrorMsg(error);
                  } else {
                    setBipPathErrorMsg("");
                  }
                }}
                error={bipPathErrorMsg || hardwareSigErrorMsg}
                value={sign.bipPath}
                success={
                  hardwareSigSuccess
                    ? "Successfully added a hardware wallet signature"
                    : ""
                }
                note="Note: Trezor devices require upper time bounds to be set (non-zero), otherwise the signature will not be verified"
                rightElement={
                  <>
                    <div className="hardware-button">
                      <SignWithLedger
                        isDisabled={
                          Boolean(bipPathErrorMsg) || Boolean(!sign.bipPath)
                        }
                        setSignSuccess={setHardwareSigSuccess}
                        setSignError={setHardwareSigErrorMsg}
                      />
                    </div>
                    <div className="hardware-button">
                      <SignWithTrezor
                        isDisabled={
                          Boolean(bipPathErrorMsg) || Boolean(!sign.bipPath)
                        }
                        setSignSuccess={setHardwareSigSuccess}
                        setSignError={setHardwareSigErrorMsg}
                      />
                    </div>
                  </>
                }
              />
            </div>

            <Box gap="xs" addlClassName="full-width">
              <div className="SignTx__Buttons">
                <div>
                  <Button
                    disabled={
                      (!HAS_SECRET_KEYS || HAS_INVALID_SECRET_KEYS) &&
                      !sign.hardWalletSigners?.length
                    }
                    size="md"
                    variant="secondary"
                    onClick={() =>
                      signTransaction(
                        sign.importXdr,
                        secretInputs,
                        network.passphrase,
                        sign.hardWalletSigners,
                      )
                    }
                  >
                    Sign transaction
                  </Button>

                  <SignWithWallet setSignError={setSignError} />
                </div>
                <div>
                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={() => addSignature()}
                  >
                    Add signature
                  </Button>
                </div>
              </div>
              <div>
                {signError ? (
                  <Text
                    as="div"
                    size="xs"
                    weight="regular"
                    addlClassName="FieldNote--error"
                  >
                    {signError}
                  </Text>
                ) : null}
              </div>
            </Box>
          </div>
        </Card>

        {sign.signedTx ? (
          <ValidationResponseCard
            variant="success"
            title="Transaction signed!"
            subtitle={signedTxSuccessMsg}
            response={
              <Box gap="xs">
                <div>
                  <div>{sign.signedTx}</div>
                </div>
              </Box>
            }
            note={
              <>
                Now that this transaction is signed, you can submit it to the
                network. Horizon provides an endpoint called Post Transaction
                that will relay your transaction to the network and inform you
                of the result.
              </>
            }
            footerLeftEl={
              <Button
                size="md"
                variant="secondary"
                onClick={() => {
                  alert("TODO: handle sign transaction flow");
                }}
              >
                Submit in Transaction Submitter
              </Button>
            }
            footerRightEl={
              <div className="SignTx__Buttons">
                <Button
                  size="md"
                  variant="tertiary"
                  onClick={() => {
                    alert("TODO: handle view in xdr flow");
                  }}
                >
                  View in XDR viewer
                </Button>
                <Button
                  size="md"
                  variant="tertiary"
                  onClick={() => {
                    alert("TODO: handle view in fee bump");
                  }}
                >
                  Wrap with Fee Bump
                </Button>
              </div>
            }
          />
        ) : null}

        {signedTxErrorMsg ? (
          <ValidationResponseCard
            variant="error"
            title="Transaction Sign Error:"
            response={signedTxErrorMsg}
          />
        ) : null}
      </div>
    </>
  );
};
