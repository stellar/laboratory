"use client";

import { Alert, Icon, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

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
                transactions.{" "}
                <SdsLink
                  href="https://developers.stellar.org/docs/networks/resource-limits-fees"
                  addlClassName="Link--external"
                >
                  Learn more
                  <Icon.LinkExternal01 />
                </SdsLink>
              </Text>
            </Box>
            <Box gap="sm">
              <Text as="h3" size="md" weight="medium">
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
      perTransaction: `${limits.contract_data_key_size_bytes} bytes`,
      ledgerWide: undefined,
    },
    {
      setting: "Individual ledger entry size",
      perTransaction: formatBytes(limits.contract_max_size_bytes),
      ledgerWide: undefined,
    },
  ];

  return (
    <div className="NetworkLimits__table-container">
      <GridTable>
        <GridTableRow isHeader={true}>
          <GridTableCell>
            <Text as="div" size="xs" weight="semi-bold">
              Network Settings
            </Text>
          </GridTableCell>
          <GridTableCell>
            <LabelHeading
              size="lg"
              infoText="The maximum resources a single smart contract transaction can consume. Transactions fail if these limits are exceeded."
            >
              Per-transaction limits
            </LabelHeading>
          </GridTableCell>
          <GridTableCell>
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
              <GridTableCell>{item.setting}</GridTableCell>
              <GridTableCell>{item.perTransaction}</GridTableCell>
              <GridTableCell>{item.ledgerWide || "—"}</GridTableCell>
            </GridTableRow>
          ))}
        </>
      </GridTable>
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
          <GridTableRow isHeader={true}>
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
                TTL extension parameter
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
    (limits.tx_max_disk_read_bytes / 1024) * Number(limits.fee_read_1kb),
  );
  const maxWriteEntriesFee = formatNumber(
    limits.tx_max_write_ledger_entries * Number(limits.fee_write_ledger_entry),
  );
  const maxTxSizeFee = formatNumber(
    (limits.tx_max_write_bytes / 1024) * Number(limits.fee_tx_size_1kb),
  );
  const maxHistoricalFee = formatNumber(
    (limits.tx_max_write_bytes / 1024) * Number(limits.fee_historical_1kb),
  );
  const maxEventsFee = formatNumber(
    (limits.tx_max_contract_events_size_bytes / 1024) *
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
      setting: "1 KB of transaction size (bandwidth)",
      value: `${formatNumber(Number(limits.fee_tx_size_1kb))} (${maxTxSizeFee}/max tx)`,
    },
    {
      setting: "1 KB of transaction size (history)",
      value: `${formatNumber(Number(limits.fee_historical_1kb))} (${maxHistoricalFee}/max tx)`,
    },
    {
      setting: "1 KB of Events/return value",
      value: `${formatNumber(Number(limits.fee_contract_events_1kb))} (${maxEventsFee}/max tx)`,
    },
    {
      setting: "30 days of rent for 1 KB of persistent storage",
      value: `~${getDaysOfRent(limits.fee_write_1kb, limits.persistent_rent_rate_denominator, 30)}`,
    },
    {
      setting: "30 days of rent for 1 KB of temporary storage",
      value: `~${getDaysOfRent(limits.fee_write_1kb, limits.temp_rent_rate_denominator, 30)}`,
    },
  ];

  return (
    <Box gap="sm">
      <Text as="h3" size="md" weight="medium">
        Resource fees
      </Text>

      <div className="NetworkLimits__table-container">
        <GridTable>
          <GridTableRow isHeader={true}>
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

// // =============================================================================
// // Components
// // =============================================================================
const GridTable = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => (
  <div className="NetworkLimits__table" role="table">
    {children}
  </div>
);

const GridTableRow = ({
  children,
  isHeader,
}: {
  children: React.ReactElement[];
  isHeader?: boolean;
}) => (
  <div
    className="NetworkLimits__table__row"
    role="row"
    {...(isHeader ? { "data-is-header": true } : {})}
  >
    {children}
  </div>
);

const GridTableCell = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[] | null;
}) => (
  <div className="NetworkLimits__table__cell" role="cell">
    {children}
  </div>
);

// // =============================================================================
// // Helpers
// // =============================================================================

const formatBytes = (bytes: number) => formatFileSize(bytes);

const getDaysOfRent = (
  write_fee_1kb: number,
  rent_denominator: string,
  days: number,
) => {
  const ledgers_per_day = 86400 / 5; // 1 ledger every 5 seconds
  const rent =
    write_fee_1kb * (ledgers_per_day / Number(rent_denominator)) * days;
  return formatNumber(rent);
};
