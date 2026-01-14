"use client";

import { Alert, Icon, Text, Tooltip } from "@stellar/design-system";
import { useContext } from "react";

import { useStore } from "@/store/useStore";
import { WindowContext } from "@/components/layout/LayoutContextProvider";

import { PageCard } from "@/components/layout/PageCard";
import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { LabelHeading } from "@/components/LabelHeading";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import {
  formatLedgersToDays,
  formatLedgersToMonths,
} from "@/helpers/formatLedgersToTime";
import { formatLargeNumber } from "@/helpers/formatLargeNumber";
import { formatFileSize } from "@/helpers/formatFileSize";
import { formatNumber } from "@/helpers/formatNumber";

import { NETWORK_LIMITS } from "@/constants/networkLimits";

import "./styles.scss";

// Stellar uses 1024 bytes as "1 KB" for fee calculations (binary, not decimal)
const BYTES_PER_KB = 1024;
const MINIMUM_RENT_WRITE_FEE_PER_1KB = 1000;

export default function NetworkLimits() {
  const { network } = useStore();

  // Get network-specific limits, fallback to mainnet if not found
  const limits = NETWORK_LIMITS[network.id] || NETWORK_LIMITS.mainnet;

  return (
    <div className="NetworkLimits">
      <PageCard heading="Network Limits">
        {network.id === "custom" ? (
          <Alert
            placement="inline"
            variant="warning"
            title="Network limits unavailable"
          >
            <Box gap="md">
              Network limit data is not available for the selected custom
              network.
              <Box gap="md" direction="row">
                <SwitchNetworkButtons
                  includedNetworks={["mainnet", "testnet", "futurenet"]}
                  buttonSize="md"
                  page="network limits"
                />
              </Box>
            </Box>
          </Alert>
        ) : (
          <>
            <Box gap="sm">
              <Text as="p" size="sm" weight="regular">
                Resource limitations and fees only apply to smart contract
                transactions. Read more about the inner workings of fees on
                Stellar in{" "}
                <SdsLink
                  href="https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering"
                  addlClassName="Link--external"
                >
                  the Fees section
                  <Icon.LinkExternal01 />
                </SdsLink>
              </Text>
            </Box>
            <Box gap="sm">
              <Text as="h2" size="md" weight="medium">
                Resource limits
              </Text>

              <Box gap="lg">
                <ResourceLimitsSection limits={limits} />
                <StateArchivalSection limits={limits} />
              </Box>
            </Box>

            <ResourceFeesSection limits={limits} />
          </>
        )}
      </PageCard>
    </div>
  );
}

const ResourceLimitsSection = ({
  limits,
}: {
  limits:
    | typeof NETWORK_LIMITS.mainnet
    | typeof NETWORK_LIMITS.testnet
    | typeof NETWORK_LIMITS.futurenet;
}) => {
  const { layoutMode } = useContext(WindowContext);

  const resourceLimits = [
    {
      setting: "Max CPU instructions",
      perTransaction: formatLargeNumber(limits.tx_max_instructions),
      ledgerWide: formatLargeNumber(limits.ledger_max_instructions),
    },
    {
      setting: "Max memory (RAM)",
      perTransaction: formatBytes(limits.tx_memory_limit),
      ledgerWide: "no explicit limit",
    },
    {
      setting: "Max number of keys in footprint",
      perTransaction: limits.tx_max_footprint_entries.toString(),
      ledgerWide: "no explicit limit",
    },
    {
      setting: "Disk reads",
      perTransaction: `${limits.tx_max_disk_read_entries} entries / ${formatBytes(limits.tx_max_disk_read_bytes)}`,
      ledgerWide: `${limits.ledger_max_disk_read_entries} entries / ${formatBytes(limits.ledger_max_disk_read_bytes)}`,
    },
    {
      setting: "Disk writes",
      perTransaction: `${limits.tx_max_write_ledger_entries} entries / ${formatBytes(limits.tx_max_write_bytes)}`,
      ledgerWide: `${limits.ledger_max_write_ledger_entries} entries / ${formatBytes(limits.ledger_max_write_bytes)}`,
    },
    {
      setting: "Transaction size",
      perTransaction: formatBytes(limits.tx_max_write_bytes),
      ledgerWide: formatBytes(limits.ledger_max_txs_size_bytes),
    },
    {
      setting: "Events + return value size",
      perTransaction: formatBytes(limits.tx_max_contract_events_size_bytes),
      ledgerWide: "no explicit limit",
    },
    {
      setting: "Individual ledger key size",
      setting_note: "contract storage key",
      perTransaction: `${limits.contract_data_key_size_bytes} bytes`,
      ledgerWide: undefined,
    },
    {
      setting: "Individual ledger entry size",
      setting_note: "including Wasm entries",
      perTransaction: formatBytes(limits.contract_max_size_bytes, "binary"),
      ledgerWide: undefined,
    },
  ];

  // Show loading state while determining layout mode
  if (!layoutMode) {
    return null;
  }

  return (
    <div className="NetworkLimits__table-container">
      {layoutMode === "desktop" ? (
        <GridTable>
          <GridTableRow>
            <GridTableCell isHeader={true}>
              <Text as="div" size="xs" weight="semi-bold">
                Network Settings
              </Text>
            </GridTableCell>
            <GridTableCell isHeader={true}>
              <LabelHeading
                size="lg"
                infoText="The maximum resources a single smart contract transaction can consume. Transactions fail if these limits are exceeded."
              >
                Per-transaction limits
              </LabelHeading>
            </GridTableCell>
            <GridTableCell isHeader={true}>
              <LabelHeading
                size="lg"
                infoText="The maximum total resources all transactions in a single ledger (block) can consume."
              >
                Ledger-wide limits
              </LabelHeading>
            </GridTableCell>
          </GridTableRow>
          <>
            {resourceLimits.map((item, index) => (
              <GridTableRow key={index}>
                <GridTableCell isRowHeader>
                  {item.setting}
                  {item.setting_note ? (
                    <Text as="div" size="xs">
                      {item.setting_note}
                    </Text>
                  ) : null}
                </GridTableCell>
                <GridTableCell
                  addlClassName={
                    item.setting_note ? "NetworkLimits__table__cell--note" : ""
                  }
                >
                  {item.perTransaction}
                </GridTableCell>
                <GridTableCell
                  isEmpty={!item.ledgerWide}
                  addlClassName={
                    item.setting_note ? "NetworkLimits__table__cell--note" : ""
                  }
                >
                  {item.ledgerWide ?? null}
                </GridTableCell>
              </GridTableRow>
            ))}
          </>
        </GridTable>
      ) : (
        <Box gap="lg">
          {/* Mobile: Per-transaction table */}
          <GridTable>
            <GridTableRow>
              <GridTableCell isHeader>
                <Text as="div" size="xs" weight="semi-bold">
                  Network Settings
                </Text>
              </GridTableCell>
              <GridTableCell isHeader>
                <LabelHeading
                  size="lg"
                  infoText="The maximum resources a single smart contract transaction can consume. Transactions fail if these limits are exceeded."
                >
                  Per-transaction limits
                </LabelHeading>
              </GridTableCell>
            </GridTableRow>

            {resourceLimits.map((item, index) => (
              <GridTableRow key={`per-${index}`}>
                <GridTableCell isRowHeader>
                  {item.setting}
                  {item.setting_note ? (
                    <Text as="div" size="xs">
                      {item.setting_note}
                    </Text>
                  ) : null}
                </GridTableCell>

                <GridTableCell
                  addlClassName={
                    item.setting_note ? "NetworkLimits__table__cell--note" : ""
                  }
                >
                  {item.perTransaction}
                </GridTableCell>
              </GridTableRow>
            ))}
          </GridTable>

          {/* Mobile: Ledger-wide table */}
          <GridTable>
            <GridTableRow>
              <GridTableCell isHeader>
                <Text as="div" size="xs" weight="semi-bold">
                  Network Settings
                </Text>
              </GridTableCell>
              <GridTableCell isHeader>
                <LabelHeading
                  size="lg"
                  infoText="The maximum total resources all transactions in a single ledger (block) can consume."
                >
                  Ledger-wide limits
                </LabelHeading>
              </GridTableCell>
            </GridTableRow>

            {resourceLimits.map((item, index) => (
              <GridTableRow key={`ledger-${index}`} isEmpty={!item.ledgerWide}>
                <GridTableCell isRowHeader>
                  {item.setting}
                  {item.setting_note ? (
                    <Text as="div" size="xs">
                      {item.setting_note}
                    </Text>
                  ) : null}
                </GridTableCell>

                <GridTableCell>{item.ledgerWide ?? null}</GridTableCell>
              </GridTableRow>
            ))}
          </GridTable>
        </Box>
      )}
    </div>
  );
};

const StateArchivalSection = ({
  limits,
}: {
  limits:
    | typeof NETWORK_LIMITS.mainnet
    | typeof NETWORK_LIMITS.testnet
    | typeof NETWORK_LIMITS.futurenet;
}) => {
  const { layoutMode } = useContext(WindowContext);
  const stateArchivalLabel =
    layoutMode === "desktop" ? "TTL extension parameter" : "TTL ext. parameter";

  const stateArchivalLimits = [
    {
      setting: "Persistent entry TTL on creation",
      value: formatLedgersToDays(limits.min_persistent_ttl),
    },
    {
      setting: "Temporary entry TTL on creation",
      value: formatLedgersToDays(limits.min_temporary_ttl),
    },
    {
      setting: "Max ledger entry TTL extension",
      value: formatLedgersToMonths(limits.max_entry_ttl),
    },
  ];

  return (
    <Box gap="sm">
      <div className="NetworkLimits__table-container">
        <GridTable>
          <GridTableRow>
            <GridTableCell>
              <Text as="div" size="xs" weight="semi-bold">
                Network Settings
              </Text>
            </GridTableCell>
            <GridTableCell>
              <LabelHeading
                size="lg"
                infoText="Defines how long ledger entries live and how much their lifetime can be extended."
              >
                {stateArchivalLabel}
              </LabelHeading>
            </GridTableCell>
          </GridTableRow>
          <>
            {stateArchivalLimits.map((item, index) => (
              <GridTableRow key={index}>
                <GridTableCell>{item.setting}</GridTableCell>
                <GridTableCell>{item.value}</GridTableCell>
              </GridTableRow>
            ))}
          </>
        </GridTable>
      </div>
    </Box>
  );
};

const ResourceFeesSection = ({
  limits,
}: {
  limits:
    | typeof NETWORK_LIMITS.mainnet
    | typeof NETWORK_LIMITS.testnet
    | typeof NETWORK_LIMITS.futurenet;
}) => {
  // Calculate max fees based on transaction limits
  const maxCpuInstructionsFee = formatNumber(
    (limits.tx_max_instructions / 10000) *
      limits.fee_rate_per_instructions_increment,
  );
  const maxReadEntriesFee = formatNumber(
    limits.tx_max_disk_read_entries * Number(limits.fee_read_ledger_entry),
  );
  const maxReadBytesFee = formatNumber(
    (limits.tx_max_disk_read_bytes / BYTES_PER_KB) *
      Number(limits.fee_read_1kb),
  );
  const maxWriteEntriesFee = formatNumber(
    limits.tx_max_write_ledger_entries * Number(limits.fee_write_ledger_entry),
  );
  const maxWriteBytesFee = formatNumber(
    (limits.tx_max_write_bytes / BYTES_PER_KB) * Number(limits.fee_write_1kb),
  );
  const maxTxSizeFee = formatNumber(
    (limits.tx_max_write_bytes / BYTES_PER_KB) * Number(limits.fee_tx_size_1kb),
  );
  const maxHistoricalFee = formatNumber(
    (limits.tx_max_write_bytes / BYTES_PER_KB) *
      Number(limits.fee_historical_1kb),
  );
  const maxEventsFee = formatNumber(
    (limits.tx_max_contract_events_size_bytes / BYTES_PER_KB) *
      Number(limits.fee_contract_events_1kb),
  );

  const resourceFeesLimits = [
    {
      setting: "10,000 CPU instructions",
      value: `${limits.fee_rate_per_instructions_increment} (${maxCpuInstructionsFee}/max tx)`,
    },
    {
      setting: "Read 1 ledger entry from disk",
      value: `${formatNumber(Number(limits.fee_read_ledger_entry))} (${maxReadEntriesFee}/max tx)`,
    },
    {
      setting: "Read 1 KB from disk",
      value: `${formatNumber(Number(limits.fee_read_1kb))} (${maxReadBytesFee}/max tx)`,
    },
    {
      setting: "Write 1 ledger entry",
      value: `${formatNumber(Number(limits.fee_write_ledger_entry))} (${maxWriteEntriesFee}/max tx)`,
    },
    {
      setting: "Write 1KB to disk",
      value: `${formatNumber(Number(limits.fee_write_1kb))} (${maxWriteBytesFee}/max tx)`,
    },
    {
      setting: "1 KB of transaction size",
      setting_note: "(bandwidth)",
      value: `${formatNumber(Number(limits.fee_tx_size_1kb))} (${maxTxSizeFee}/max tx)`,
    },
    {
      setting: "1 KB of transaction size",
      setting_note: "(history)",
      value: `${formatNumber(Number(limits.fee_historical_1kb))} (${maxHistoricalFee}/max tx)`,
    },
    {
      setting: "1 KB of Events/return value",
      value: `${formatNumber(Number(limits.fee_contract_events_1kb))} (${maxEventsFee}/max tx)`,
    },
    {
      setting: "30 days of rent for 1 KB of persistent storage",
      value: `~${getDaysOfRent(limits.persistent_rent_rate_denominator, 30, limits)}`,
      note: "the results may be slightly stale",
    },
    {
      setting: "30 days of rent for 1 KB of temporary storage",
      value: `~${getDaysOfRent(limits.temp_rent_rate_denominator, 30, limits)}`,
      note: "the results may be slightly stale",
    },
  ];

  return (
    <Box gap="sm">
      <Text as="h2" size="md" weight="medium">
        Resource fees
      </Text>

      <div className="NetworkLimits__table-container">
        <GridTable>
          <GridTableRow>
            <GridTableCell>
              <Text as="div" size="xs" weight="semi-bold">
                Network Settings
              </Text>
            </GridTableCell>
            <GridTableCell>Cost (Stroops)</GridTableCell>
          </GridTableRow>
          <>
            {resourceFeesLimits.map((item, index) => (
              <GridTableRow key={index}>
                <GridTableCell>
                  {item.setting}{" "}
                  {item.setting_note ? (
                    <Text as="div" size="xs" addlClassName="desktop--inline">
                      {item.setting_note}
                    </Text>
                  ) : null}
                </GridTableCell>
                <GridTableCell
                  addlClassName={
                    item.note || item.setting_note
                      ? "NetworkLimits__table__cell--note"
                      : ""
                  }
                >
                  {item.value}{" "}
                  {item.note ? (
                    <Tooltip
                      triggerEl={
                        <div className="Label__infoButton" role="button">
                          <Icon.InfoCircle />
                        </div>
                      }
                    >
                      {item.note}
                    </Tooltip>
                  ) : null}
                </GridTableCell>
              </GridTableRow>
            ))}
          </>
        </GridTable>
      </div>
    </Box>
  );
};

// // =============================================================================
// // Components
// // =============================================================================
const GridTable = ({ children }: { children: React.ReactNode }) => (
  <div className="NetworkLimits__table" role="table">
    {children}
  </div>
);

const GridTableRow = ({
  children,
  isEmpty,
}: {
  children: React.ReactNode;
  isEmpty?: boolean;
}) => (
  <div
    className={`NetworkLimits__table__row ${isEmpty ? "is--empty " : ""}`}
    role="row"
  >
    {children}
  </div>
);

const GridTableCell = ({
  children,
  isEmpty,
  isHeader,
  isRowHeader,
  addlClassName,
}: {
  children: React.ReactNode | React.ReactNode[] | null;
  isEmpty?: boolean;
  isHeader?: boolean;
  isRowHeader?: boolean;
  addlClassName?: string;
}) => {
  let role: "cell" | "columnheader" | "rowheader" = "cell";

  if (isHeader) {
    role = "columnheader";
  }

  if (isRowHeader) {
    role = "rowheader";
  }
  return (
    <div
      className={`NetworkLimits__table__cell ${isEmpty ? "is--empty " : ""} ${addlClassName || ""}`}
      role={role}
    >
      {children}
    </div>
  );
};

// =============================================================================
// Helpers
// =============================================================================

const formatBytes = (bytes: number, unit: "binary" | "decimal" = "decimal") => {
  return formatFileSize(bytes, unit);
};

/**
 * Computes the rent write fee per 1KB based on current Soroban state size.
 * Ported from: https://github.com/stellar/rs-soroban-env/blob/main/soroban-env-host/src/fees.rs
 */
const computeRentWriteFeePerKb = (
  sorobanStateSizeBytes: number,
  stateTargetSizeBytes: number,
  rentFee1kbStateSizeLow: number,
  rentFee1kbStateSizeHigh: number,
  stateSizeRentFeeGrowthFactor: number,
): number => {
  const feeRateMultiplier = rentFee1kbStateSizeHigh - rentFee1kbStateSizeLow;

  let rentWriteFeePerKb: number;

  if (sorobanStateSizeBytes < stateTargetSizeBytes) {
    // Below target: linear interpolation
    rentWriteFeePerKb = Math.ceil(
      (feeRateMultiplier * sorobanStateSizeBytes) /
        Math.max(stateTargetSizeBytes, 1),
    );
    rentWriteFeePerKb += rentFee1kbStateSizeLow;
  } else {
    // At or above target: use high fee + growth factor
    rentWriteFeePerKb = rentFee1kbStateSizeHigh;
    const bucketListSizeAfterReachingTarget =
      sorobanStateSizeBytes - stateTargetSizeBytes;
    const postTargetFee = Math.ceil(
      (feeRateMultiplier *
        bucketListSizeAfterReachingTarget *
        stateSizeRentFeeGrowthFactor) /
        Math.max(stateTargetSizeBytes, 1),
    );
    rentWriteFeePerKb += postTargetFee;
  }

  return Math.max(rentWriteFeePerKb, MINIMUM_RENT_WRITE_FEE_PER_1KB);
};

const getDaysOfRent = (
  rent_denominator: string,
  days: number,
  limits:
    | typeof NETWORK_LIMITS.mainnet
    | typeof NETWORK_LIMITS.testnet
    | typeof NETWORK_LIMITS.futurenet,
) => {
  const {
    live_soroban_state_size_window,
    state_target_size_bytes,
    rent_fee_1kb_state_size_low,
    rent_fee_1kb_state_size_high,
    state_size_rent_fee_growth_factor,
  } = limits;
  const ledgers_per_day = 86400 / 5; // 1 ledger every 5 seconds
  const rent_ledgers = days * ledgers_per_day;
  const entry_size_bytes = BYTES_PER_KB;

  // Calculate average Soroban state size from the live state window
  const avgStateSizeBytes =
    live_soroban_state_size_window.reduce((sum, val) => sum + Number(val), 0) /
    live_soroban_state_size_window.length;

  // Compute fee_per_rent_1kb dynamically based on network state
  const fee_per_rent_1kb = computeRentWriteFeePerKb(
    avgStateSizeBytes,
    Number(state_target_size_bytes),
    Number(rent_fee_1kb_state_size_low),
    Number(rent_fee_1kb_state_size_high),
    state_size_rent_fee_growth_factor,
  );

  // Formula from soroban-env-host/src/fees.rs rent_fee_for_size_and_ledgers:
  // rent_fee = (entry_size × fee_per_rent_1kb × rent_ledgers) / (1024 × storage_rate_denominator)
  const rent =
    (entry_size_bytes * fee_per_rent_1kb * rent_ledgers) /
    (BYTES_PER_KB * Number(rent_denominator));

  // Note: The Rust implementation uses ceiling division (div_ceil)
  return formatNumber(Math.ceil(rent));
};
