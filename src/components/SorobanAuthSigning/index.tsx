"use client";

import { useState } from "react";
import { Button, Icon, Text } from "@stellar/design-system";

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
}: {
  authEntriesXdr: string[];
  signedAuthEntriesXdr: string[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [signMode, setSignMode] = useState<SignMode>("all");

  const entryCount = authEntriesXdr.length;
  const signedCount = signedAuthEntriesXdr.filter(Boolean).length;
  const allSigned = signedCount === entryCount && entryCount > 0;

  return (
    <div className="SorobanAuthSigning">
      {/* Header: title + "View auth entries" button */}
      <div className="SorobanAuthSigning__header">
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
          <div className="SorobanAuthSigning__sign-mode">
            <label className="SorobanAuthSigning__radio">
              <input
                type="radio"
                name="sign-mode"
                value="all"
                checked={signMode === "all"}
                onChange={() => setSignMode("all")}
              />
              <Text as="span" size="xs" weight="bold">
                Sign all entries
              </Text>
            </label>
            <label className="SorobanAuthSigning__radio">
              <input
                type="radio"
                name="sign-mode"
                value="individual"
                checked={signMode === "individual"}
                onChange={() => setSignMode("individual")}
              />
              <Text as="span" size="xs" weight="bold">
                Sign individually
              </Text>
            </label>
          </div>

          {/* Entry list */}
          <div className="SorobanAuthSigning__entries">
            {authEntriesXdr.map((entryXdr, index) => (
              <AuthEntryItem
                key={`auth-entry-${index}`}
                index={index}
                entryXdr={entryXdr}
                isSigned={Boolean(signedAuthEntriesXdr[index])}
                showSigningArea={signMode === "individual"}
              />
            ))}
          </div>

          {/* Shared signing area — only in "Sign all" mode */}
          {signMode === "all" && !allSigned && (
            <div className="SorobanAuthSigning__signing-area">
              <Text as="div" size="sm" weight="medium">
                Add signature to sign
              </Text>
              <Box gap="sm">
                <Text as="div" size="xs">
                  Signing UI will be wired here (AuthSignatureInput).
                </Text>
              </Box>
            </div>
          )}

          {allSigned && (
            <div className="SorobanAuthSigning__signed-status">
              <Text as="div" size="sm" weight="medium">
                All authorization entries signed
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
