"use client";

import { useEffect, useState } from "react";
import { Card, Icon, Text, Button, Select } from "@stellar/design-system";
import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

import { FEE_BUMP_TX_FIELDS, TX_FIELDS } from "@/constants/signTransactionPage";

import { useStore } from "@/store/useStore";

import { txHelper } from "@/helpers/txHelper";

import { validate } from "@/validate";

import { Box } from "@/components/layout/Box";
import { MultiPicker } from "@/components/FormElements/MultiPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { WithInfoText } from "@/components/WithInfoText";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";

import { SignWithWallet } from "./SignWithWallet";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

export const Overview = () => {
  const { network, transaction } = useStore();
  const {
    sign,
    updateHardWalletSigs,
    updateSignActiveView,
    updateSignImportTx,
    updateSignedTx,
    updateBipPath,
    resetSign,
    resetSignHardWalletSigs,
  } = transaction;

  const [secretInputs, setSecretInputs] = useState<string[]>([""]);

  // Adding hardware wallets sig (signatures) related

  const [bipPathErrorMsg, setBipPathErrorMsg] = useState<string>("");
  const [hardwareSigSuccess, setHardwareSigSuccess] = useState<boolean>(false);
  const [hardwareSigErrorMsg, setHardwareSigErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedHardware, setSelectedHardware] = useState<string>("");

  // Sign tx status related
  const [signedTxSuccessMsg, setSignedTxSuccessMsg] = useState<string>("");
  const [signedTxErrorMsg, setSignedTxErrorMsg] = useState<string>("");
  const [signError, setSignError] = useState<string>("");

  const HAS_SECRET_KEYS = secretInputs.some((input) => input !== "");
  const HAS_INVALID_SECRET_KEYS = secretInputs.some((input) => {
    if (input.length) {
      return validate.getSecretKeyError(input);
    }
    return false;
  });

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
    hardWalletSigs: xdr.DecoratedSignature[],
  ) => {
    const { xdr, message } = txHelper.signTx({
      txXdr,
      signers,
      networkPassphrase,
      hardWalletSigs: hardWalletSigs || [],
    });

    if (xdr && message) {
      updateSignedTx(xdr);
      setSignedTxSuccessMsg(message);
    } else if (!xdr && message) {
      setSignedTxErrorMsg(message);
    }
  };

  const signWithHardware = async () => {
    setHardwareSigSuccess(false);
    updateSignedTx("");

    setIsLoading(true);

    let hardwareSign;
    let hardwareSignError;

    try {
      if (selectedHardware === "ledger") {
        const { signature, error } = await txHelper.signWithLedger({
          bipPath: sign.bipPath,
          transaction: sign.importTx as FeeBumpTransaction | Transaction,
          isHash: false,
        });

        hardwareSign = signature;
        hardwareSignError = error;
      }

      if (selectedHardware === "ledger_hash") {
        const { signature, error } = await txHelper.signWithLedger({
          bipPath: sign.bipPath,
          transaction: sign.importTx as FeeBumpTransaction | Transaction,
          isHash: true,
        });

        hardwareSign = signature;
        hardwareSignError = error;
      }

      if (selectedHardware === "trezor") {
        const path = `m/${sign.bipPath}`;

        const { signature, error } = await txHelper.signWithTrezor({
          bipPath: path,
          transaction: sign.importTx as Transaction,
        });

        hardwareSign = signature;
        hardwareSignError = error;
      }

      setIsLoading(false);

      if (hardwareSign) {
        updateHardWalletSigs(hardwareSign);
        setHardwareSigSuccess(true);
      } else if (hardwareSignError) {
        setHardwareSigErrorMsg(hardwareSignError);
      }
    } catch (err) {
      setIsLoading(false);
      setHardwareSigErrorMsg(`An unexpected error occurred: ${err}`);
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

  const resetHardwareSign = () => {
    resetSignHardWalletSigs();
    setHardwareSigSuccess(false);
    setHardwareSigErrorMsg("");
  };

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
                onChange={onUpdateSecretInputs}
                validate={validate.getSecretKeyError}
                placeholder="Secret key (starting with S) or hash preimage (in hex)"
                autocomplete="off"
              />
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
            <div className="Input__buttons full-width">
              <Box gap="sm" direction="row">
                <TextPicker
                  id="bip-path"
                  label="BIP Path"
                  placeholder="BIP path in format: 44'/148'/0'"
                  onChange={(e) => {
                    updateBipPath(e.target.value);

                    const error = validate.getBipPathError(e.target.value);

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
                        <Select
                          fieldSize="md"
                          id="hardware-wallet-select"
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            resetHardwareSign();
                            setSelectedHardware(event.target.value);
                          }}
                        >
                          <option value="">Select operation type</option>
                          <option value="ledger">Ledger</option>
                          <option value="ledger_hash">Hash with Ledger</option>
                          <option value="trezor">Trezor</option>
                        </Select>
                      </div>
                    </>
                  }
                />
                <div className="hardware-sign-button">
                  <Button
                    disabled={!selectedHardware || !sign.bipPath}
                    isLoading={isLoading}
                    onClick={signWithHardware}
                    size="md"
                    variant="tertiary"
                  >
                    Sign
                  </Button>
                </div>
              </Box>
            </div>

            <Box gap="xs" addlClassName="full-width">
              <div className="SignTx__Buttons">
                <div>
                  <Button
                    disabled={
                      (!HAS_SECRET_KEYS || HAS_INVALID_SECRET_KEYS) &&
                      !sign.hardWalletSigs?.length
                    }
                    size="md"
                    variant="secondary"
                    onClick={() =>
                      signTransaction(
                        sign.importXdr,
                        secretInputs,
                        network.passphrase,
                        sign.hardWalletSigs,
                      )
                    }
                  >
                    Sign transaction
                  </Button>

                  <SignWithWallet setSignError={setSignError} />
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
                <ViewInXdrButton xdrBlob={sign.signedTx} />

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
