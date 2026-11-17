"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { Button, Icon, Select, Text } from "@stellar/design-system";

import { MultiPicker } from "@/components/FormElements/MultiPicker";
import { Box } from "@/components/layout/Box";
import { MessageField } from "@/components/MessageField";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { LabelHeading } from "@/components/LabelHeading";
import { PubKeyPickerWithSignerSelector } from "@/components/FormElements/PubKeyPickerWithSignerSelector";

import { txHelper } from "@/helpers/txHelper";
import {
  mergeTransactionSignatures,
  collectTransactionSignatures,
  getWalletSigningResult,
} from "@/helpers/mergeTransactionSignatures";
import { arrayItem } from "@/helpers/arrayItem";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  getAllSigsMessage,
  type AllSigsCount,
} from "@/helpers/getAllSigsMessage";

import { validate } from "@/validate";
import { useSignWithExtensionWallet } from "@/hooks/useSignWithExtensionWallet";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import "./styles.scss";

type TxSignatureType =
  | "secretKey"
  | "hardwareWallet"
  | "extensionWallet"
  | "signature";

type UniqueTabId = `${string}-${TxSignatureType}`;

type Props = {
  id: string;
  title?: string;
  xdrToSign: string | null;
  onDoneAction: ({
    signedXdr,
    successMessage,
    errorMessage,
  }: {
    signedXdr: string | null;
    successMessage: string | null;
    errorMessage: string | null;
  }) => void;
  defaultSignatureType?: TxSignatureType;
  isDisabled?: boolean;
  description?: string;
  customFooter?: React.ReactNode;
  /**
   * Optional custom signing function. When provided, replaces the default
   * envelope signing logic. Used for Soroban auth entry signing where
   * `authorizeEntry()` is needed instead of `tx.sign()`.
   *
   * Receives the secret key inputs and should return success/error messages.
   * The component manages its own UI state (tabs, messages) around this.
   */
  customSignFn?: (params: {
    sigType: TxSignatureType;
    secretKeys: string[];
  }) => Promise<{ successMessage: string; errorMessage: string }>;
};

/** A new transaction/network owns a fresh set of inputs, signatures and requests. */
export const SignTransactionXdr = (props: Props) => {
  const { network } = useStore();
  const { onDoneAction } = props;
  const signingKey = JSON.stringify([
    props.xdrToSign,
    network.id,
    network.passphrase,
  ]);
  const previousKey = useRef(signingKey);

  useLayoutEffect(() => {
    if (previousKey.current !== signingKey) {
      previousKey.current = signingKey;
      onDoneAction({
        signedXdr: null,
        successMessage: null,
        errorMessage: null,
      });
    }
  }, [signingKey, onDoneAction]);

  return <SigningSession key={signingKey} {...props} />;
};

const SigningSession = ({
  id,
  title,
  xdrToSign,
  onDoneAction: onDone,
  defaultSignatureType = "secretKey",
  isDisabled = false,
  description,
  customFooter,
  customSignFn,
}: Props) => {
  const { network, walletKit } = useStore();
  const isMounted = useRef(true);
  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onDoneAction: Props["onDoneAction"] = (result) => {
    if (isMounted.current) onDone(result);
  };

  const initSigsCount: AllSigsCount = {
    secretKey: 0,
    hardwareWallet: 0,
    extensionWallet: 0,
    signature: 0,
  };

  const initBipPath = "44'/148'/0'";

  const [selectedTab, setSelectedTab] = useState(defaultSignatureType);

  // Secret key
  const [secretKeyInputs, setSecretKeyInputs] = useState<string[]>([""]);
  const [secretKeySignature, setSecretKeySignature] = useState<
    xdr.DecoratedSignature[]
  >([]);
  const [secretKeySuccessMsg, setSecretKeySuccessMsg] = useState("");
  const [secretKeyErrorMsg, setSecretKeyErrorMsg] = useState("");

  // Hardware wallet
  const [bipPath, setBipPath] = useState(initBipPath);
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

  const [walletTransactionXdr, setWalletTransactionXdr] = useState<
    string | null
  >(null);
  const [extensionSuccessMsg, setExtensionSuccessMsg] = useState("");
  const [extensionErrorMsg, setExtensionErrorMsg] = useState("");
  const { signTx: signWithExtension, isLoading: isExtensionLoading } =
    useSignWithExtensionWallet();

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

  // All signatures count
  const [allSigsCount, setAllSigsCount] = useState(initSigsCount);

  const HAS_SECRET_KEYS = secretKeyInputs.some((input) => input !== "");
  const HAS_INVALID_SECRET_KEYS = secretKeyInputs.some((input) => {
    if (input.length) {
      return validate.getSecretKeyError(input);
    }
    return false;
  });

  const handleSign = async ({
    sigType,
    isClear,
  }: {
    sigType: TxSignatureType;
    isClear?: boolean;
  }) => {
    if (!xdrToSign || !isMounted.current) {
      return;
    }

    // Custom sign mode: delegate signing to external handler
    if (customSignFn && !isClear) {
      try {
        const result = await customSignFn({
          sigType,
          secretKeys: secretKeyInputs,
        });

        if (!isMounted.current) return;

        if (result.successMessage) {
          setSecretKeySuccessMsg(result.successMessage);
          setSecretKeyErrorMsg("");
          setAllSigsCount((prev) => ({ ...prev, secretKey: 1 }));
        }

        if (result.errorMessage) {
          setSecretKeyErrorMsg(result.errorMessage);
          setSecretKeySuccessMsg("");
        }

        onDoneAction({
          signedXdr: null,
          successMessage: result.successMessage || null,
          errorMessage: result.errorMessage || null,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setSecretKeyErrorMsg(msg);
        onDoneAction({
          signedXdr: null,
          successMessage: null,
          errorMessage: msg,
        });
      }
      return;
    }

    // A wallet may have adopted a modified envelope before other signers joined.
    let baseXdr = walletTransactionXdr || xdrToSign;

    // Initial state
    let secretKeySigs: xdr.DecoratedSignature[] = [];
    let hardwareSigs: xdr.DecoratedSignature[] = [];
    let extensionSigs: xdr.DecoratedSignature[] = [];
    let signatureSigs: xdr.DecoratedSignature[] = [];

    try {
      switch (sigType) {
        case "secretKey":
          secretKeySigs = signSecretKey(baseXdr, isClear).signature;
          break;
        case "hardwareWallet":
          hardwareSigs = (await signHardwareWallet(baseXdr, isClear)).signature;
          break;
        case "extensionWallet":
          if (isClear) {
            setExtensionSignature([]);
            setExtensionSuccessMsg("");
            setExtensionErrorMsg("");
          } else {
            setExtensionErrorMsg("");
            const signedXdr = await signWithExtension(
              baseXdr,
              extensionSignature.length > 0,
            );
            if (!signedXdr || !isMounted.current) {
              return;
            }
            const result = getWalletSigningResult(
              baseXdr,
              signedXdr,
              network.passphrase,
              [
                ...secretKeySignature,
                ...hardwareSignature,
                ...extensionSignature,
                ...sigSignature,
              ],
            );
            baseXdr = result.xdrToSign;
            setWalletTransactionXdr(baseXdr);
            extensionSigs = mergeTransactionSignatures(
              extensionSignature,
              result.signatures,
            );
            setExtensionSignature(extensionSigs);
            setExtensionSuccessMsg(
              `Successfully added ${extensionSigs.length} wallet signature${extensionSigs.length === 1 ? "" : "s"}`,
            );
          }
          break;
        case "signature":
          signatureSigs = signSignature(isClear).signature;
          break;
        default:
        // Do nothing
      }

      if (!isMounted.current) return;

      // Previously added signatures from other types
      if (sigType !== "secretKey" && secretKeySuccessMsg) {
        secretKeySigs = secretKeySignature;
      }

      if (sigType !== "hardwareWallet" && hardwareSuccessMsg) {
        hardwareSigs = hardwareSignature;
      }

      if (sigType !== "extensionWallet" && extensionSignature.length > 0) {
        extensionSigs = extensionSignature;
      }

      if (sigType !== "signature" && sigSuccessMsg) {
        signatureSigs = sigSignature;
      }

      const allSigs = [
        ...secretKeySigs,
        ...hardwareSigs,
        ...extensionSigs,
        ...signatureSigs,
      ];

      const tx = TransactionBuilder.fromXdr(baseXdr, network.passphrase);
      const { signatures, counts: allSigsCount } = collectTransactionSignatures(
        tx.signatures,
        {
          secretKey: secretKeySigs,
          hardwareWallet: hardwareSigs,
          extensionWallet: extensionSigs,
          signature: signatureSigs,
        },
      );
      setAllSigsCount(allSigsCount);

      if (allSigs.length > 0) {
        tx.signatures.splice(0, tx.signatures.length, ...signatures);
        const signedTx = tx.toEnvelope().toXdr("base64");

        onDoneAction({
          signedXdr: signedTx,
          successMessage:
            getAllSigsMessage(allSigsCount) || "No new signatures added",
          errorMessage: null,
        });
      } else {
        setWalletTransactionXdr(null);
        onDoneAction({
          signedXdr: null,
          successMessage: null,
          errorMessage: null,
        });
      }
    } catch (e: any) {
      if (!isMounted.current) return;
      if (sigType === "extensionWallet") {
        setExtensionErrorMsg(e?.message || String(e));
      } else {
        onDoneAction({
          signedXdr: null,
          successMessage: null,
          errorMessage: e.toString(),
        });
      }
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

  const signSecretKey = (txXdr: string, isClear?: boolean) => {
    let signature: xdr.DecoratedSignature[] = [];
    let successMsg = "";
    let errorMsg = "";

    if (!isClear) {
      const txSig = txHelper.secretKeySignature({
        txXdr,
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

  const signHardwareWallet = async (txXdr: string, isClear?: boolean) => {
    setIsHardwareLoading(true);

    const txToSign = TransactionBuilder.fromXdr(txXdr, network.passphrase) as
      | FeeBumpTransaction
      | Transaction;
    let signature: xdr.DecoratedSignature[] = [];
    let successMsg = "";
    let errorMsg = "";

    if (!isClear) {
      try {
        if (selectedHardware === "ledger") {
          const { signature: ledgerSig, error } = await txHelper.signWithLedger(
            {
              bipPath,
              transaction: txToSign,
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
              bipPath,
              transaction: txToSign,
              isHash: true,
            },
          );

          signature = ledgerSig ?? [];
          errorMsg = error || "";
        }

        if (selectedHardware === "trezor") {
          const path = `m/${bipPath}`;

          const { signature: trezorSig, error } = await txHelper.signWithTrezor(
            {
              bipPath: path,
              transaction: txToSign,
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

    if (!isMounted.current) return { signature: [], errorMsg: "" };

    setIsHardwareLoading(false);
    // A failed or cancelled attempt must retain signatures already collected.
    signature = isClear
      ? []
      : mergeTransactionSignatures(hardwareSignature, signature);
    setHardwareSignature(signature);
    setHardwareSuccessMsg(
      signature.length
        ? `Successfully added ${signature.length} hardware wallet signature${signature.length === 1 ? "" : "s"}`
        : "",
    );
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
      const existingSigs = xdrToSign
        ? txHelper.extractSignaturesFromTx({
            txXdr: walletTransactionXdr || xdrToSign,
            networkPassphrase: network.passphrase,
          })
        : [];

      const txSig = txHelper.decoratedSigFromHexSig(sigInputs, existingSigs);

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

  const SignTxButton = ({
    label = "Sign",
    onSign,
    onClear,
    isDisabled,
    isLoading,
    successMsg,
    errorMsg,
    allowAdditional = false,
  }: {
    label?: string;
    onSign: () => void;
    onClear: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    successMsg: string;
    errorMsg: string;
    allowAdditional?: boolean;
  }) => {
    return (
      <Box gap="md" direction="row" align="center" wrap="wrap">
        {allowAdditional || !successMsg ? (
          <Button
            disabled={
              isDisabled ||
              !xdrToSign ||
              isHardwareLoading ||
              isExtensionLoading
            }
            size="md"
            variant="secondary"
            onClick={onSign}
            isLoading={isLoading}
          >
            {successMsg ? "Add additional signer" : label}
          </Button>
        ) : null}
        {successMsg ? (
          <Button
            size="md"
            variant="error"
            icon={<Icon.RefreshCw01 />}
            iconPosition="right"
            onClick={onClear}
            disabled={isLoading || isHardwareLoading || isExtensionLoading}
          >
            Clear
          </Button>
        ) : null}

        <>
          {successMsg || errorMsg ? (
            <MessageField
              message={errorMsg || successMsg}
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
            variant="error"
            icon={<Icon.RefreshCw01 />}
            iconPosition="right"
            onClick={() => {
              handleSign({ sigType: "signature", isClear: true });
              setSigInputs([sigObj]);
            }}
          >
            Clear
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
              message={
                sigErrorMsg ||
                (sigSuccessMsg
                  ? signatureCountMessage(allSigsCount.signature)
                  : "")
              }
              isError={Boolean(sigErrorMsg)}
            />
          ) : null}
        </>
      </Box>
    );
  };

  return (
    <div
      className="SignTransactionXdr"
      data-is-disabled={
        isDisabled || !xdrToSign || isHardwareLoading || isExtensionLoading
      }
      data-testid={`sign-tx-xdr-${id}`}
    >
      <Box gap="md" direction="column">
        {/* Title */}
        {title ? (
          <Text
            as="div"
            size="sm"
            weight="medium"
            addlClassName="SignTransactionXdr__title"
          >
            {title}
          </Text>
        ) : null}

        {description ? (
          <Text size="sm" weight="regular" as="div">
            {description}
          </Text>
        ) : null}

        {/* Tabs */}
        <div className="SignTransactionXdr__tabsContainer">
          <Tab
            id={`${id}-secretKey`}
            label="Sign with secret key"
            isSelected={selectedTab === "secretKey"}
            signatureCount={allSigsCount.secretKey}
            onTabChange={(tabId) => {
              setSelectedTab(tabId);
            }}
          />
          <Tab
            id={`${id}-extensionWallet`}
            label="Wallet extension"
            isSelected={selectedTab === "extensionWallet"}
            signatureCount={allSigsCount.extensionWallet}
            onTabChange={(tabId) => {
              setSelectedTab(tabId);
            }}
          />
          <Tab
            id={`${id}-hardwareWallet`}
            label="Hardware wallet"
            isSelected={selectedTab === "hardwareWallet"}
            signatureCount={allSigsCount.hardwareWallet}
            onTabChange={(tabId) => {
              setSelectedTab(tabId);
            }}
          />
          <Tab
            id={`${id}-signature`}
            label="Transaction envelope"
            isSelected={selectedTab === "signature"}
            signatureCount={allSigsCount.signature}
            onTabChange={(tabId) => {
              setSelectedTab(tabId);
            }}
          />
        </div>
      </Box>

      {/* Tabs Content */}
      <div className="SignTransactionXdr__tabsContent">
        {/* Secret key */}
        <div
          className="SignTransactionXdr__tabContent"
          data-type="secretKey"
          data-is-visible={selectedTab === "secretKey"}
        >
          <MultiPicker
            id={`${id}-signer`}
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
            useSecretSelector
            limit={customSignFn ? 1 : undefined}
            submitButton={
              <SignTxButton
                onSign={async () => {
                  await handleSign({ sigType: "secretKey", isClear: false });
                }}
                onClear={async () => {
                  await handleSign({ sigType: "secretKey", isClear: true });
                  setSecretKeyInputs([""]);
                }}
                isDisabled={!HAS_SECRET_KEYS || HAS_INVALID_SECRET_KEYS}
                successMsg={
                  secretKeySuccessMsg
                    ? customSignFn
                      ? secretKeySuccessMsg
                      : signatureCountMessage(allSigsCount.secretKey)
                    : ""
                }
                errorMsg={secretKeyErrorMsg}
              />
            }
          />
        </div>

        {/* Wallet extension */}
        <div
          className="SignTransactionXdr__tabContent"
          data-type="extensionWallet"
          data-is-visible={selectedTab === "extensionWallet"}
        >
          <LabelHeading size="md">Sign with wallet extension</LabelHeading>

          <SignTxButton
            label={`Sign with ${walletKit?.publicKey ? shortenStellarAddress(walletKit?.publicKey) : "wallet"}`}
            onSign={() => {
              handleSign({ sigType: "extensionWallet" });
              trackEvent(TrackingEvent.TRANSACTION_SIGN_WALLET);
            }}
            onClear={() => {
              handleSign({ sigType: "extensionWallet", isClear: true });
            }}
            allowAdditional
            isDisabled={!xdrToSign || isHardwareLoading}
            isLoading={isExtensionLoading}
            successMsg={
              extensionSuccessMsg
                ? signatureCountMessage(allSigsCount.extensionWallet, "wallet")
                : ""
            }
            errorMsg={extensionErrorMsg}
          />
        </div>

        {/* Hardware wallet */}
        <div
          className="SignTransactionXdr__tabContent"
          data-type="hardwareWallet"
          data-is-visible={selectedTab === "hardwareWallet"}
        >
          <Box gap="sm" direction="row">
            <TextPicker
              id={`${id}-bip-path`}
              label="Sign with hardware wallet"
              placeholder="BIP path in format: 44'/148'/0'"
              onChange={(e) => {
                setBipPath(e.target.value);

                const error = validate.getBipPathError(e.target.value);

                if (error) {
                  setBipPathErrorMsg(error);
                } else {
                  setBipPathErrorMsg("");
                }
              }}
              error={bipPathErrorMsg}
              value={bipPath}
              rightElement={
                <>
                  <div className="InputSideElement InputSideElement--right SignTx__hardwareDropdown">
                    <Select
                      fieldSize="md"
                      id="hardware-wallet-select"
                      value={selectedHardware}
                      onChange={(
                        event: React.ChangeEvent<HTMLSelectElement>,
                      ) => {
                        setHardwareErrorMsg("");

                        setSelectedHardware(event.target.value);

                        if (event.target.value === "trezor") {
                          txHelper.prepareTrezor();
                        }
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
              setHardwareErrorMsg("");
            }}
            onClear={() => {
              handleSign({
                sigType: "hardwareWallet",
                isClear: true,
              });
              setSelectedHardware("");
              setBipPath(initBipPath);
            }}
            isLoading={isHardwareLoading}
            allowAdditional
            isDisabled={
              !selectedHardware ||
              !bipPath ||
              Boolean(bipPathErrorMsg) ||
              isExtensionLoading
            }
            successMsg={
              hardwareSuccessMsg
                ? signatureCountMessage(
                    allSigsCount.hardwareWallet,
                    "hardware wallet",
                  )
                : ""
            }
            errorMsg={hardwareErrorMsg}
          />
        </div>

        {/* Signature */}
        <div
          className="SignTransactionXdr__tabContent"
          data-type="signature"
          data-is-visible={selectedTab === "signature"}
        >
          <LabelHeading size="md">Add a signature</LabelHeading>

          <>
            {sigInputs.map((_, idx) => (
              <Box gap="xs" key={`${idx}-tx-sig`}>
                <PubKeyPickerWithSignerSelector
                  id={`${id}-${idx}-tx-sig-pubkey`}
                  placeholder="Public key"
                  label=""
                  value={sigInputs[idx]?.publicKey}
                  error={sigInputsError[idx]?.publicKey}
                  onChange={(val) =>
                    handleSignatureOnChange(val, "publicKey", idx)
                  }
                />

                <TextPicker
                  id={`${id}-${idx}-tx-sig-b64sig`}
                  placeholder="Hex encoded 64-byte ed25519 signature"
                  value={sigInputs[idx]?.signature}
                  error={sigInputsError[idx]?.signature}
                  onChange={(e) =>
                    handleSignatureOnChange(e.target.value, "signature", idx)
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
                          const newInputs = arrayItem.delete(sigInputs, idx);
                          const newErrors = arrayItem.delete(
                            sigInputsError,
                            idx,
                          );

                          updateSignatureInputsAndError(newInputs, newErrors);
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
              Use this section to add signature(s) to the transaction envelope
            </div>
          </>

          <AddSignatureButton />
        </div>
      </div>

      {customFooter ?? null}
    </div>
  );
};

const signatureCountMessage = (count: number, label = "") =>
  count === 0
    ? "No new signatures added"
    : `Successfully added ${count} ${label ? `${label} ` : ""}signature${count === 1 ? "" : "s"}`;

// =============================================================================
// Local Components
// =============================================================================
const Tab = ({
  id,
  label,
  isSelected,
  signatureCount,
  onTabChange,
}: {
  id: UniqueTabId;
  label: string;
  isSelected: boolean;
  signatureCount: number;
  onTabChange: (tabId: TxSignatureType) => void;
}) => {
  const getTabType = (tabId: UniqueTabId): TxSignatureType => {
    return tabId.split("-").pop() as TxSignatureType;
  };

  return (
    <div
      key={`tab-${id}`}
      className="SignTransactionXdr__tab"
      data-is-selected={isSelected}
      onClick={() => {
        onTabChange(getTabType(id));
      }}
    >
      <div className="SignTransactionXdr__tab__label">{label}</div>
      <div
        className="SignTransactionXdr__tab__count"
        data-is-filled={signatureCount > 0}
      >
        {signatureCount}
      </div>
    </div>
  );
};
