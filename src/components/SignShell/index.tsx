"use client";

import { useState } from "react";
import { Button, Icon, Select, Text } from "@stellar/design-system";

import { MultiPicker } from "@/components/FormElements/MultiPicker";
import { Box } from "@/components/layout/Box";
import { MessageField } from "@/components/MessageField";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { LabelHeading } from "@/components/LabelHeading";

import { validate } from "@/validate";

import "./styles.scss";

export type SignSourceType =
  | "secretKey"
  | "extensionWallet"
  | "hardwareWallet"
  | "signature";

type UniqueTabId = `${string}-${SignSourceType}`;

/**
 * Result of a signing action. The consumer owns the actual signature/output and
 * returns only the messages + badge count for the shell to display.
 */
export type SignActionResult = {
  successMessage?: string;
  errorMessage?: string;
  /** Tab badge count. Defaults to 1 on success, 0 on clear. */
  count?: number;
};

type SecretKeyConfig = {
  onSign: (secretKeys: string[]) => Promise<SignActionResult>;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
  /** Max number of secret-key inputs (omit for unlimited). */
  limit?: number;
};

type ExtensionConfig = {
  onSign: () => Promise<SignActionResult>;
  onClear?: () => void;
  label?: string;
};

type HardwareConfig = {
  onSign: (opts: {
    bipPath: string;
    device: string;
  }) => Promise<SignActionResult>;
  onClear?: () => void;
  note?: (device: string) => string | undefined;
};

const DEFAULT_TAB_LABELS: Record<SignSourceType, string> = {
  secretKey: "Sign with secret key",
  extensionWallet: "Wallet extension",
  hardwareWallet: "Hardware wallet",
  signature: "Transaction envelope",
};

const INIT_BIP_PATH = "44'/148'/0'";

/**
 * Generic presentational shell for signing flows. Owns the tab chrome, the
 * secret-key / wallet / hardware inputs, button + message state, and per-tab
 * badge counts. Has no knowledge of transactions, XDR, or SEP-53 — the actual
 * signing is delegated to the `onSign` handlers in each tab config.
 *
 * Consumers compose it with a "strategy": `SignTransactionXdr` (envelope
 * signing) and `SignMessage` (SEP-53) both render through this shell.
 */
export const SignShell = ({
  id,
  title,
  description,
  isDisabled = false,
  tabs,
  tabLabels,
  defaultTab,
  secretKey,
  extension,
  hardware,
  hardwareUnsupportedNote,
  signatureTab,
  customFooter,
}: {
  id: string;
  title?: string;
  description?: string;
  isDisabled?: boolean;
  tabs: SignSourceType[];
  tabLabels?: Partial<Record<SignSourceType, string>>;
  defaultTab?: SignSourceType;
  secretKey?: SecretKeyConfig;
  extension?: ExtensionConfig;
  hardware?: HardwareConfig;
  /** Note shown in the hardware tab when hardware signing is unsupported. */
  hardwareUnsupportedNote?: string;
  /** Custom body + badge count for the "signature" (paste) tab. */
  signatureTab?: { node: React.ReactNode; count: number };
  customFooter?: React.ReactNode;
}) => {
  const [selectedTab, setSelectedTab] = useState<SignSourceType>(
    defaultTab ?? tabs[0],
  );

  const [counts, setCounts] = useState<Record<SignSourceType, number>>({
    secretKey: 0,
    extensionWallet: 0,
    hardwareWallet: 0,
    signature: 0,
  });

  // Secret key
  const [secretKeyInputs, setSecretKeyInputs] = useState<string[]>([""]);
  const [secretKeySuccessMsg, setSecretKeySuccessMsg] = useState("");
  const [secretKeyErrorMsg, setSecretKeyErrorMsg] = useState("");

  // Extension wallet
  const [isExtensionLoading, setIsExtensionLoading] = useState(false);
  const [extensionSuccessMsg, setExtensionSuccessMsg] = useState("");
  const [extensionErrorMsg, setExtensionErrorMsg] = useState("");

  // Hardware wallet
  const [bipPath, setBipPath] = useState(INIT_BIP_PATH);
  const [bipPathErrorMsg, setBipPathErrorMsg] = useState("");
  const [selectedHardware, setSelectedHardware] = useState("");
  const [isHardwareLoading, setIsHardwareLoading] = useState(false);
  const [hardwareSuccessMsg, setHardwareSuccessMsg] = useState("");
  const [hardwareErrorMsg, setHardwareErrorMsg] = useState("");

  const labelFor = (type: SignSourceType) =>
    tabLabels?.[type] ?? DEFAULT_TAB_LABELS[type];

  const applyResult = (type: SignSourceType, result: SignActionResult) => {
    const success = result.successMessage ?? "";
    const error = result.errorMessage ?? "";
    const count = error ? 0 : (result.count ?? 1);

    setCounts((prev) => ({ ...prev, [type]: count }));

    return { success, error };
  };

  // --- Secret key ---------------------------------------------------------
  const HAS_SECRET_KEYS = secretKeyInputs.some((input) => input !== "");
  const HAS_INVALID_SECRET_KEYS = secretKeyInputs.some((input) =>
    input.length ? Boolean(validate.getSecretKeyError(input)) : false,
  );

  const clearSecretKey = () => {
    setSecretKeySuccessMsg("");
    setSecretKeyErrorMsg("");
    setCounts((prev) => ({ ...prev, secretKey: 0 }));
    secretKey?.onClear?.();
  };

  const signSecretKey = async () => {
    if (!secretKey) {
      return;
    }

    const result = await secretKey.onSign(secretKeyInputs);
    const { success, error } = applyResult("secretKey", result);

    setSecretKeySuccessMsg(success);
    setSecretKeyErrorMsg(error);
  };

  // --- Extension wallet ---------------------------------------------------
  const clearExtension = () => {
    setExtensionSuccessMsg("");
    setExtensionErrorMsg("");
    setCounts((prev) => ({ ...prev, extensionWallet: 0 }));
    extension?.onClear?.();
  };

  const signExtension = async () => {
    if (!extension) {
      return;
    }

    setIsExtensionLoading(true);

    try {
      const result = await extension.onSign();
      const { success, error } = applyResult("extensionWallet", result);

      setExtensionSuccessMsg(success);
      setExtensionErrorMsg(error);
    } finally {
      setIsExtensionLoading(false);
    }
  };

  // --- Hardware wallet ----------------------------------------------------
  const clearHardware = () => {
    setHardwareSuccessMsg("");
    setHardwareErrorMsg("");
    setSelectedHardware("");
    setBipPath(INIT_BIP_PATH);
    setCounts((prev) => ({ ...prev, hardwareWallet: 0 }));
    hardware?.onClear?.();
  };

  const signHardware = async () => {
    if (!hardware) {
      return;
    }

    setIsHardwareLoading(true);

    try {
      const result = await hardware.onSign({
        bipPath,
        device: selectedHardware,
      });
      const { success, error } = applyResult("hardwareWallet", result);

      setHardwareSuccessMsg(success);
      setHardwareErrorMsg(error);
    } finally {
      setIsHardwareLoading(false);
    }
  };

  return (
    <div
      className="SignShell"
      data-is-disabled={isDisabled}
      data-testid={`sign-shell-${id}`}
    >
      <Box gap="md" direction="column">
        {title ? (
          <Text
            as="div"
            size="sm"
            weight="medium"
            addlClassName="SignShell__title"
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
        <div className="SignShell__tabsContainer">
          {tabs.map((type) => (
            <Tab
              key={`${id}-${type}`}
              id={`${id}-${type}`}
              label={labelFor(type)}
              isSelected={selectedTab === type}
              signatureCount={
                type === "signature"
                  ? (signatureTab?.count ?? 0)
                  : counts[type]
              }
              onTabChange={(tabId) => setSelectedTab(tabId)}
            />
          ))}
        </div>
      </Box>

      {/* Tabs content */}
      <div className="SignShell__tabsContent">
        {/* Secret key */}
        {tabs.includes("secretKey") && secretKey ? (
          <div
            className="SignShell__tabContent"
            data-type="secretKey"
            data-is-visible={selectedTab === "secretKey"}
          >
            <MultiPicker
              id={`${id}-signer`}
              label={secretKey.label ?? labelFor("secretKey")}
              value={secretKeyInputs}
              onChange={(val) => {
                if (secretKeySuccessMsg || secretKeyErrorMsg) {
                  clearSecretKey();
                }

                setSecretKeyInputs(val);
              }}
              validate={validate.getSecretKeyError}
              placeholder={
                secretKey.placeholder ??
                "Secret key (starting with S) or hash preimage (in hex)"
              }
              autocomplete="off"
              isPassword
              useSecretSelector
              limit={secretKey.limit}
              hideAddButton={secretKey.limit === 1}
              submitButton={
                <SignButton
                  onSign={signSecretKey}
                  onClear={() => {
                    clearSecretKey();
                    setSecretKeyInputs([""]);
                  }}
                  isDisabled={
                    isDisabled || !HAS_SECRET_KEYS || HAS_INVALID_SECRET_KEYS
                  }
                  successMsg={secretKeySuccessMsg}
                  errorMsg={secretKeyErrorMsg}
                />
              }
            />
          </div>
        ) : null}

        {/* Wallet extension */}
        {tabs.includes("extensionWallet") && extension ? (
          <div
            className="SignShell__tabContent"
            data-type="extensionWallet"
            data-is-visible={selectedTab === "extensionWallet"}
          >
            <LabelHeading size="md">Sign with wallet extension</LabelHeading>

            <SignButton
              label={extension.label ?? "Sign with wallet"}
              onSign={signExtension}
              onClear={clearExtension}
              isDisabled={isDisabled}
              isLoading={isExtensionLoading}
              successMsg={extensionSuccessMsg}
              errorMsg={extensionErrorMsg}
            />
          </div>
        ) : null}

        {/* Hardware wallet */}
        {tabs.includes("hardwareWallet") ? (
          <div
            className="SignShell__tabContent"
            data-type="hardwareWallet"
            data-is-visible={selectedTab === "hardwareWallet"}
          >
            {hardware ? (
              <>
                <Box gap="sm" direction="row">
                  <TextPicker
                    id={`${id}-bip-path`}
                    label="Sign with hardware wallet"
                    placeholder="BIP path in format: 44'/148'/0'"
                    onChange={(e) => {
                      setBipPath(e.target.value);
                      setBipPathErrorMsg(
                        validate.getBipPathError(e.target.value) || "",
                      );
                    }}
                    error={bipPathErrorMsg}
                    value={bipPath}
                    note={hardware.note?.(selectedHardware)}
                    rightElement={
                      <div className="InputSideElement InputSideElement--right SignTx__hardwareDropdown">
                        <Select
                          fieldSize="md"
                          id="hardware-wallet-select"
                          value={selectedHardware}
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            if (hardwareSuccessMsg || hardwareErrorMsg) {
                              clearHardware();
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
                    }
                  />
                </Box>

                <SignButton
                  onSign={signHardware}
                  onClear={clearHardware}
                  isDisabled={isDisabled || !selectedHardware || !bipPath}
                  isLoading={isHardwareLoading}
                  successMsg={hardwareSuccessMsg}
                  errorMsg={hardwareErrorMsg}
                />
              </>
            ) : (
              <div className="FieldNote FieldNote--note FieldNote--md">
                {hardwareUnsupportedNote ??
                  "Hardware wallet signing is not supported here."}
              </div>
            )}
          </div>
        ) : null}

        {/* Signature (paste) — consumer-provided body */}
        {tabs.includes("signature") && signatureTab ? (
          <div
            className="SignShell__tabContent"
            data-type="signature"
            data-is-visible={selectedTab === "signature"}
          >
            {signatureTab.node}
          </div>
        ) : null}
      </div>

      {customFooter ?? null}
    </div>
  );
};

// =============================================================================
// Local components
// =============================================================================
const SignButton = ({
  label = "Sign",
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
}) => (
  <Box gap="md" direction="row" align="center" wrap="wrap">
    {successMsg ? (
      <Button
        size="md"
        variant="error"
        icon={<Icon.RefreshCw01 />}
        iconPosition="right"
        onClick={onClear}
      >
        Clear
      </Button>
    ) : (
      <Button
        disabled={isDisabled}
        size="md"
        variant="secondary"
        onClick={onSign}
        isLoading={isLoading}
      >
        {label}
      </Button>
    )}

    {successMsg || errorMsg ? (
      <MessageField
        message={successMsg || errorMsg}
        isError={Boolean(errorMsg)}
      />
    ) : null}
  </Box>
);

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
  onTabChange: (tabId: SignSourceType) => void;
}) => {
  const getTabType = (tabId: UniqueTabId): SignSourceType =>
    tabId.split("-").pop() as SignSourceType;

  return (
    <div
      key={`tab-${id}`}
      className="SignShell__tab"
      data-is-selected={isSelected}
      onClick={() => onTabChange(getTabType(id))}
    >
      <div className="SignShell__tab__label">{label}</div>
      <div
        className="SignShell__tab__count"
        data-is-filled={signatureCount > 0}
      >
        {signatureCount}
      </div>
    </div>
  );
};
