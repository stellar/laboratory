"use client";

import { useState } from "react";
import { Button, Card, Icon, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ExpandBox } from "@/components/ExpandBox";

import { AuthEntryItem } from "./AuthEntryItem";

import "./styles.scss";

type SignMode = "all" | "individual";

/**
 * Card component that orchestrates Soroban auth entry signing.
 *
 * Shows entry count, a toggle to view auth entry details, a sign mode
 * selector (sign all vs individually), and the signing UI. When all entries
 * are signed, calls `onAuthEntriesSigned` with the signed XDR strings.
 *
 * @example
 * <SorobanAuthSigningCard
 *   authEntriesXdr={["AAAAAA...", "BBBBBB..."]}
 *   signedAuthEntriesXdr={[]}
 *   networkPassphrase="Test SDF Network ; September 2015"
 *   onSignEntry={(index, signedXdr) => { ... }}
 *   onSignAllEntries={(signedEntries) => { ... }}
 * />
 */
export const SorobanAuthSigningCard = ({
  authEntriesXdr,
  signedAuthEntriesXdr,
}: {
  authEntriesXdr: string[];
  signedAuthEntriesXdr: string[];
}) => {
  const [isEntriesVisible, setIsEntriesVisible] = useState(false);
  const [signMode, setSignMode] = useState<SignMode>("all");

  const entryCount = authEntriesXdr.length;
  const signedCount = signedAuthEntriesXdr.filter(Boolean).length;
  const allSigned = signedCount === entryCount && entryCount > 0;

  return (
    <Card>
      <div className="SorobanAuthSigning">
        {/* Header */}
        <div className="SorobanAuthSigning__header">
          <Box gap="xs">
            <Text as="div" size="sm" weight="medium">
              This transaction requires additional authorization signatures
            </Text>
            <Text as="div" size="xs">
              {`${entryCount} authorization ${entryCount === 1 ? "entry" : "entries"} detected`}
            </Text>
          </Box>

          <Button
            size="sm"
            variant="tertiary"
            icon={
              isEntriesVisible ? <Icon.ChevronUp /> : <Icon.ChevronDown />
            }
            iconPosition="right"
            onClick={() => setIsEntriesVisible(!isEntriesVisible)}
          >
            View auth entries
          </Button>
        </div>

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
            <Text as="span" size="sm">
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
            <Text as="span" size="sm">
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
            />
          ))}
        </div>

        {/* Auth entries detail (collapsible) */}
        <ExpandBox isExpanded={isEntriesVisible} offsetTop="sm">
          <Box gap="sm">
            {authEntriesXdr.map((entryXdr, index) => (
              <div
                key={`auth-detail-${index}`}
                className="SorobanAuthSigning__xdr-preview"
              >
                <Text as="div" size="xs" weight="medium">
                  {`Entry #${index + 1} XDR`}
                </Text>
                <Text as="div" size="xs">
                  {`${entryXdr.substring(0, 120)}...`}
                </Text>
              </div>
            ))}
          </Box>
        </ExpandBox>

        {/* Signing UI placeholder — AuthSignatureInput will go here */}
        {signMode === "all" && !allSigned && (
          <div className="SorobanAuthSigning__signing-area">
            <Text as="div" size="sm" weight="medium">
              Add signature to sign
            </Text>
            <Text as="div" size="xs">
              Signing UI will be wired here (AuthSignatureInput).
            </Text>
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
    </Card>
  );
};
