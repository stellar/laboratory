"use client";

import { useState } from "react";
import { Button, Icon } from "@stellar/design-system";

import { MultiPicker } from "@/components/FormElements/MultiPicker";
import { Box } from "@/components/layout/Box";
import { MessageField } from "@/components/MessageField";
import { LabelHeading } from "@/components/LabelHeading";

import { validate } from "@/validate";

import "./styles.scss";

export type SignSourceType = "secretKey" | "extensionWallet" | "hardwareWallet";

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

const TAB_LABELS: Record<SignSourceType, string> = {
  secretKey: "Sign with secret key",
  extensionWallet: "Wallet extension",
  hardwareWallet: "Hardware wallet",
};

/**
 * Presentational shell for signing flows. Owns the tab chrome, the secret-key
 * and wallet inputs, button + message state, and per-tab badge counts. Has no
 * knowledge of transactions, XDR, or SEP-53 — the actual signing is delegated
 * to the `onSign` handlers in each tab config.
 *
 * Currently composed by `SignMessage` (SEP-53). The hardware tab renders a
 * "not supported" note; hardware signing is not implemented here.
 */
export const SignShell = ({
  id,
  isDisabled = false,
  tabs,
  secretKey,
  extension,
  hardwareUnsupportedNote,
}: {
  id: string;
  isDisabled?: boolean;
  tabs: SignSourceType[];
  secretKey?: SecretKeyConfig;
  extension?: ExtensionConfig;
  /** Note shown in the hardware tab, which has no signing implementation. */
  hardwareUnsupportedNote?: string;
}) => {
  const [selectedTab, setSelectedTab] = useState<SignSourceType>(tabs[0]);

  const [counts, setCounts] = useState<Record<SignSourceType, number>>({
    secretKey: 0,
    extensionWallet: 0,
    hardwareWallet: 0,
  });

  // Secret key
  const [secretKeyInputs, setSecretKeyInputs] = useState<string[]>([""]);
  const [secretKeySuccessMsg, setSecretKeySuccessMsg] = useState("");
  const [secretKeyErrorMsg, setSecretKeyErrorMsg] = useState("");

  // Extension wallet
  const [isExtensionLoading, setIsExtensionLoading] = useState(false);
  const [extensionSuccessMsg, setExtensionSuccessMsg] = useState("");
  const [extensionErrorMsg, setExtensionErrorMsg] = useState("");

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

  return (
    <div
      className="SignShell"
      data-is-disabled={isDisabled}
      data-testid={`sign-shell-${id}`}
    >
      <Box gap="md" direction="column">
        {/* Tabs */}
        <div className="SignShell__tabsContainer">
          {tabs.map((type) => (
            <Tab
              key={`${id}-${type}`}
              id={`${id}-${type}`}
              label={TAB_LABELS[type]}
              isSelected={selectedTab === type}
              count={counts[type]}
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
              label={secretKey.label ?? TAB_LABELS.secretKey}
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

        {/* Hardware wallet — note only, no signing implementation */}
        {tabs.includes("hardwareWallet") ? (
          <div
            className="SignShell__tabContent"
            data-type="hardwareWallet"
            data-is-visible={selectedTab === "hardwareWallet"}
          >
            <div className="FieldNote FieldNote--note FieldNote--md">
              {hardwareUnsupportedNote ??
                "Hardware wallet signing is not supported here."}
            </div>
          </div>
        ) : null}
      </div>
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
  count,
  onTabChange,
}: {
  id: UniqueTabId;
  label: string;
  isSelected: boolean;
  count: number;
  onTabChange: (tabId: SignSourceType) => void;
}) => {
  const getTabType = (tabId: UniqueTabId): SignSourceType =>
    tabId.split("-").pop() as SignSourceType;

  return (
    <div
      key={`tab-${id}`}
      className="SignShell__tab"
      data-is-selected={isSelected}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onClick={() => onTabChange(getTabType(id))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTabChange(getTabType(id));
        }
      }}
    >
      <div className="SignShell__tab__label">{label}</div>
      <div className="SignShell__tab__count" data-is-filled={count > 0}>
        {count}
      </div>
    </div>
  );
};
