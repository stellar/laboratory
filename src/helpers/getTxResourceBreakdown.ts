import { RpcTxJsonResponse } from "@/types/types";

export interface TxResourceBreakdown {
  // ============================================
  // CPU and Memory
  // ============================================

  /** Total number of CPU instructions executed during contract invocation (network limit: 100 million) */
  instructions: number;

  /** Memory usage in bytes during contract execution (network limit: 40 MB = 41,943,040 bytes) */
  memory_usage: number;

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

  // ============================================
  // Ledger I/O (Disk Operations)
  // ============================================

  /** Number of ledger entries read during transaction execution (network limit: 100 entries) */
  entries_read: number;

  /** Number of ledger entries written during transaction execution (network limit: 50 entries) */
  entries_write: number;

  /** Total bytes read from ledger entries (network limit: 200 KB = 204,800 bytes) */
  ledger_read: number;

  /** Total bytes written to ledger entries (network limit: 132 KB = 135,168 bytes) */
  ledger_write: number;

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

  // ============================================
  // Max Individual Operation Values
  // ============================================

  /** Maximum size in bytes of a single ledger entry key accessed (network limit: 250 bytes) */
  max_rw_key_byte: number;

  /** Maximum size in bytes of a single ledger entry data value accessed (network limit: 128 KiB = 131,072 bytes) */
  max_rw_data_byte: number;

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
  txResponse: RpcTxJsonResponse,
): TxResourceBreakdown => {
  // Get resources from the transaction envelope
  const resources =
    txResponse?.envelopeJson?.tx_fee_bump?.tx?.inner_tx?.tx?.tx?.ext?.v1
      ?.resources;

  // Get diagnostic events for core metrics
  const diagnosticEvents = txResponse?.diagnosticEventsJson || [];

  // Helper to find core_metrics diagnostic event by metric name
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

  return {
    // CPU and Memory
    instructions,
    memory_usage: memoryUsage,
    invoke_time: invokeTime,

    // Footprint
    footprint_keys_read_only: readOnlyKeys,
    footprint_keys_read_write: readWriteKeys,
    footprint_keys_total: totalKeys,

    // Ledger I/O
    entries_read: entriesRead,
    entries_write: entriesWrite,
    ledger_read: ledgerRead,
    ledger_write: ledgerWrite,

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

    // Max values
    max_rw_key_byte: maxRwKeyByte,
    max_rw_data_byte: maxRwDataByte,
    max_rw_code_byte: maxRwCodeByte,
    max_emit_event_byte: maxEmitEventByte,
  };
};
