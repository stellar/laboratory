"use client";

import { useState } from "react";
import { Button, Icon, RadioButton, Text } from "@stellar/design-system";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";

import { AuthEntryItem } from "./AuthEntryItem";

import "./styles.scss";

type SignMode = "all" | "individual";

/**
 * Card component that orchestrates Soroban auth entry signing.
 *
 * - Collapsed: only shows header with entry count + "View auth entries"
 * - Expanded "Sign all": entry list (no per-entry signing) + one shared
 *   signing area at the bottom
 * - Expanded "Sign individually": each entry has its own embedded signing area
 *
 * @example
 * <SorobanAuthSigningCard
 *   authEntriesXdr={["AAAAAA...", "BBBBBB..."]}
 *   signedAuthEntriesXdr={[]}
 * />
 */
export const SorobanAuthSigningCard = ({
  authEntriesXdr,
  signedAuthEntriesXdr,
  builtXdr,
  onAuthSigned,
}: {
  authEntriesXdr: string[];
  signedAuthEntriesXdr: string[];
  /** The built transaction XDR — passed to SignTransactionXdr for signing. */
  builtXdr: string;
  /** Called when auth entries are signed via the shared "Sign all" mode. */
  onAuthSigned: (result: {
    signedXdr: string | null;
    successMessage: string | null;
    errorMessage: string | null;
  }) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [signMode, setSignMode] = useState<SignMode>("all");

  const entryCount = authEntriesXdr.length;
  const signedCount = signedAuthEntriesXdr.filter(Boolean).length;
  const allSigned = signedCount === entryCount && entryCount > 0;

  return (
    <div className="SorobanAuthSigning">
      {/* Header: title + "View auth entries" button */}
      <div
        className={`SorobanAuthSigning__header${isExpanded ? " SorobanAuthSigning__header--expanded" : ""}`}
      >
        <div className="SorobanAuthSigning__header-text">
          <Text
            as="div"
            size="sm"
            weight="medium"
            addlClassName="SorobanAuthSigning__header-title"
          >
            This transaction requires additional authorization signatures
          </Text>
          <Text as="div" size="sm">
            {`${entryCount} authorization ${entryCount === 1 ? "entry" : "entries"} detected`}
          </Text>
        </div>

        <Button
          size="sm"
          variant="tertiary"
          icon={isExpanded ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
          iconPosition="right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          View auth entries
        </Button>
      </div>

      {/* Body — only visible when expanded */}
      {isExpanded && (
        <div className="SorobanAuthSigning__body">
          {/* Sign mode radio */}
          <Box gap="md" direction="row">
            <RadioButton
              id="sign-mode-all"
              label="Sign all entries"
              fieldSize="sm"
              name="sign-mode"
              value="all"
              checked={signMode === "all"}
              onChange={() => setSignMode("all")}
            />
            <RadioButton
              id="sign-mode-individual"
              label="Sign individually"
              fieldSize="sm"
              name="sign-mode"
              value="individual"
              checked={signMode === "individual"}
              onChange={() => setSignMode("individual")}
            />
          </Box>

          {/* Entry list */}
          <Box gap="md">
            <div className="SorobanAuthSigning__entries">
              {authEntriesXdr.map((entryXdr, idx) => (
                <AuthEntryItem
                  key={`auth-entry-${idx}`}
                  index={idx}
                  entryXdr={entryXdr}
                  isSigned={Boolean(signedAuthEntriesXdr[idx])}
                  showSigningArea={signMode === "individual"}
                  builtXdr={builtXdr}
                  onAuthSigned={onAuthSigned}
                />
              ))}
            </div>

            {/* Shared signing area — only in "Sign all" mode */}
            {signMode === "all" && !allSigned && (
              <SignTransactionXdr
                id="auth-sign-all"
                title="Add signature to sign"
                xdrToSign={builtXdr}
                onDoneAction={onAuthSigned}
              />
            )}
          </Box>
        </div>
      )}
    </div>
  );
};
