"use client";

import { Button, Icon, Text } from "@stellar/design-system";
import { xdr } from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

type AuthEntryInfo = {
  credentialsType: string;
  contractId?: string;
  functionName?: string;
};

/**
 * A single auth entry row matching the Figma design: bordered row with
 * "Entry #N" label, Unsigned/Signed badge, and a chevron to expand details.
 *
 * The `isExpanded` prop is controlled by the parent's "View auth entries"
 * toggle — when true, the entry shows its detail section (credentials type,
 * contract ID, function name).
 *
 * @example
 * <AuthEntryItem index={0} entryXdr="AAAAAA..." isSigned={false} isExpanded={false} />
 */
export const AuthEntryItem = ({
  index,
  entryXdr,
  isSigned,
  isExpanded,
}: {
  index: number;
  entryXdr: string;
  isSigned: boolean;
  isExpanded: boolean;
}) => {
  const info = parseAuthEntryInfo(entryXdr);

  return (
    <div
      className="SorobanAuthSigning__entry"
      data-is-expanded={isExpanded || undefined}
    >
      <div className="SorobanAuthSigning__entry-header">
        <div className="SorobanAuthSigning__entry-label">
          <Text as="span" size="sm" weight="medium">
            {`Entry #${index + 1}`}
          </Text>
          <span
            className="SorobanAuthSigning__badge"
            data-variant={isSigned ? "signed" : "unsigned"}
          >
            {isSigned ? "Signed" : "Unsigned"}
          </span>
        </div>
        <Button
          size="sm"
          variant="tertiary"
          icon={isExpanded ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
        />
      </div>

      {isExpanded && (
        <div className="SorobanAuthSigning__entry-details">
          <AuthEntryInfoRow
            label="Credentials type"
            value={info.credentialsType}
          />
          {info.contractId && (
            <AuthEntryInfoRow
              label="Contract ID"
              value={shortenStellarAddress(info.contractId)}
            />
          )}
          {info.functionName && (
            <AuthEntryInfoRow label="Function" value={info.functionName} />
          )}
          <div className="SorobanAuthSigning__entry-xdr">
            <Text as="div" size="xs" weight="medium">
              Raw XDR
            </Text>
            <Text as="div" size="xs">
              {`${entryXdr.substring(0, 80)}...`}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Parses a base64-encoded SorobanAuthorizationEntry XDR to extract
 * human-readable info for display.
 *
 * @param entryXdr - Base64-encoded SorobanAuthorizationEntry
 * @returns Parsed info with credentials type, contract ID, and function name
 */
const parseAuthEntryInfo = (entryXdr: string): AuthEntryInfo => {
  const info: AuthEntryInfo = { credentialsType: "unknown" };

  try {
    const entry = xdr.SorobanAuthorizationEntry.fromXDR(entryXdr, "base64");
    const credentials = entry.credentials();

    if (
      credentials.switch().name === "sorobanCredentialsSourceAccount" ||
      credentials.switch().value === 0
    ) {
      info.credentialsType = "Source Account";
    } else {
      info.credentialsType = "Address";

      try {
        const rootInvocation = entry.rootInvocation();
        const contractFn = rootInvocation.function();

        if (
          contractFn.switch().name ===
          "sorobanAuthorizedFunctionTypeContractFn"
        ) {
          const invokeContract = contractFn.contractFn();
          const contractIdBuf = invokeContract.contractAddress().contractId();
          info.contractId = Array.from(contractIdBuf as unknown as Uint8Array)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          info.functionName = invokeContract.functionName().toString();
        }
      } catch {
        // Parsing inner details may fail for complex entries
      }
    }
  } catch {
    // If XDR parsing fails, show "unknown"
  }

  return info;
};

const AuthEntryInfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <Box gap="xs" direction="row" justify="space-between">
    <Text as="div" size="xs">
      {label}
    </Text>
    <Text as="div" size="xs" weight="medium">
      {value}
    </Text>
  </Box>
);
