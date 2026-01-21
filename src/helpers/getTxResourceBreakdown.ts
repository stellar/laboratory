import { NETWORK_LIMITS } from "@/constants/networkLimits";
import { formatLargeNumber } from "@/helpers/formatLargeNumber";
import { formatFileSize } from "@/helpers/formatFileSize";
import { NetworkType, RpcTxJsonResponse } from "@/types/types";

export interface TxResourceBreakdown {
  // ============================================
  // CPU and Memory
  // ============================================

  /** Total number of CPU instructions executed during contract invocation (network limit: 100 million) */
  instructions: number;
  instructions_network_limit: number;
  instructions_network_limit_display: string;
  instructions_usage_percent: string;

  /** Memory usage in bytes during contract execution (network limit: 40 MB = 41,943,040 bytes) */
  memory_usage: number;
  memory_usage_network_limit: number;
  memory_usage_network_limit_display: string;
  memory_usage_usage_percent: string;

  /** Contract invocation time in nanoseconds */
  invoke_time: number;

  // ============================================
  // Footprint (Ledger Keys)
  // ============================================

  /** Number of read-only ledger keys in the transaction footprint */
  footprint_keys_read_only: number;

  /** Number of read-write ledger keys in the transaction footprint */
  footprint_keys_read_write: number;

  /** Total number of ledger keys in the transaction footprint (network limit: 100 keys) */
  footprint_keys_total: number;
  footprint_keys_total_network_limit: number;
  footprint_keys_total_network_limit_display: string;
  footprint_keys_total_usage_percent: string;

  // ============================================
  // Ledger I/O (Disk Operations)
  // ============================================

  /** Number of ledger entries read during transaction execution (network limit: 100 entries) */
  entries_read: number;
  entries_read_network_limit: number;
  entries_read_network_limit_display: string;
  entries_read_usage_percent: string;

  /** Number of ledger entries written during transaction execution (network limit: 50 entries) */
  entries_write: number;
  entries_write_network_limit: number;
  entries_write_network_limit_display: string;
  entries_write_usage_percent: string;

  /** Total bytes read from ledger entries (network limit: 200 KB = 204,800 bytes) */
  ledger_read: number;
  ledger_read_network_limit: number;
  ledger_read_network_limit_display: string;
  ledger_read_usage_percent: string;

  /** Total bytes written to ledger entries (network limit: 132 KB = 135,168 bytes) */
  ledger_write: number;
  ledger_write_network_limit: number;
  ledger_write_network_limit_display: string;
  ledger_write_usage_percent: string;

  // ============================================
  // Data I/O (Keys, Data, Code)
  // ============================================

  /** Total bytes read from data values in ledger entries */
  data_read: number;

  /** Total bytes written to data values in ledger entries */
  data_write: number;

  /** Total bytes read from ledger entry keys */
  key_read: number;

  /** Total bytes written to ledger entry keys */
  key_write: number;

  /** Total bytes read from contract code (WASM) */
  code_read: number;

  /** Total bytes written to contract code (WASM) */
  code_write: number;

  // ============================================
  // Events
  // ============================================

  /** Number of events emitted during contract execution */
  emit_event_count: number;

  /** Total size in bytes of all emitted events and return value (network limit: 16 KB = 16,384 bytes) */
  emit_event_bytes: number;
  emit_event_bytes_network_limit: number;
  emit_event_bytes_network_limit_display: string;
  emit_event_bytes_usage_percent: string;

  // ============================================
  // Max Individual Operation Values
  // ============================================

  /** Maximum size in bytes of a single ledger entry key accessed (network limit: 250 bytes) */
  max_rw_key_byte: number;
  max_rw_key_byte_network_limit: number;
  max_rw_key_byte_usage_percent: string;

  /** Maximum size in bytes of a single ledger entry data value accessed (network limit: 128 KiB = 131,072 bytes) */
  max_rw_data_byte: number;
  max_rw_data_byte_network_limit: number;
  max_rw_data_byte_usage_percent: string;

  /** Maximum size in bytes of a single contract code entry accessed */
  max_rw_code_byte: number;

  /** Maximum size in bytes of a single emitted event */
  max_emit_event_byte: number;
}

/**
 * Extract resource breakdown data from a Soroban RPC transaction response.
 * Returns resource metrics including instructions, memory, I/O operations, etc.
 */
export const getTxResourceBreakdown = (
  networkId: NetworkType,
  txResponse: RpcTxJsonResponse,
): TxResourceBreakdown => {
  // Get resources from the transaction envelope
  const feeBumpTx = txResponse?.envelopeJson?.tx_fee_bump;
  const resources = feeBumpTx
    ? feeBumpTx.tx?.inner_tx?.tx?.tx?.ext?.v1?.resources
    : txResponse?.envelopeJson?.tx?.tx?.ext?.v1?.resources;

  // Get diagnostic events for core metrics
  const diagnosticEvents = txResponse?.diagnosticEventsJson || [];

  // Find core_metrics diagnostic event by metric name
  const getCoreMetric = (metricName: string): number | null => {
    const event = diagnosticEvents.find(
      (e: any) =>
        e.in_successful_contract_call &&
        e.event?.type_ === "diagnostic" &&
        e.event?.body?.v0?.topics?.[0]?.symbol === "core_metrics" &&
        e.event?.body?.v0?.topics?.[1]?.symbol === metricName,
    );
    return event?.event?.body?.v0?.data?.u64 || null;
  };

  // Extract footprint data
  const footprint = resources?.footprint;
  const readOnlyKeys = footprint?.read_only?.length || 0;
  const readWriteKeys = footprint?.read_write?.length || 0;
  const totalKeys = readOnlyKeys + readWriteKeys;

  // Extract CPU and memory metrics
  const instructions = resources?.instructions || 0;
  const memoryUsage = getCoreMetric("mem_byte") || 0;
  const invokeTime = getCoreMetric("invoke_time_nsecs") || 0;

  // Extract ledger I/O metrics
  const entriesRead = getCoreMetric("read_entry") || 0;
  const entriesWrite = getCoreMetric("write_entry") || 0;
  const ledgerRead = getCoreMetric("ledger_read_byte") || 0;
  const ledgerWrite = getCoreMetric("ledger_write_byte") || 0;

  // Extract data I/O metrics
  const dataRead = getCoreMetric("read_data_byte") || 0;
  const dataWrite = getCoreMetric("write_data_byte") || 0;
  const keyRead = getCoreMetric("read_key_byte") || 0;
  const keyWrite = getCoreMetric("write_key_byte") || 0;
  const codeRead = getCoreMetric("read_code_byte") || 0;
  const codeWrite = getCoreMetric("write_code_byte") || 0;

  // Extract event metrics
  const emitEventCount = getCoreMetric("emit_event") || 0;
  const emitEventBytes = getCoreMetric("emit_event_byte") || 0;

  // Extract max values (single operation limits)
  const maxRwKeyByte = getCoreMetric("max_rw_key_byte") || 0;
  const maxRwDataByte = getCoreMetric("max_rw_data_byte") || 0;
  const maxRwCodeByte = getCoreMetric("max_rw_code_byte") || 0;
  const maxEmitEventByte = getCoreMetric("max_emit_event_byte") || 0;

  // Calculate usage percentage with 2 decimal precision
  const calculateUsagePercent = (value: number, limit: number): string => {
    if (limit === 0) {
      return "0.00%";
    }

    return `${((value / limit) * 100).toFixed(2)}%`;
  };

  const CURRENT_NETWORK_LIMITS = NETWORK_LIMITS[networkId];

  return {
    // CPU and Memory
    instructions,
    instructions_network_limit: CURRENT_NETWORK_LIMITS.tx_max_instructions,
    instructions_network_limit_display: formatLargeNumber(
      CURRENT_NETWORK_LIMITS.tx_max_instructions,
    ),
    instructions_usage_percent: calculateUsagePercent(
      instructions,
      CURRENT_NETWORK_LIMITS.tx_max_instructions,
    ),
    memory_usage: memoryUsage,
    memory_usage_network_limit: CURRENT_NETWORK_LIMITS.tx_memory_limit,
    memory_usage_network_limit_display: formatFileSize(
      CURRENT_NETWORK_LIMITS.tx_memory_limit,
    ),
    memory_usage_usage_percent: calculateUsagePercent(
      memoryUsage,
      CURRENT_NETWORK_LIMITS.tx_memory_limit,
    ),
    invoke_time: invokeTime,

    // Footprint
    footprint_keys_read_only: readOnlyKeys,
    footprint_keys_read_write: readWriteKeys,
    footprint_keys_total: totalKeys,
    footprint_keys_total_network_limit:
      CURRENT_NETWORK_LIMITS.tx_max_footprint_entries,
    footprint_keys_total_network_limit_display: `${CURRENT_NETWORK_LIMITS.tx_max_footprint_entries} keys`,
    footprint_keys_total_usage_percent: calculateUsagePercent(
      totalKeys,
      CURRENT_NETWORK_LIMITS.tx_max_footprint_entries,
    ),

    // Ledger I/O
    entries_read: entriesRead,
    entries_read_network_limit: CURRENT_NETWORK_LIMITS.tx_max_disk_read_entries,
    entries_read_network_limit_display: `${CURRENT_NETWORK_LIMITS.tx_max_disk_read_entries} entries`,
    entries_read_usage_percent: calculateUsagePercent(
      entriesRead,
      CURRENT_NETWORK_LIMITS.tx_max_disk_read_entries,
    ),
    entries_write: entriesWrite,
    entries_write_network_limit:
      CURRENT_NETWORK_LIMITS.tx_max_write_ledger_entries,
    entries_write_network_limit_display: `${CURRENT_NETWORK_LIMITS.tx_max_write_ledger_entries} entries`,
    entries_write_usage_percent: calculateUsagePercent(
      entriesWrite,
      CURRENT_NETWORK_LIMITS.tx_max_write_ledger_entries,
    ),
    ledger_read: ledgerRead,
    ledger_read_network_limit: CURRENT_NETWORK_LIMITS.tx_max_disk_read_bytes,
    ledger_read_network_limit_display: formatFileSize(
      CURRENT_NETWORK_LIMITS.tx_max_disk_read_bytes,
    ),
    ledger_read_usage_percent: calculateUsagePercent(
      ledgerRead,
      CURRENT_NETWORK_LIMITS.tx_max_disk_read_bytes,
    ),
    ledger_write: ledgerWrite,
    ledger_write_network_limit: CURRENT_NETWORK_LIMITS.tx_max_write_bytes,
    ledger_write_network_limit_display: formatFileSize(
      CURRENT_NETWORK_LIMITS.tx_max_write_bytes,
    ),
    ledger_write_usage_percent: calculateUsagePercent(
      ledgerWrite,
      CURRENT_NETWORK_LIMITS.tx_max_write_bytes,
    ),

    // Data I/O
    data_read: dataRead,
    data_write: dataWrite,
    key_read: keyRead,
    key_write: keyWrite,
    code_read: codeRead,
    code_write: codeWrite,

    // Events
    emit_event_count: emitEventCount,
    emit_event_bytes: emitEventBytes,
    emit_event_bytes_network_limit:
      CURRENT_NETWORK_LIMITS.tx_max_contract_events_size_bytes,
    emit_event_bytes_network_limit_display: formatFileSize(
      CURRENT_NETWORK_LIMITS.tx_max_contract_events_size_bytes,
    ),
    emit_event_bytes_usage_percent: calculateUsagePercent(
      emitEventBytes,
      CURRENT_NETWORK_LIMITS.tx_max_contract_events_size_bytes,
    ),

    // Max values
    max_rw_key_byte: maxRwKeyByte,
    max_rw_key_byte_network_limit:
      CURRENT_NETWORK_LIMITS.contract_data_key_size_bytes,
    max_rw_key_byte_usage_percent: calculateUsagePercent(
      maxRwKeyByte,
      CURRENT_NETWORK_LIMITS.contract_data_key_size_bytes,
    ),
    max_rw_data_byte: maxRwDataByte,
    max_rw_data_byte_network_limit:
      CURRENT_NETWORK_LIMITS.contract_max_size_bytes,
    max_rw_data_byte_usage_percent: calculateUsagePercent(
      maxRwDataByte,
      CURRENT_NETWORK_LIMITS.contract_max_size_bytes,
    ),
    max_rw_code_byte: maxRwCodeByte,
    max_emit_event_byte: maxEmitEventByte,
  };
};
