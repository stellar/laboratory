#!/usr/bin/env node

/**
 * Fetch Stellar network transaction limits from RPC endpoints
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_FILE = "scripts/fetch-network-limits.mjs";

const NETWORKS = [
  {
    name: "mainnet",
    rpcUrl: "https://mainnet.sorobanrpc.com",
  },
  {
    name: "testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
  },
  {
    name: "futurenet",
    rpcUrl: "https://rpc-futurenet.stellar.org",
  },
];

const LEDGER_ENTRY_KEYS = [
  "AAAACAAAAAA=", // contract_max_size_bytes
  "AAAACAAAAAE=", // contract_compute_v0
  "AAAACAAAAAI=", // contract_ledger_cost_v0
  "AAAACAAAAAM=", // contract_historical_data_v0
  "AAAACAAAAAQ=", // contract_events_v0
  "AAAACAAAAAU=", // contract_bandwidth_v0
  "AAAACAAAAAY=", // contract_cost_params_cpu_instructions
  "AAAACAAAAAc=", // contract_cost_params_memory_bytes
  "AAAACAAAAAg=", // contract_data_key_size_bytes
  "AAAACAAAAAk=", // contract_data_entry_size_bytes
  "AAAACAAAAAo=", // state_archival
  "AAAACAAAAAs=", // contract_execution_lanes
  "AAAACAAAAA4=", // contract_parallel_compute_v0
  "AAAACAAAAA8=", // contract_ledger_cost_ext_v0
  "AAAACAAAABA=", // scp_timing
  "AAAACAAAAAw=", // live_soroban_state_size_window
];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const fetchLedgerEntries = async (rpcUrl, retryCount = 0) => {
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getLedgerEntries",
        params: {
          keys: LEDGER_ENTRY_KEYS,
          xdrFormat: "json",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(
        `RPC error: ${data.error.message || JSON.stringify(data.error)}`,
      );
    }

    return data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.warn(
        `  ⚠️  Attempt ${retryCount + 1}/${MAX_RETRIES + 1} failed: ${error.message}`,
      );
      console.log(`  ⏳ Retrying in ${RETRY_DELAY_MS}ms...`);
      await sleep(RETRY_DELAY_MS);
      return fetchLedgerEntries(rpcUrl, retryCount + 1);
    }
    throw error;
  }
};

const getNetworkLimitsFromResponse = (response) => {
  const entries = response?.result?.entries || [];

  const findEntry = (configSettingId) =>
    entries.find(
      (entry) =>
        entry?.keyJson?.config_setting?.config_setting_id === configSettingId,
    );

  const computeEntry = findEntry("contract_compute_v0");
  const ledgerCostEntry = findEntry("contract_ledger_cost_v0");
  const ledgerCostExtEntry = findEntry("contract_ledger_cost_ext_v0");
  const eventsEntry = findEntry("contract_events_v0");
  const dataKeySizeEntry = findEntry("contract_data_key_size_bytes");
  const maxSizeEntry = findEntry("contract_max_size_bytes");
  const stateArchivalEntry = findEntry("state_archival");
  const bandwidthEntry = findEntry("contract_bandwidth_v0");
  const historicalDataEntry = findEntry("contract_historical_data_v0");
  const liveSorobanStateSizeWindowEntry = findEntry(
    "live_soroban_state_size_window",
  );

  return {
    // Per-transaction limits
    tx_max_instructions: Number(
      computeEntry?.dataJson?.config_setting?.contract_compute_v0
        ?.tx_max_instructions,
    ),
    tx_memory_limit:
      computeEntry?.dataJson?.config_setting?.contract_compute_v0
        ?.tx_memory_limit,
    tx_max_footprint_entries:
      ledgerCostExtEntry?.dataJson?.config_setting?.contract_ledger_cost_ext_v0
        ?.tx_max_footprint_entries,
    tx_max_disk_read_entries:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.tx_max_disk_read_entries,
    tx_max_write_ledger_entries:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.tx_max_write_ledger_entries,
    tx_max_disk_read_bytes:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.tx_max_disk_read_bytes,
    tx_max_write_bytes:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.tx_max_write_bytes,
    tx_max_contract_events_size_bytes:
      eventsEntry?.dataJson?.config_setting?.contract_events_v0
        ?.tx_max_contract_events_size_bytes,
    contract_data_key_size_bytes:
      dataKeySizeEntry?.dataJson?.config_setting?.contract_data_key_size_bytes,
    contract_max_size_bytes:
      maxSizeEntry?.dataJson?.config_setting?.contract_max_size_bytes,

    // Ledger-wide limits
    ledger_max_instructions: Number(
      computeEntry?.dataJson?.config_setting?.contract_compute_v0
        ?.ledger_max_instructions,
    ),
    ledger_max_disk_read_entries:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.ledger_max_disk_read_entries,
    ledger_max_disk_read_bytes:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.ledger_max_disk_read_bytes,
    ledger_max_write_ledger_entries:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.ledger_max_write_ledger_entries,
    ledger_max_write_bytes:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.ledger_max_write_bytes,
    ledger_max_txs_size_bytes:
      bandwidthEntry?.dataJson?.config_setting?.contract_bandwidth_v0
        ?.ledger_max_txs_size_bytes,

    // State archival TTL extension parameters
    max_entry_ttl:
      stateArchivalEntry?.dataJson?.config_setting?.state_archival
        ?.max_entry_ttl,
    min_temporary_ttl:
      stateArchivalEntry?.dataJson?.config_setting?.state_archival
        ?.min_temporary_ttl,
    min_persistent_ttl:
      stateArchivalEntry?.dataJson?.config_setting?.state_archival
        ?.min_persistent_ttl,

    // Resource fees (in stroops)
    fee_rate_per_instructions_increment: Number(
      computeEntry?.dataJson?.config_setting?.contract_compute_v0
        ?.fee_rate_per_instructions_increment,
    ),
    fee_read_ledger_entry:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.fee_disk_read_ledger_entry,
    fee_write_ledger_entry:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.fee_write_ledger_entry,
    fee_read_1kb:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.fee_disk_read1_kb,
    fee_write_1kb:
      ledgerCostExtEntry?.dataJson?.config_setting?.contract_ledger_cost_ext_v0
        ?.fee_write1_kb,
    fee_tx_size_1kb:
      bandwidthEntry?.dataJson?.config_setting?.contract_bandwidth_v0
        ?.fee_tx_size1_kb,
    fee_historical_1kb:
      historicalDataEntry?.dataJson?.config_setting?.contract_historical_data_v0
        ?.fee_historical1_kb,
    fee_contract_events_1kb:
      eventsEntry?.dataJson?.config_setting?.contract_events_v0
        ?.fee_contract_events1_kb,
    persistent_rent_rate_denominator:
      stateArchivalEntry?.dataJson?.config_setting?.state_archival
        ?.persistent_rent_rate_denominator,
    temp_rent_rate_denominator:
      stateArchivalEntry?.dataJson?.config_setting?.state_archival
        ?.temp_rent_rate_denominator,

    // Rent-related config parameters for computing fee_per_rent_1kb
    live_soroban_state_size_window:
      liveSorobanStateSizeWindowEntry?.dataJson?.config_setting
        ?.live_soroban_state_size_window,
    state_target_size_bytes:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.soroban_state_target_size_bytes,
    rent_fee_1kb_state_size_low:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.rent_fee1_kb_soroban_state_size_low,
    rent_fee_1kb_state_size_high:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.rent_fee1_kb_soroban_state_size_high,
    state_size_rent_fee_growth_factor:
      ledgerCostEntry?.dataJson?.config_setting?.contract_ledger_cost_v0
        ?.soroban_state_rent_fee_growth_factor,
  };
};

const generateTypeScriptFile = (networkLimits) => {
  let content = `// This file is auto-generated by ${SCRIPT_FILE}
// DO NOT EDIT MANUALLY

export interface NetworkLimits {
  // Per-transaction limits
  tx_max_instructions: number;
  tx_memory_limit: number;
  tx_max_footprint_entries: number;
  tx_max_disk_read_entries: number;
  tx_max_write_ledger_entries: number;
  tx_max_disk_read_bytes: number;
  tx_max_write_bytes: number;
  tx_max_contract_events_size_bytes: number;
  contract_data_key_size_bytes: number;
  contract_max_size_bytes: number;

  // Ledger-wide limits
  ledger_max_instructions: number;
  ledger_max_disk_read_entries: number;
  ledger_max_disk_read_bytes: number;
  ledger_max_write_ledger_entries: number;
  ledger_max_write_bytes: number;
  ledger_max_txs_size_bytes: number;

  // State archival TTL extension parameters
  max_entry_ttl: number;
  min_temporary_ttl: number;
  min_persistent_ttl: number;

  // Resource fees (in stroops)
  fee_rate_per_instructions_increment: number;
  fee_read_ledger_entry: string;
  fee_write_ledger_entry: string;
  fee_read_1kb: string;
  fee_write_1kb: string;
  fee_tx_size_1kb: string;
  fee_historical_1kb: string;
  fee_contract_events_1kb: string;
  persistent_rent_rate_denominator: string;
  temp_rent_rate_denominator: string;
  live_soroban_state_size_window: string[];

  // Rent-related config parameters for computing fee_per_rent_1kb
  state_target_size_bytes: string;
  rent_fee_1kb_state_size_low: string;
  rent_fee_1kb_state_size_high: string;
  state_size_rent_fee_growth_factor: number;
}

`;

  // Network limits
  for (const [networkName, limits] of Object.entries(networkLimits)) {
    content += `export const ${networkName.toUpperCase()}_LIMITS: NetworkLimits = ${JSON.stringify(limits, null, 2)} as const;

`;
  }

  // All limits
  content += `export const NETWORK_LIMITS: Record<string, NetworkLimits> = {
`;
  for (const networkName of Object.keys(networkLimits)) {
    content += `  ${networkName}: ${networkName.toUpperCase()}_LIMITS,
`;
  }
  content += `} as const;
`;

  return content;
};

const main = async () => {
  console.log("🚀 Fetching Stellar network limits...\n");

  const networkLimits = {};

  for (const network of NETWORKS) {
    console.log(`📡 Fetching limits for ${network.name}...`);

    if (!network.rpcUrl) {
      console.error(`  ❌ Error: RPC URL not configured for ${network.name}`);
      console.error(`  Please add the RPC URL in ${SCRIPT_FILE}\n`);
      process.exit(1);
    }

    try {
      const response = await fetchLedgerEntries(network.rpcUrl);
      const limits = getNetworkLimitsFromResponse(response);

      // Validate that we got all the required limits
      const missingFields = Object.entries(limits)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value === undefined || value === null)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.warn(
          `  ⚠️  Warning: Missing fields for ${network.name}: ${missingFields.join(", ")}`,
        );
      }

      networkLimits[network.name] = limits;
      console.log(`  ✅ Successfully fetched limits for ${network.name}\n`);
    } catch (error) {
      console.error(
        `  ❌ Failed to fetch limits for ${network.name}: ${error.message}\n`,
      );
      process.exit(1);
    }
  }

  // Generate TypeScript file
  const outputPath = path.join(
    __dirname,
    "..",
    "src",
    "constants",
    "networkLimits.ts",
  );
  const fileContent = generateTypeScriptFile(networkLimits);

  // Ensure the directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, fileContent, "utf8");

  console.log(`✅ Network limits successfully written to ${outputPath}`);
  console.log("🎉 Done!\n");
};

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
