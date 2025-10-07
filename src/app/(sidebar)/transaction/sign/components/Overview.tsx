"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, Button, Select } from "@stellar/design-system";
import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";
import { set } from "lodash";

import { FEE_BUMP_TX_FIELDS, TX_FIELDS } from "@/constants/signTransactionPage";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";
import { Routes } from "@/constants/routes";

import { useStore } from "@/store/useStore";

import { txHelper } from "@/helpers/txHelper";
import { delayedAction } from "@/helpers/delayedAction";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { arrayItem } from "@/helpers/arrayItem";
import { scrollElIntoView } from "@/helpers/scrollElIntoView";
import { isSorobanOperationType } from "@/helpers/sorobanUtils";
import { useSignWithExtensionWallet } from "@/hooks/useSignWithExtensionWallet";

import { validate } from "@/validate";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { Box } from "@/components/layout/Box";
import { MultiPicker } from "@/components/FormElements/MultiPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { LabelHeading } from "@/components/LabelHeading";
import { PageCard } from "@/components/layout/PageCard";
import { MessageField } from "@/components/MessageField";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

type TxSignatureType =
  | "secretKey"
  | "hardwareWallet"
  | "extensionWallet"
  | "signature";

export const Overview = () => {
  const { network, transaction, xdr, walletKit } = useStore();
  const {
    sign,
    updateSignActiveView,
    updateSignImportTx,
    updateSignedTx,
    updateBipPath,
    resetSign,
    updateFeeBumpParams,
  } = transaction;

  const router = useRouter();
  const successResponseEl = useRef<HTMLDivElement | null>(null);

  const [signError, setSignError] = useState("");

  // Secret key
  const [secretKeyInputs, setSecretKeyInputs] = useState<string[]>([""]);
  const [secretKeySignature, setSecretKeySignature] = useState<
    xdr.DecoratedSignature[]
  >([]);
  const [secretKeySuccessMsg, setSecretKeySuccessMsg] = useState("");
  const [secretKeyErrorMsg, setSecretKeyErrorMsg] = useState("");

  // Hardware wallet
  const [hardwareSignature, setHardwareSignature] = useState<
    xdr.DecoratedSignature[]
  >([]);
  const [hardwareSuccessMsg, setHardwareSuccessMsg] = useState("");
  const [hardwareErrorMsg, setHardwareErrorMsg] = useState("");

  const [selectedHardware, setSelectedHardware] = useState("");
  const [isHardwareLoading, setIsHardwareLoading] = useState(false);
  const [bipPathErrorMsg, setBipPathErrorMsg] = useState("");

  // Extension wallet
  const [extensionSignature, setExtensionSignature] = useState<
    xdr.DecoratedSignature[]
  >([]);

  const [isExtensionLoading, setIsExtensionLoading] = useState(false);
  const [isExtensionClear, setIsExtensionClear] = useState(false);

  type SigObj = {
    publicKey: string;
    signature: string;
  };

  const sigObj: SigObj = {
    publicKey: "",
    signature: "",
  };

  // Signature
  const [sigInputs, setSigInputs] = useState<SigObj[]>([sigObj]);
  const [sigInputsError, setSigInputsError] = useState<SigObj[]>([sigObj]);
  const [sigSignature, setSigSignature] = useState<xdr.DecoratedSignature[]>(
    [],
  );
  const [sigSuccessMsg, setSigSuccessMsg] = useState("");
  const [sigErrorMsg, setSigErrorMsg] = useState("");

  const [isSorobanXdr, setIsSorobanXdr] = useState(false);

  const HAS_SECRET_KEYS = secretKeyInputs.some((input) => input !== "");
  const HAS_INVALID_SECRET_KEYS = secretKeyInputs.some((input) => {
    if (input.length) {
      return validate.getSecretKeyError(input);
    }
    return false;
  });

  const {
    signedTxXdr: exSignedTxXdr,
    successMsg: exSuccessMsg,
    errorMsg: exErrorMsg,
  } = useSignWithExtensionWallet({
    isEnabled: isExtensionLoading,
    isClear: isExtensionClear,
    txXdr: sign.importXdr,
  });

  useEffect(() => {
    if (sign.importXdr) {
      // used to persist page data when accessed by query string
      const transaction = TransactionBuilder.fromXDR(
        sign.importXdr,
        network.passphrase,
      );

      const isSorobanTx = isSorobanOperationType(
        transaction?.operations?.[0]?.type,
      );

      setIsSorobanXdr(isSorobanTx);
      updateSignImportTx(transaction);
    } else {
      updateSignActiveView("import");
    }
  }, [
    network.passphrase,
    sign.importXdr,
    updateSignActiveView,
    updateSignImportTx,
  ]);

  useEffect(() => {
    // Always reset the signed tx since user's signature(s) always get reset as well
    updateSignedTx("");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (exSuccessMsg || exErrorMsg) {
      handleSign({ sigType: "extensionWallet", isClear: false });
      setIsExtensionLoading(false);
    }
    // Not including handleSign
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exErrorMsg, exSuccessMsg]);

  const onViewSubmitTxn = () => {
    if (sign.signedTx) {
      xdr.updateXdrBlob(sign.signedTx);
      xdr.updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

      delayedAction({
        action: () => {
          trackEvent(TrackingEvent.TRANSACTION_SIGN_SUBMIT_IN_TX_SUBMITTER);
          router.push(Routes.SUBMIT_TRANSACTION);
        },
        delay: 200,
      });
    }
  };

  const onSimulateTxn = () => {
    if (sign.signedTx) {
      xdr.updateXdrBlob(sign.signedTx);
      xdr.updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

      transaction.updateSimulateTriggerOnLaunch(true);

      // Adding delay to make sure the store will update
      delayedAction({
        action: () => {
          trackEvent(TrackingEvent.TRANSACTION_SIGN_SIMULATE);
          router.push(Routes.SIMULATE_TRANSACTION);
        },
        delay: 200,
      });
    }
  };

  const onWrapWithFeeBump = () => {
    if (sign.signedTx) {
      updateFeeBumpParams(set({}, "xdr", sign.signedTx));

      delayedAction({
        action: () => {
          trackEvent(TrackingEvent.TRANSACTION_SIGN_FEE_BUMP);
          router.push(Routes.FEE_BUMP_TRANSACTION);
        },
        delay: 200,
      });
    }
  };

  const handleSign = async ({
    sigType,
    isClear,
  }: {
    sigType: TxSignatureType;
    isClear?: boolean;
  }) => {
    setSignError("");

    // Initial state
    let secretKeySigs: xdr.DecoratedSignature[] = [];
    let hardwareSigs: xdr.DecoratedSignature[] = [];
    let extensionSigs: xdr.DecoratedSignature[] = [];
    let signatureSigs: xdr.DecoratedSignature[] = [];

    try {
      switch (sigType) {
        case "secretKey":
          secretKeySigs = signSecretKey(isClear).signature;
          break;
        case "hardwareWallet":
          hardwareSigs = (await signHardwareWallet(isClear)).signature;
          break;
        case "extensionWallet":
          if (!isClear && exSignedTxXdr) {
            extensionSigs =
              txHelper.extractLastSignature({
                txXdr: exSignedTxXdr,
                networkPassphrase: network.passphrase,
              }) || [];

            setExtensionSignature(extensionSigs);
          } else {
            setExtensionSignature([]);
          }

          break;
        case "signature":
          signatureSigs = signSignature(isClear).signature;
          break;
        default:
        // Do nothing
      }

      // Previously added signatures from other types
      if (sigType !== "secretKey" && secretKeySuccessMsg) {
        secretKeySigs = secretKeySignature;
      }

      if (sigType !== "hardwareWallet" && hardwareSuccessMsg) {
        hardwareSigs = hardwareSignature;
      }

      if (sigType !== "extensionWallet" && exSuccessMsg) {
        extensionSigs = extensionSignature;
      }

      if (sigType !== "signature" && sigSuccessMsg) {
        signatureSigs = sigSignature;
      }

      const tx = TransactionBuilder.fromXDR(sign.importXdr, network.passphrase);
      const allSigs = [
        ...secretKeySigs,
        ...hardwareSigs,
        ...extensionSigs,
        ...signatureSigs,
      ];

      if (allSigs.length > 0) {
        tx.signatures.push(...allSigs);

        const signedTx = tx.toEnvelope().toXDR("base64");
        updateSignedTx(signedTx);

        scrollElIntoView(successResponseEl);
      } else {
        updateSignedTx("");
      }
    } catch (e: any) {
      setSignError(e.toString());
    }
  };

  const handleSignatureOnChange = (
    value: string,
    key: "publicKey" | "signature",
    index: number,
  ) => {
    const validationError =
      key === "publicKey" ? validate.getPublicKeyError(value) : "";

    const inputVal = arrayItem.update(sigInputs, index, {
      ...sigInputs[index],
      [key]: value,
    });

    const inputError = arrayItem.update(sigInputsError, index, {
      ...sigInputsError[index],
      publicKey: validationError,
    });

    updateSignatureInputsAndError(inputVal, inputError);
  };

  const updateSignatureInputsAndError = (inputs: SigObj[], error: SigObj[]) => {
    setSigInputs(inputs);
    setSigInputsError(error);

    if (sigSuccessMsg || sigErrorMsg) {
      handleSign({ sigType: "signature", isClear: true });
    }
  };

  const signSecretKey = (isClear?: boolean) => {
    let signature: xdr.DecoratedSignature[] = [];
    let successMsg = "";
    let errorMsg = "";

    if (!isClear) {
      const txSig = txHelper.secretKeySignature({
        txXdr: sign.importXdr,
        networkPassphrase: network.passphrase,
        signers: secretKeyInputs,
      });

      signature = txSig.signature;
      successMsg = txSig.successMsg || "";
      errorMsg = txSig.errorMsg || "";
    }

    setSecretKeySignature(signature);
    setSecretKeySuccessMsg(successMsg);
    setSecretKeyErrorMsg(errorMsg);

    if (successMsg) {
      trackEvent(TrackingEvent.TRANSACTION_SIGN_SECRET_KEY_SUCCESS);
    }

    if (errorMsg) {
      trackEvent(TrackingEvent.TRANSACTION_SIGN_SECRET_KEY_ERROR);
    }

    return { signature, errorMsg };
  };

  const signHardwareWallet = async (isClear?: boolean) => {
    setIsHardwareLoading(true);

    let signature: xdr.DecoratedSignature[] = [];
    let successMsg = "";
    let errorMsg = "";

    if (!isClear) {
      try {
        if (selectedHardware === "ledger") {
          const { signature: ledgerSig, error } = await txHelper.signWithLedger(
            {
              bipPath: sign.bipPath,
              transaction: sign.importTx as FeeBumpTransaction | Transaction,
              isHash: false,
            },
          );

          signature = ledgerSig ?? [];

          errorMsg = error || "";

          if (errorMsg.includes("0x6511")) {
            errorMsg =
              "Please select Stellar app on the Ledger device and try again";
          }
        }

        if (selectedHardware === "ledger_hash") {
          const { signature: ledgerSig, error } = await txHelper.signWithLedger(
            {
              bipPath: sign.bipPath,
              transaction: sign.importTx as FeeBumpTransaction | Transaction,
              isHash: true,
            },
          );

          signature = ledgerSig ?? [];
          errorMsg = error || "";
        }

        if (selectedHardware === "trezor") {
          const path = `m/${sign.bipPath}`;

          const { signature: trezorSig, error } = await txHelper.signWithTrezor(
            {
              bipPath: path,
              transaction: sign.importTx as Transaction,
            },
          );

          signature = trezorSig ?? [];
          errorMsg = error || "";
        }

        successMsg = errorMsg
          ? ""
          : "Successfully added a hardware wallet signature";
      } catch (err) {
        errorMsg = `An unexpected error occurred: ${err}`;
      }
    }

    setIsHardwareLoading(false);
    setHardwareSignature(signature);
    setHardwareSuccessMsg(successMsg);
    setHardwareErrorMsg(errorMsg);

    if (successMsg) {
      trackEvent(TrackingEvent.TRANSACTION_SIGN_HARDWARE_SUCCESS, {
        selectedHardware,
      });
    }

    if (errorMsg) {
      trackEvent(TrackingEvent.TRANSACTION_SIGN_HARDWARE_ERROR, {
        selectedHardware,
      });
    }

    return { signature, errorMsg };
  };

  const signSignature = (isClear?: boolean) => {
    let signature: xdr.DecoratedSignature[] = [];
    let successMsg = "";
    let errorMsg = "";

    if (!isClear) {
      const txSig = txHelper.decoratedSigFromHexSig(sigInputs);

      signature = txSig.signature;
      successMsg = txSig.successMsg || "";
      errorMsg = txSig.errorMsg || "";
    }

    setSigSignature(signature);
    setSigSuccessMsg(successMsg);
    setSigErrorMsg(errorMsg);

    if (successMsg) {
      trackEvent(TrackingEvent.TRANSACTION_SIGN_SIGNATURE_SUCCESS, {
        selectedHardware,
      });
    }

    if (errorMsg) {
      trackEvent(TrackingEvent.TRANSACTION_SIGN_SIGNATURE_ERROR, {
        selectedHardware,
      });
    }

    return { signature, errorMsg };
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

  const SignTxButton = ({
    label = "Sign transaction",
    onSign,
    onClear,
    isDisabled,
    isLoading,
    successMsg,
    errorMsg,
  }: {
    label?: string;
    onSign: () => void;
    onClear: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    successMsg: string;
    errorMsg: string;
  }) => {
    return (
      <Box gap="md" direction="row" align="center" wrap="wrap">
        {successMsg ? (
          <Button size="md" variant="tertiary" onClick={onClear}>
            Clear signature
          </Button>
        ) : (
          <Button
            disabled={isDisabled}
            size="md"
            variant="tertiary"
            onClick={onSign}
            isLoading={isLoading}
          >
            {label}
          </Button>
        )}

        <>
          {successMsg || errorMsg ? (
            <MessageField
              message={successMsg || errorMsg}
              isError={Boolean(errorMsg)}
            />
          ) : null}
        </>
      </Box>
    );
  };

  const AddSignatureButton = () => {
    const signatureText = sigInputs.length === 1 ? "signature" : "signatures";

    const hasEmptyFields =
      sigInputs.reduce((res, cur) => {
        if (!(cur.publicKey && cur.signature)) {
          return [...res, true];
        }

        return res;
      }, [] as boolean[]).length > 0;

    const hasErrors =
      sigInputsError.reduce((res, cur) => {
        if (cur.publicKey || cur.signature) {
          return [...res, true];
        }

        return res;
      }, [] as boolean[]).length > 0;

    return (
      <Box
        gap="md"
        direction="row"
        align="center"
        wrap="wrap"
        data-testid="sign-tx-overview"
      >
        {sigSuccessMsg ? (
          <Button
            size="md"
            variant="tertiary"
            onClick={() => handleSign({ sigType: "signature", isClear: true })}
          >
            {`Clear ${signatureText}`}
          </Button>
        ) : (
          <Button
            disabled={hasEmptyFields || hasErrors}
            size="md"
            variant="tertiary"
            onClick={() => handleSign({ sigType: "signature", isClear: false })}
          >
            {`Add ${signatureText} to transaction`}
          </Button>
        )}

        <Button
          size="md"
          variant="tertiary"
          onClick={() => {
            const newInputs = arrayItem.add(sigInputs, sigObj);
            const newErrors = arrayItem.add(sigInputsError, sigObj);

            updateSignatureInputsAndError(newInputs, newErrors);
          }}
        >
          Add additional signature
        </Button>

        <>
          {sigSuccessMsg || sigErrorMsg ? (
            <MessageField
              message={sigSuccessMsg || sigErrorMsg}
              isError={Boolean(sigErrorMsg)}
            />
          ) : null}
        </>
      </Box>
    );
  };

  const getAllSigsMessage = () => {
    const allMsgs = [];
    const secretKeySigCount = secretKeySignature.length;
    const hardwareSigCount = hardwareSignature.length;
    const extensionSigCount = extensionSignature.length;
    const sigSignatureCount = sigSignature.length;

    const getMsg = (count: number, label: string) =>
      `${count} ${label} signature${count > 1 ? "s" : ""}`;

    if (secretKeySigCount > 0) {
      allMsgs.push(getMsg(secretKeySigCount, "secret key"));
    }

    if (hardwareSigCount > 0) {
      allMsgs.push(getMsg(hardwareSigCount, "hardware wallet"));
    }

    if (extensionSigCount > 0) {
      allMsgs.push(getMsg(extensionSigCount, "extension wallet"));
    }

    if (sigSignatureCount > 0) {
      allMsgs.push(getMsg(sigSignatureCount, ""));
    }

    if (allMsgs.length > 0) {
      return `${allMsgs.join(", ")} added`;
    }

    return "";
  };

  return (
    <>
      <PageCard
        heading="Transaction Overview"
        rightElement={
          <Button
            size="md"
            variant="error"
            icon={<Icon.RefreshCw01 />}
            iconPosition="right"
            onClick={() => {
              resetSign();
              trackEvent(TrackingEvent.TRANSACTION_SIGN_CLEAR);
            }}
          >
            Clear and import new
          </Button>
        }
      >
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
      </PageCard>

      <div className="SignTx__Signs" data-testid="sign-tx-sigs">
        <PageCard
          heading="Signatures"
          headingInfoLink="https://developers.stellar.org/docs/learn/encyclopedia/signatures-multisig"
          headingAs="h2"
        >
          <Box gap="lg">
            <Box
              gap="md"
              addlClassName="PageBody__content"
              data-testid="sign-tx-secretkeys"
            >
              <MultiPicker
                id="signer"
                label="Sign with secret key"
                value={secretKeyInputs}
                onChange={(val) => {
                  if (secretKeySuccessMsg || secretKeyErrorMsg) {
                    handleSign({ sigType: "secretKey", isClear: true });
                  }

                  setSecretKeyInputs(val);
                }}
                validate={validate.getSecretKeyError}
                placeholder="Secret key (starting with S) or hash preimage (in hex)"
                autocomplete="off"
                isPassword
              />
              <SignTxButton
                onSign={() => {
                  handleSign({ sigType: "secretKey", isClear: false });
                }}
                onClear={() => {
                  handleSign({ sigType: "secretKey", isClear: true });
                }}
                isDisabled={!HAS_SECRET_KEYS || HAS_INVALID_SECRET_KEYS}
                successMsg={secretKeySuccessMsg}
                errorMsg={secretKeyErrorMsg}
              />
            </Box>

            <Box
              gap="md"
              addlClassName="PageBody__content"
              data-testid="sign-tx-hardware"
            >
              <Box gap="sm" direction="row">
                <TextPicker
                  id="bip-path"
                  label="Sign with hardware wallet"
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
                  error={bipPathErrorMsg}
                  value={sign.bipPath}
                  note={
                    selectedHardware === "trezor"
                      ? "Note: Trezor devices require upper time bounds to be set (non-zero), otherwise the signature will not be verified"
                      : undefined
                  }
                  rightElement={
                    <>
                      <div className="InputSideElement InputSideElement--right SignTx__hardwareDropdown">
                        <Select
                          fieldSize="md"
                          id="hardware-wallet-select"
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            if (hardwareSuccessMsg || hardwareErrorMsg) {
                              handleSign({
                                sigType: "hardwareWallet",
                                isClear: true,
                              });
                            }

                            setSelectedHardware(event.target.value);
                          }}
                        >
                          <option value="">Select a wallet</option>
                          <option value="ledger">Ledger</option>
                          <option value="ledger_hash">Hash with Ledger</option>
                          <option value="trezor">Trezor</option>
                        </Select>
                      </div>
                    </>
                  }
                />
              </Box>

              <SignTxButton
                onSign={() => {
                  handleSign({
                    sigType: "hardwareWallet",
                    isClear: false,
                  });
                }}
                onClear={() => {
                  handleSign({
                    sigType: "hardwareWallet",
                    isClear: true,
                  });
                }}
                isLoading={isHardwareLoading}
                isDisabled={!selectedHardware || !sign.bipPath}
                successMsg={hardwareSuccessMsg}
                errorMsg={hardwareErrorMsg}
              />
            </Box>

            <Box
              gap="md"
              addlClassName="PageBody__content"
              data-testid="sign-tx-wallet-ext"
            >
              <LabelHeading size="md">Sign with wallet extension</LabelHeading>

              <SignTxButton
                label={`Sign with ${walletKit?.publicKey ? shortenStellarAddress(walletKit?.publicKey) : "wallet"}`}
                onSign={() => {
                  setIsExtensionClear(false);
                  setIsExtensionLoading(true);

                  trackEvent(TrackingEvent.TRANSACTION_SIGN_WALLET);
                }}
                onClear={() => {
                  setIsExtensionClear(true);
                  handleSign({ sigType: "extensionWallet", isClear: true });
                }}
                isLoading={isExtensionLoading}
                successMsg={exSuccessMsg}
                errorMsg={exErrorMsg}
              />
            </Box>

            <Box
              gap="md"
              addlClassName="PageBody__content"
              data-testid="sign-tx-signature"
            >
              <LabelHeading size="md">Add a signature</LabelHeading>

              <>
                {sigInputs.map((_, idx) => (
                  <Box gap="xs" key={`${idx}-tx-sig`}>
                    <PubKeyPicker
                      id={`${idx}-tx-sig-pubkey`}
                      placeholder="Public key"
                      label=""
                      value={sigInputs[idx]?.publicKey}
                      error={sigInputsError[idx]?.publicKey}
                      onChange={(e) =>
                        handleSignatureOnChange(
                          e.target.value,
                          "publicKey",
                          idx,
                        )
                      }
                    />

                    <TextPicker
                      id={`${idx}-tx-sig-b64sig`}
                      placeholder="Hex encoded 64-byte ed25519 signature"
                      value={sigInputs[idx]?.signature}
                      error={sigInputsError[idx]?.signature}
                      onChange={(e) =>
                        handleSignatureOnChange(
                          e.target.value,
                          "signature",
                          idx,
                        )
                      }
                      autocomplete="off"
                    />

                    <>
                      {idx !== 0 ? (
                        <Box gap="md" direction="row" justify="end">
                          <Button
                            size="md"
                            variant="error"
                            onClick={() => {
                              const newInputs = arrayItem.delete(
                                sigInputs,
                                idx,
                              );
                              const newErrors = arrayItem.delete(
                                sigInputsError,
                                idx,
                              );

                              updateSignatureInputsAndError(
                                newInputs,
                                newErrors,
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ) : null}
                    </>
                  </Box>
                ))}
                <div className="FieldNote FieldNote--note FieldNote--md">
                  Use this section to add signature(s) to the transaction
                  envelope
                </div>
              </>

              <AddSignatureButton />
            </Box>
          </Box>
        </PageCard>

        {sign.signedTx ? (
          <div ref={successResponseEl} data-testid="sign-tx-validation-card">
            <ValidationResponseCard
              variant="success"
              title="Transaction signed!"
              subtitle={getAllSigsMessage()}
              response={
                <Box gap="xs">
                  <div>
                    <div data-testid="validation-card-response">
                      {sign.signedTx}
                    </div>
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
                <Box gap="sm" direction="row" align="center" wrap="wrap">
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={onViewSubmitTxn}
                  >
                    Submit transaction
                  </Button>

                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={onSimulateTxn}
                    disabled={!isSorobanXdr}
                  >
                    Simulate transaction
                  </Button>
                </Box>
              }
              footerRightEl={
                <div className="SignTx__Buttons">
                  <ViewInXdrButton
                    xdrBlob={sign.signedTx}
                    callback={() => {
                      trackEvent(TrackingEvent.TRANSACTION_SIGN_VIEW_IN_XDR);
                    }}
                  />

                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={onWrapWithFeeBump}
                  >
                    Wrap with Fee Bump
                  </Button>
                </div>
              }
            />
          </div>
        ) : null}

        {signError ? (
          <ValidationResponseCard
            variant="error"
            title="Transaction Sign Error:"
            response={signError}
          />
        ) : null}
      </div>
    </>
  );
};
