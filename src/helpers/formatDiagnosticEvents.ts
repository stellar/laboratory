// =============================================================================
// Constants
// =============================================================================
const EVENT_TOPIC_SYMBOLS = {
  FN_CALL: "fn_call",
  FN_RETURN: "fn_return",
  CORE_METRICS: "core_metrics",
} as const;

const EVENT_TYPES = {
  DIAGNOSTIC: "diagnostic",
  CONTRACT: "contract",
} as const;

// =============================================================================
// Type Definitions
// =============================================================================
export type ErrorLevel = "all" | "some" | undefined;
export type EventTopicSymbol =
  (typeof EVENT_TOPIC_SYMBOLS)[keyof typeof EVENT_TOPIC_SYMBOLS];
export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

type ScError =
  | { contract: number }
  | { wasm_vm: unknown }
  | { context: unknown }
  | { storage: unknown }
  | { object: unknown }
  | { crypto: unknown }
  | { events: unknown }
  | { budget: unknown }
  | { value: unknown }
  | { auth: unknown };

type ScInt128 = { hi: number; lo: number };
type ScInt256 = {
  hi_hi: number;
  hi_lo: number;
  lo_hi: number;
  lo_lo: number;
};

type ScMapEntry = { key: ScValType; val: ScValType };
type FormattedMapEntry = { key: FormattedEventData; val: FormattedEventData };

type FormattedPrimitive =
  | { type: "symbol"; value: string }
  | { type: "bytes"; value: string }
  | { type: "address"; value: string }
  | { type: "i32"; value: number }
  | { type: "i64"; value: bigint | string }
  | { type: "i128"; value: ScInt128 | string }
  | { type: "i256"; value: ScInt256 }
  | { type: "u32"; value: number }
  | { type: "u64"; value: bigint | string }
  | { type: "u128"; value: ScInt128 | string }
  | { type: "u256"; value: ScInt256 }
  | { type: "bool"; value: boolean }
  | { type: "string"; value: string }
  | { type: "error"; value: ScError }
  | { type: "void"; value: null };

export type FormattedEventData =
  | FormattedPrimitive
  | { type: "vec"; value: FormattedEventData[] }
  | { type: "map"; value: FormattedMapEntry[] }
  | { type: "literal"; value: string }
  | { type: "ellipsis"; value: string }
  | { type: undefined; value: unknown };

interface CoreMetric {
  key: string | undefined;
  value: any;
  type: string;
}

export interface ProcessedEvent {
  type: string;
  name: string;
  contractId: string | null;
  data: FormattedEventData;
  dataContractParams?: FormattedEventData[];
  isError: boolean;
  nested: ProcessedEvent[];
  return?: ProcessedEvent;
}

interface ScValType {
  symbol?: string;
  bytes?: string;
  address?: string;
  i32?: number;
  i64?: bigint | string;
  i128?: ScInt128 | string;
  i256?: ScInt256;
  u32?: number;
  u64?: bigint | string;
  u128?: ScInt128 | string;
  u256?: ScInt256;
  bool?: boolean;
  string?: string;
  vec?: ScValType[];
  map?: ScMapEntry[];
  error?: ScError;
  void?: null;
}

interface DiagnosticEventBody {
  v0: {
    topics: ScValType[];
    data: ScValType | string;
  };
}

interface DiagnosticEvent {
  ext: string;
  contract_id: string | null;
  type_: EventType;
  body: DiagnosticEventBody;
}

export interface DiagnosticEventJson {
  in_successful_contract_call: boolean;
  event: DiagnosticEvent;
}

// =============================================================================
// Helper Functions
// =============================================================================
/**
 * Extracts the event type from a diagnostic event.
 * For diagnostic events, returns the first topic symbol.
 * For contract events, returns "contract_event".
 */
const getEventType = (event: DiagnosticEvent): string => {
  switch (event.type_) {
    case EVENT_TYPES.DIAGNOSTIC:
      return event.body?.v0?.topics[0]?.symbol || "";
    case EVENT_TYPES.CONTRACT:
      return "contract_event";
    default:
      return "";
  }
};

/**
 * Extracts the event name from a diagnostic event.
 * - For fn_return: uses the 2nd topic (function name)
 * - For fn_call: uses the 3rd topic (function name)
 * - For contract events: uses the 1st topic (event name)
 * - For other diagnostic events: uses the 1st topic symbol
 */
const getEventName = (event: DiagnosticEvent): string => {
  const topics = event.body?.v0?.topics;
  if (!topics || topics.length === 0) return "";

  const topicSymbol = topics[0]?.symbol;

  if (event.type_ === EVENT_TYPES.DIAGNOSTIC) {
    if (topicSymbol === EVENT_TOPIC_SYMBOLS.FN_RETURN) {
      // Use the function name (2nd topic)
      return topics?.[1]?.symbol || "";
    } else if (topicSymbol === EVENT_TOPIC_SYMBOLS.FN_CALL) {
      // Use the function name (3rd topic)
      return topics?.[2]?.symbol || "";
    }

    return topicSymbol || "";
  }

  // No name for contract events
  if (event.type_ === EVENT_TYPES.CONTRACT) {
    return "";
  }

  return "";
};

/**
 * Recursively formats event data from ScVal types.
 * Handles vectors (arrays), maps (key-value pairs), primitives, and plain string literals.
 */
type PrimitiveKey = Exclude<keyof ScValType, "vec" | "map">;

const isPrimitiveKey = (key: keyof ScValType): key is PrimitiveKey =>
  key !== "vec" && key !== "map";

const formatEventData = (data: ScValType | string): FormattedEventData => {
  // Handle plain string case (e.g., "void" literal)
  if (typeof data === "string") {
    if (data === "void") {
      return { value: null, type: "void" };
    }

    return { value: data, type: "literal" };
  }

  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data) as Array<keyof ScValType>;

    if (keys.length === 1) {
      const key = keys[0];
      const value = data[key];

      switch (key) {
        // Array
        case "vec":
          if (Array.isArray(value)) {
            return {
              value: value.map((item: ScValType) => formatEventData(item)),
              type: "vec",
            };
          }
          break;
        // Object
        case "map":
          if (Array.isArray(value)) {
            return {
              value: (value as ScMapEntry[]).map((item) => ({
                key: formatEventData(item.key),
                val: formatEventData(item.val),
              })),
              type: "map",
            };
          }
          break;
        // Primitives
        default:
          if (isPrimitiveKey(key) && value !== undefined) {
            switch (key) {
              case "symbol":
              case "bytes":
              case "address":
              case "string":
                return { value: value as string, type: key };
              case "i32":
              case "u32":
                return { value: value as number, type: key };
              case "i64":
              case "u64":
                return { value: value as bigint | string, type: key };
              case "i128":
              case "u128":
                return { value: value as ScInt128 | string, type: key };
              case "i256":
              case "u256":
                return { value: value as ScInt256, type: key };
              case "bool":
                return { value: value as boolean, type: key };
              case "error":
                return { value: value as ScError, type: key };
              case "void":
                return { value: null, type: "void" };
            }
          }
      }
    }
  }

  // Non-object or unrecognized case
  return { value: data, type: undefined };
};

/**
 * Calculates the error level across all events in the call stack.
 * @returns "all" if all events are errors, "some" if only some are errors, undefined if no errors
 */
const calculateErrorLevel = (callStack: ProcessedEvent[]): ErrorLevel => {
  /**
   * Recursively flattens the event tree to get all events including nested ones.
   */
  const getAllEvents = (events: ProcessedEvent[]): ProcessedEvent[] => {
    const allEvents: ProcessedEvent[] = [];

    events.forEach((event) => {
      allEvents.push(event);

      if (event.nested && event.nested.length > 0) {
        allEvents.push(...getAllEvents(event.nested));
      }

      if (event.return) {
        allEvents.push(event.return);
      }
    });

    return allEvents;
  };

  const allEvents = getAllEvents(callStack);

  if (allEvents.length === 0) return undefined;

  const errorEvents = allEvents.filter((event) => event.isError === true);

  if (errorEvents.length === 0) return undefined;
  if (errorEvents.length === allEvents.length) return "all";

  return "some";
};

// =============================================================================
// Main Processing
// =============================================================================

/**
 * Formats contract event topics (excluding the first one used for event name).
 * Returns undefined for non-contract events or events with no additional topics.
 */
const formatContractParams = (
  eventType: string | undefined,
  topics: ScValType[] | undefined,
): FormattedEventData[] | undefined => {
  if (eventType !== EVENT_TYPES.CONTRACT || !topics) {
    return undefined;
  }

  return topics.map((topic) => formatEventData(topic));
};

/**
 * Processes diagnostic events into a structured call stack with nesting.
 *
 * Event processing logic:
 * - Core metrics: Extracted and stored separately
 * - fn_call (diagnostic): Creates a new stack frame and nests subsequent events
 * - fn_return (diagnostic): Attached to the current stack frame's return property
 * - Other diagnostic events: Added to the current stack frame or root
 * - Contract events: Added to the current stack frame or root
 *
 * The currentStack tracks the function call hierarchy to properly nest events.
 */
const processEvents = (
  dEvents: DiagnosticEventJson[],
): {
  callStack: ProcessedEvent[];
  coreMetrics: CoreMetric[];
} => {
  const currentStack: ProcessedEvent[] = [];
  const result: ProcessedEvent[] = [];
  const coreMetrics: CoreMetric[] = [];

  dEvents.forEach((ev) => {
    const evType = ev.event?.type_;
    const evTopics = ev.event?.body?.v0?.topics;
    const topicSymbol = evTopics?.[0]?.symbol;

    // Core metrics
    if (topicSymbol === EVENT_TOPIC_SYMBOLS.CORE_METRICS) {
      const dataEntries = ev.event?.body?.v0?.data
        ? Object.entries(ev.event.body.v0.data)
        : [];

      if (dataEntries.length > 0) {
        const [type, value] = dataEntries[0];
        coreMetrics.push({
          key: evTopics?.[1]?.symbol,
          value,
          type,
        });
      }
      return;
    }

    // Diagnostic and contract events
    if (evType !== EVENT_TYPES.DIAGNOSTIC && evType !== EVENT_TYPES.CONTRACT) {
      return;
    }

    const eventObj: ProcessedEvent = {
      type: getEventType(ev.event),
      name: getEventName(ev.event),
      contractId: ev.event?.contract_id || null,
      data: formatEventData(ev.event?.body?.v0?.data),
      dataContractParams: formatContractParams(evType, evTopics),
      isError: !ev.in_successful_contract_call,
      nested: [],
    };

    const addEvent = (event: ProcessedEvent): void => {
      if (currentStack.length > 0) {
        currentStack[currentStack.length - 1].nested.push(event);
      } else {
        result.push(event);
      }
    };

    // Process event based on type and add to appropriate location in call stack
    if (evType === EVENT_TYPES.DIAGNOSTIC) {
      if (topicSymbol === EVENT_TOPIC_SYMBOLS.FN_CALL) {
        // Add to parent/result and push to current stack
        addEvent(eventObj);
        currentStack.push(eventObj);
      } else if (topicSymbol === EVENT_TOPIC_SYMBOLS.FN_RETURN) {
        // Add to current function's return property and remove from current stack
        if (currentStack.length > 0) {
          currentStack[currentStack.length - 1].return = eventObj;
          currentStack.pop();
        } else {
          // Edge case: fn_return without matching fn_call - add to root
          result.push(eventObj);
        }
      } else {
        // Add to current stack
        addEvent(eventObj);
      }
    } else if (evType === EVENT_TYPES.CONTRACT) {
      // Add to current stack
      addEvent(eventObj);
    }
  });

  return { callStack: result, coreMetrics };
};

/**
 * Formats diagnostic events from a transaction into a structured call stack.
 *
 * @param dEvents - Array of diagnostic events from a Stellar transaction
 * @returns Object containing:
 *   - callStack: Nested structure of function calls and events
 *   - coreMetrics: Array of core performance metrics
 *   - errorLevel: Overall error status ("all", "some", or undefined)
 */
export const formatDiagnosticEvents = (
  dEvents: DiagnosticEventJson[],
): {
  callStack: ProcessedEvent[];
  coreMetrics: CoreMetric[];
  errorLevel: ErrorLevel;
} => {
  // Early return for empty input
  if (!dEvents || dEvents.length === 0) {
    return {
      callStack: [],
      coreMetrics: [],
      errorLevel: undefined,
    };
  }

  const { callStack, coreMetrics } = processEvents(dEvents);

  return {
    callStack,
    coreMetrics,
    errorLevel: calculateErrorLevel(callStack),
  };
};

// TODO: remove before merge
// =============================================================================
// Test Data
// =============================================================================
export const TEMP_MIXED: DiagnosticEventJson[] = [
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "ab6400f0f464b102fc3d31629e4a3d80284a703b34e74d7951eac6b750bcef55",
            },
            {
              symbol: "level1",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCXSFZSLOZ5UUMKPNESF6EDEOQ5DOCKE6JVWGPFBQK2ICPBADO6GAIFL",
              },
              {
                address:
                  "CDHIKAPYDNRANRSHTHY5JSS2EGDSMC2XAR2WLZJISPCEFLHLY2P3OO4S",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCVWIAHQ6RSLCAX4HUYWFHSKHWACQSTQHM2OOTLZKHVMNN2QXTXVKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "af22e64b767b4a314f69245f1064743a370944f26b633ca182b4813c201bbc60",
            },
            {
              symbol: "level2",
            },
          ],
          data: {
            address: "CDHIKAPYDNRANRSHTHY5JSS2EGDSMC2XAR2WLZJISPCEFLHLY2P3OO4S",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCXSFZSLOZ5UUMKPNESF6EDEOQ5DOCKE6JVWGPFBQK2ICPBADO6GAIFL",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "ce8501f81b6206c64799f1d4ca5a2187260b57047565e52893c442acebc69fb7",
            },
            {
              symbol: "level3",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDHIKAPYDNRANRSHTHY5JSS2EGDSMC2XAR2WLZJISPCEFLHLY2P3OO4S",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "work_done",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "success",
                },
                val: {
                  bool: true,
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDHIKAPYDNRANRSHTHY5JSS2EGDSMC2XAR2WLZJISPCEFLHLY2P3OO4S",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "level3",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCXSFZSLOZ5UUMKPNESF6EDEOQ5DOCKE6JVWGPFBQK2ICPBADO6GAIFL",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "failing",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "reason",
                },
                val: {
                  symbol: "always",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCXSFZSLOZ5UUMKPNESF6EDEOQ5DOCKE6JVWGPFBQK2ICPBADO6GAIFL",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 1,
              },
            },
          ],
          data: {
            string: "escalating Ok(ScErrorType::Contract) frame-exit to Err",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCVWIAHQ6RSLCAX4HUYWFHSKHWACQSTQHM2OOTLZKHVMNN2QXTXVKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 1,
              },
            },
          ],
          data: {
            vec: [
              {
                string: "contract try_call failed",
              },
              {
                symbol: "level2",
              },
              {
                vec: [
                  {
                    address:
                      "CDHIKAPYDNRANRSHTHY5JSS2EGDSMC2XAR2WLZJISPCEFLHLY2P3OO4S",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCVWIAHQ6RSLCAX4HUYWFHSKHWACQSTQHM2OOTLZKHVMNN2QXTXVKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "level1",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_entry",
            },
          ],
          data: {
            u64: "6",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_entry",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_read_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_write_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_data_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_data_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event_byte",
            },
          ],
          data: {
            u64: "4",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "cpu_insn",
            },
          ],
          data: {
            u64: "806090",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "mem_byte",
            },
          ],
          data: {
            u64: "3570616",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "invoke_time_nsecs",
            },
          ],
          data: {
            u64: "489666",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_data_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_emit_event_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
];

export const TEMP_KALE: DiagnosticEventJson[] = [
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                vec: [
                  {
                    u32: 113278,
                  },
                  {
                    u32: 113280,
                  },
                  {
                    u32: 113281,
                  },
                  {
                    u32: 113282,
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                u32: 113278,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
            },
            {
              symbol: "mint",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                i128: "4241990",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "mint",
            },
            {
              address:
                "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
            },
            {
              string:
                "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
            },
          ],
          data: {
            i128: "4241990",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "mint",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            i128: "4241990",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                u32: 113280,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
            },
            {
              symbol: "mint",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                i128: "11348760",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "mint",
            },
            {
              address:
                "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
            },
            {
              string:
                "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
            },
          ],
          data: {
            i128: "11348760",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "mint",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            i128: "11348760",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                u32: 113281,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
            },
            {
              symbol: "mint",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                i128: "13089724",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "mint",
            },
            {
              address:
                "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
            },
            {
              string:
                "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
            },
          ],
          data: {
            i128: "13089724",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "mint",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            i128: "13089724",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                u32: 113282,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
            },
            {
              symbol: "mint",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
              },
              {
                i128: "4821087",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "mint",
            },
            {
              address:
                "GARROATMIXHFWGW6HVSTKW3F5HCJIDZTXOBHW5KRM52NQNYQHPC3TF7S",
            },
            {
              string:
                "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
            },
          ],
          data: {
            i128: "4821087",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "mint",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            i128: "4821087",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "harvest",
            },
          ],
          data: {
            vec: [
              {
                i128: "4241990",
              },
              {
                i128: "11348760",
              },
              {
                i128: "13089724",
              },
              {
                i128: "4821087",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_entry",
            },
          ],
          data: {
            u64: "14",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_entry",
            },
          ],
          data: {
            u64: "1",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_read_byte",
            },
          ],
          data: {
            u64: "116",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_write_byte",
            },
          ],
          data: {
            u64: "116",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_key_byte",
            },
          ],
          data: {
            u64: "84",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_data_byte",
            },
          ],
          data: {
            u64: "116",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_data_byte",
            },
          ],
          data: {
            u64: "116",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event",
            },
          ],
          data: {
            u64: "4",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event_byte",
            },
          ],
          data: {
            u64: "892",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "cpu_insn",
            },
          ],
          data: {
            u64: "4008627",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "mem_byte",
            },
          ],
          data: {
            u64: "7164025",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "invoke_time_nsecs",
            },
          ],
          data: {
            u64: "666319",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_key_byte",
            },
          ],
          data: {
            u64: "84",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_data_byte",
            },
          ],
          data: {
            u64: "116",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_emit_event_byte",
            },
          ],
          data: {
            u64: "200",
          },
        },
      },
    },
  },
];

export const TEMP_SS: DiagnosticEventJson[] = [
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
            },
            {
              symbol: "remove_liquidity",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              },
              {
                address:
                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
              },
              {
                i128: "3920309",
              },
              {
                i128: "5000000",
              },
              {
                i128: "1000000",
              },
              {
                address:
                  "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
              },
              {
                u64: "1767119444",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
            },
            {
              symbol: "pair_exists",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              },
              {
                address:
                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "pair_exists",
            },
          ],
          data: {
            bool: true,
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
              },
              {
                address:
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
              },
              {
                i128: "3920309",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
            },
            {
              address:
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
            },
          ],
          data: {
            i128: "3920309",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
            },
            {
              symbol: "withdraw",
            },
          ],
          data: {
            address: "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "2954929309719",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "629288072258",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
            },
            {
              symbol: "fees_enabled",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "fees_enabled",
            },
          ],
          data: {
            bool: false,
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "burn",
            },
            {
              address:
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
            },
          ],
          data: {
            i128: "3920309",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
              },
              {
                address:
                  "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
              },
              {
                i128: "9382877",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
            },
            {
              address:
                "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "9382877",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
              },
              {
                address:
                  "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
              },
              {
                i128: "1998197",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
            },
            {
              address:
                "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
            },
            {
              string:
                "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
            },
          ],
          data: {
            i128: "1998197",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "2954919926842",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "629286074061",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapPair",
            },
            {
              symbol: "sync",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "new_reserve_0",
                },
                val: {
                  i128: "2954919926842",
                },
              },
              {
                key: {
                  symbol: "new_reserve_1",
                },
                val: {
                  i128: "629286074061",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapPair",
            },
            {
              symbol: "withdraw",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "amount_0",
                },
                val: {
                  i128: "9382877",
                },
              },
              {
                key: {
                  symbol: "amount_1",
                },
                val: {
                  i128: "1998197",
                },
              },
              {
                key: {
                  symbol: "liquidity",
                },
                val: {
                  i128: "3920309",
                },
              },
              {
                key: {
                  symbol: "new_reserve_0",
                },
                val: {
                  i128: "2954919926842",
                },
              },
              {
                key: {
                  symbol: "new_reserve_1",
                },
                val: {
                  i128: "629286074061",
                },
              },
              {
                key: {
                  symbol: "to",
                },
                val: {
                  address:
                    "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "withdraw",
            },
          ],
          data: {
            vec: [
              {
                i128: "9382877",
              },
              {
                i128: "1998197",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapRouter",
            },
            {
              symbol: "remove",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "amount_a",
                },
                val: {
                  i128: "9382877",
                },
              },
              {
                key: {
                  symbol: "amount_b",
                },
                val: {
                  i128: "1998197",
                },
              },
              {
                key: {
                  symbol: "liquidity",
                },
                val: {
                  i128: "3920309",
                },
              },
              {
                key: {
                  symbol: "pair",
                },
                val: {
                  address:
                    "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                },
              },
              {
                key: {
                  symbol: "to",
                },
                val: {
                  address:
                    "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5",
                },
              },
              {
                key: {
                  symbol: "token_a",
                },
                val: {
                  address:
                    "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                },
              },
              {
                key: {
                  symbol: "token_b",
                },
                val: {
                  address:
                    "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "remove_liquidity",
            },
          ],
          data: {
            vec: [
              {
                i128: "9382877",
              },
              {
                i128: "1998197",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_entry",
            },
          ],
          data: {
            u64: "15",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_entry",
            },
          ],
          data: {
            u64: "7",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_read_byte",
            },
          ],
          data: {
            u64: "260",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_write_byte",
            },
          ],
          data: {
            u64: "1512",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_key_byte",
            },
          ],
          data: {
            u64: "124",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_data_byte",
            },
          ],
          data: {
            u64: "260",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_data_byte",
            },
          ],
          data: {
            u64: "1512",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event",
            },
          ],
          data: {
            u64: "7",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event_byte",
            },
          ],
          data: {
            u64: "1756",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "cpu_insn",
            },
          ],
          data: {
            u64: "5590177",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "mem_byte",
            },
          ],
          data: {
            u64: "7842656",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "invoke_time_nsecs",
            },
          ],
          data: {
            u64: "606366",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_key_byte",
            },
          ],
          data: {
            u64: "116",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_data_byte",
            },
          ],
          data: {
            u64: "512",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_emit_event_byte",
            },
          ],
          data: {
            u64: "436",
          },
        },
      },
    },
  },
];

export const TEMP_FAILED: DiagnosticEventJson[] = [
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "b4905f3ef7b78b525c24ef9ae8d323009164b3566403d4013f63431a2ac084a0",
            },
            {
              symbol: "b",
            },
          ],
          data: {
            vec: [
              {
                u128: "4000000000",
              },
              {
                u128: "4000000000",
              },
              {
                vec: [
                  {
                    vec: [
                      {
                        u32: 2,
                      },
                      {
                        u32: 2,
                      },
                      {
                        u32: 2999,
                      },
                      {
                        u32: 1,
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        u32: 4,
                      },
                      {
                        u32: 1,
                      },
                      {
                        u32: 4027,
                      },
                      {
                        u32: 0,
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        u32: 2,
                      },
                      {
                        u32: 0,
                      },
                      {
                        u32: 2999,
                      },
                      {
                        u32: 2,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
            },
            {
              symbol: "router_pair_for",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
              },
              {
                address:
                  "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "router_pair_for",
            },
          ],
          data: {
            address: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "5066038209",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
            },
            {
              symbol: "swap_exact_tokens_for_tokens",
            },
          ],
          data: {
            vec: [
              {
                i128: "4000000000",
              },
              {
                i128: "1",
              },
              {
                vec: [
                  {
                    address:
                      "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
                  },
                  {
                    address:
                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                  },
                ],
              },
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                u64: "18446744073709551615",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "be21971aa986e1a7f67bb6942b4cbadc0baf8b8c042e6e89184084f2552bb676",
            },
            {
              symbol: "get_reserves",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "get_reserves",
            },
          ],
          data: {
            vec: [
              {
                i128: "2825306690719",
              },
              {
                i128: "2389869922102",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "e6a7d9eb7523006a469aa7483ad1107247443c0d82e62763de670848c4e97c90",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                address:
                  "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
              },
              {
                i128: "4000000000",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
            },
            {
              address:
                "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
            },
            {
              string:
                "EURC:GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP2",
            },
          ],
          data: {
            i128: "4000000000",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "be21971aa986e1a7f67bb6942b4cbadc0baf8b8c042e6e89184084f2552bb676",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            vec: [
              {
                i128: "4706763496",
              },
              {
                i128: "0",
              },
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
              },
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                i128: "4706763496",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
            },
            {
              address:
                "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
            },
            {
              string:
                "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
            },
          ],
          data: {
            i128: "4706763496",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "2820599927223",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "e6a7d9eb7523006a469aa7483ad1107247443c0d82e62763de670848c4e97c90",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "2393869922102",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapPair",
            },
            {
              symbol: "sync",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "new_reserve_0",
                },
                val: {
                  i128: "2820599927223",
                },
              },
              {
                key: {
                  symbol: "new_reserve_1",
                },
                val: {
                  i128: "2393869922102",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapPair",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "amount_0_in",
                },
                val: {
                  i128: "0",
                },
              },
              {
                key: {
                  symbol: "amount_0_out",
                },
                val: {
                  i128: "4706763496",
                },
              },
              {
                key: {
                  symbol: "amount_1_in",
                },
                val: {
                  i128: "4000000000",
                },
              },
              {
                key: {
                  symbol: "amount_1_out",
                },
                val: {
                  i128: "0",
                },
              },
              {
                key: {
                  symbol: "to",
                },
                val: {
                  address:
                    "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC7CDFY2VGDODJ7WPO3JIK2MXLOAXL4LRQCC43UJDBAIJ4SVFO3HNPOC",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapRouter",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "amounts",
                },
                val: {
                  vec: [
                    {
                      i128: "4000000000",
                    },
                    {
                      i128: "4706763496",
                    },
                  ],
                },
              },
              {
                key: {
                  symbol: "path",
                },
                val: {
                  vec: [
                    {
                      address:
                        "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
                    },
                    {
                      address:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                    },
                  ],
                },
              },
              {
                key: {
                  symbol: "to",
                },
                val: {
                  address:
                    "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_exact_tokens_for_tokens",
            },
          ],
          data: {
            vec: [
              {
                i128: "4000000000",
              },
              {
                i128: "4706763496",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "9772801705",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "3cfa2561c2b2aa114bca58a0e56453f4e99c0d191d6914bce1672c2d507a1021",
            },
            {
              symbol: "get_tokens",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "get_tokens",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              },
              {
                address:
                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "10677983146",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "3cfa2561c2b2aa114bca58a0e56453f4e99c0d191d6914bce1672c2d507a1021",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                u32: 1,
              },
              {
                u32: 0,
              },
              {
                u128: "4706763496",
              },
              {
                u128: "1",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                i128: "4706763496",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
            },
            {
              address:
                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
            },
            {
              string:
                "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
            },
          ],
          data: {
            i128: "4706763496",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                i128: "19453242062",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
            },
            {
              address:
                "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "19453242062",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "80176910c0ed131a1c1e21fd8abbc94618e664834634b0b3fa72eef04b972384",
            },
            {
              symbol: "update",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                symbol: "standard",
              },
              {
                vec: [
                  {
                    u128: "10",
                  },
                ],
              },
              {
                vec: [
                  {
                    u128: "110365532322447",
                  },
                  {
                    u128: "26681234346057",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "update",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "trade",
            },
            {
              address:
                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
            },
            {
              address:
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            },
            {
              address:
                "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
            },
          ],
          data: {
            vec: [
              {
                i128: "4706763496",
              },
              {
                i128: "19453242062",
              },
              {
                i128: "2353382",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "update_reserves",
            },
          ],
          data: {
            vec: [
              {
                i128: "110365532322447",
              },
              {
                i128: "26681234346057",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            u128: "19453242062",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "30131225208",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
            },
            {
              symbol: "router_pair_for",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              },
              {
                address:
                  "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "router_pair_for",
            },
          ],
          data: {
            address: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "e6a7d9eb7523006a469aa7483ad1107247443c0d82e62763de670848c4e97c90",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "1007801702",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
            },
            {
              symbol: "swap_exact_tokens_for_tokens",
            },
          ],
          data: {
            vec: [
              {
                i128: "19453242062",
              },
              {
                i128: "1",
              },
              {
                vec: [
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    address:
                      "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
                  },
                ],
              },
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                u64: "18446744073709551615",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "2744dc7477e5294c0a952bdc53d194c3c0f41541e03aebd098aee0f3d3f496cb",
            },
            {
              symbol: "get_reserves",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "get_reserves",
            },
          ],
          data: {
            vec: [
              {
                i128: "10519850215666",
              },
              {
                i128: "2165968724057",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                address:
                  "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
              },
              {
                i128: "19453242062",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
            },
            {
              address:
                "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "19453242062",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "2744dc7477e5294c0a952bdc53d194c3c0f41541e03aebd098aee0f3d3f496cb",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            vec: [
              {
                i128: "0",
              },
              {
                i128: "3985931454",
              },
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "e6a7d9eb7523006a469aa7483ad1107247443c0d82e62763de670848c4e97c90",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
              },
              {
                address:
                  "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
              },
              {
                i128: "3985931454",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
            },
            {
              address:
                "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
            },
            {
              string:
                "EURC:GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP2",
            },
          ],
          data: {
            i128: "3985931454",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "10539303457728",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "e6a7d9eb7523006a469aa7483ad1107247443c0d82e62763de670848c4e97c90",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "2161982792603",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapPair",
            },
            {
              symbol: "sync",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "new_reserve_0",
                },
                val: {
                  i128: "10539303457728",
                },
              },
              {
                key: {
                  symbol: "new_reserve_1",
                },
                val: {
                  i128: "2161982792603",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapPair",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "amount_0_in",
                },
                val: {
                  i128: "19453242062",
                },
              },
              {
                key: {
                  symbol: "amount_0_out",
                },
                val: {
                  i128: "0",
                },
              },
              {
                key: {
                  symbol: "amount_1_in",
                },
                val: {
                  i128: "0",
                },
              },
              {
                key: {
                  symbol: "amount_1_out",
                },
                val: {
                  i128: "3985931454",
                },
              },
              {
                key: {
                  symbol: "to",
                },
                val: {
                  address:
                    "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CATUJXDUO7SSSTAKSUV5YU6RSTB4B5AVIHQDV26QTCXOB46T6SLMWNMY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              string: "SoroswapRouter",
            },
            {
              symbol: "swap",
            },
          ],
          data: {
            map: [
              {
                key: {
                  symbol: "amounts",
                },
                val: {
                  vec: [
                    {
                      i128: "19453242062",
                    },
                    {
                      i128: "3985931454",
                    },
                  ],
                },
              },
              {
                key: {
                  symbol: "path",
                },
                val: {
                  vec: [
                    {
                      address:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                    },
                    {
                      address:
                        "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
                    },
                  ],
                },
              },
              {
                key: {
                  symbol: "to",
                },
                val: {
                  address:
                    "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_exact_tokens_for_tokens",
            },
          ],
          data: {
            vec: [
              {
                i128: "19453242062",
              },
              {
                i128: "3985931454",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "e6a7d9eb7523006a469aa7483ad1107247443c0d82e62763de670848c4e97c90",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            address: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "balance",
            },
          ],
          data: {
            i128: "4993733156",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 77,
              },
            },
          ],
          data: {
            vec: [
              {
                string: "failing with contract error",
              },
              {
                u32: 77,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 77,
              },
            },
          ],
          data: {
            string:
              "escalating error to VM trap from failed host function call: fail_with_error",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC2JAXZ6663YWUS4ETXZV2GTEMAJCZFTKZSAHVABH5RUGGRKYCCKBR3Y",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "log",
            },
          ],
          data: {
            vec: [
              {
                string: "VM call trapped with HostError",
              },
              {
                symbol: "b",
              },
              {
                error: {
                  contract: 77,
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "host_fn_failed",
            },
            {
              error: {
                contract: 77,
              },
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_entry",
            },
          ],
          data: {
            u64: "29",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_entry",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_read_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_write_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_data_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_data_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "cpu_insn",
            },
          ],
          data: {
            u64: "14097141",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "mem_byte",
            },
          ],
          data: {
            u64: "18861173",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "invoke_time_nsecs",
            },
          ],
          data: {
            u64: "1711666",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_data_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_emit_event_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
];

export const TEMP_LONG_PARAMS: DiagnosticEventJson[] = [
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "9e62c293910e3441c38936648da4f701be9f3bd2feb78dbf35dc2461a14c992f",
            },
            {
              symbol: "swap_chained_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GAT2STHP2QJOQMP7AOGN7V55ZC4HCSRTHO5CCUWSF2XXZMTZT7HAQWDE",
              },
              {
                vec: [
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                          },
                          {
                            address:
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                          },
                        ],
                      },
                      {
                        bytes:
                          "b2e02fcfca6c96f8ad5cbd84e7784a777b36d9c96a2459402c4f458462aab7f0",
                      },
                      {
                        address:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                          },
                          {
                            address:
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                          },
                        ],
                      },
                      {
                        bytes:
                          "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                      },
                      {
                        address:
                          "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                          },
                          {
                            address:
                              "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                          },
                        ],
                      },
                      {
                        bytes:
                          "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                      },
                      {
                        address:
                          "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
                          },
                          {
                            address:
                              "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                          },
                        ],
                      },
                      {
                        bytes:
                          "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                      },
                      {
                        address:
                          "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
                      },
                    ],
                  },
                ],
              },
              {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              },
              {
                u128: "2755000000",
              },
              {
                u128: "78271189",
              },
              {
                u32: 300,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GAT2STHP2QJOQMP7AOGN7V55ZC4HCSRTHO5CCUWSF2XXZMTZT7HAQWDE",
              },
              {
                address:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              },
              {
                i128: "78271189",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "GAT2STHP2QJOQMP7AOGN7V55ZC4HCSRTHO5CCUWSF2XXZMTZT7HAQWDE",
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "78271189",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "6033b4250e704e314fb064973d185db922cae0bd272ba5bff19aac570f12ac2f",
            },
            {
              symbol: "swap_chained_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              },
              {
                vec: [
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                          },
                          {
                            address:
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                          },
                        ],
                      },
                      {
                        bytes:
                          "b2e02fcfca6c96f8ad5cbd84e7784a777b36d9c96a2459402c4f458462aab7f0",
                      },
                      {
                        address:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                          },
                          {
                            address:
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                          },
                        ],
                      },
                      {
                        bytes:
                          "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                      },
                      {
                        address:
                          "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                          },
                          {
                            address:
                              "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                          },
                        ],
                      },
                      {
                        bytes:
                          "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                      },
                      {
                        address:
                          "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            address:
                              "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
                          },
                          {
                            address:
                              "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                          },
                        ],
                      },
                      {
                        bytes:
                          "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                      },
                      {
                        address:
                          "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
                      },
                    ],
                  },
                ],
              },
              {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              },
              {
                u128: "2763289870",
              },
              {
                u128: "78271189",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "4e0d6a8014eca7c7e27b4b7c56fdfc2f0ab88f9d941958b003dbf387a6205514",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                u32: 1,
              },
              {
                u32: 0,
              },
              {
                u128: "2763289870",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            u128: "16570301",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "2219fb3aeb5a4fbc7ae04b7bdd928e3343141d89d1adbd9245c34aa7305cbbe3",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                u32: 0,
              },
              {
                u32: 1,
              },
              {
                u128: "16570301",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            u128: "5417",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "b22e1cccd06df9a112e282381337f7c65cadcbf4f37350c3f493997909ea6802",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                u32: 1,
              },
              {
                u32: 0,
              },
              {
                u128: "5417",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            u128: "16460696",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "3cfa2561c2b2aa114bca58a0e56453f4e99c0d191d6914bce1672c2d507a1021",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                u32: 0,
              },
              {
                u32: 1,
              },
              {
                u128: "16460696",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "estimate_swap_strict_receive",
            },
          ],
          data: {
            u128: "77589403",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "78271189",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "78271189",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                address:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              },
              {
                i128: "681786",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "681786",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "3cfa2561c2b2aa114bca58a0e56453f4e99c0d191d6914bce1672c2d507a1021",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                u32: 0,
              },
              {
                u32: 1,
              },
              {
                u128: "16460696",
              },
              {
                u128: "77589403",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                i128: "77589403",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              address:
                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "77589403",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "0",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "16460696",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string:
                "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
            },
          ],
          data: {
            i128: "16460696",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "80176910c0ed131a1c1e21fd8abbc94618e664834634b0b3fa72eef04b972384",
            },
            {
              symbol: "update",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                symbol: "standard",
              },
              {
                vec: [
                  {
                    u128: "10",
                  },
                ],
              },
              {
                vec: [
                  {
                    u128: "118075140042496",
                  },
                  {
                    u128: "25074858205983",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "update",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "trade",
            },
            {
              address:
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            },
            {
              address:
                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
          ],
          data: {
            vec: [
              {
                i128: "77589403",
              },
              {
                i128: "16460696",
              },
              {
                i128: "38795",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "update_reserves",
            },
          ],
          data: {
            vec: [
              {
                i128: "118075140042496",
              },
              {
                i128: "25074858205983",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            u128: "77589403",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "swap",
            },
            {
              vec: [
                {
                  address:
                    "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                },
                {
                  address:
                    "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                },
              ],
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
              },
              {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              },
              {
                address:
                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
              },
              {
                u128: "77589403",
              },
              {
                u128: "16460696",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "b22e1cccd06df9a112e282381337f7c65cadcbf4f37350c3f493997909ea6802",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                u32: 1,
              },
              {
                u32: 0,
              },
              {
                u128: "5417",
              },
              {
                u128: "16460696",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                address:
                  "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
              },
              {
                i128: "16460696",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              address:
                "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
            },
            {
              string:
                "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
            },
          ],
          data: {
            i128: "16460696",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "0",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string:
                "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
            },
          ],
          data: {
            i128: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "4fc673b3805637ddcaf2ff5c29844d8a8985cbf702ddd86042073e2db49da737",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "5417",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string:
                "ETH:GBFXOHVAS43OIWNIO7XLRJAHT3BICFEIKOJLZVXNT572MISM4CMGSOCC",
            },
          ],
          data: {
            i128: "5417",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "80176910c0ed131a1c1e21fd8abbc94618e664834634b0b3fa72eef04b972384",
            },
            {
              symbol: "update",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
              },
              {
                symbol: "standard",
              },
              {
                vec: [
                  {
                    u128: "30",
                  },
                ],
              },
              {
                vec: [
                  {
                    u128: "329726573",
                  },
                  {
                    u128: "998954162782",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "update",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "trade",
            },
            {
              address:
                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
            },
            {
              address:
                "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
          ],
          data: {
            vec: [
              {
                i128: "16460696",
              },
              {
                i128: "5417",
              },
              {
                i128: "24692",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "update_reserves",
            },
          ],
          data: {
            vec: [
              {
                i128: "329726573",
              },
              {
                i128: "998954162782",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            u128: "16460696",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "swap",
            },
            {
              vec: [
                {
                  address:
                    "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                },
                {
                  address:
                    "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                },
              ],
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCZC4HGM2BW7TIIS4KBDQEZX67DFZLOL6TZXGUGD6SJZS6IJ5JUAEZZR",
              },
              {
                address:
                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
              },
              {
                address:
                  "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
              },
              {
                u128: "16460696",
              },
              {
                u128: "5417",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "2219fb3aeb5a4fbc7ae04b7bdd928e3343141d89d1adbd9245c34aa7305cbbe3",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                u32: 0,
              },
              {
                u32: 1,
              },
              {
                u128: "16570301",
              },
              {
                u128: "5417",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "4fc673b3805637ddcaf2ff5c29844d8a8985cbf702ddd86042073e2db49da737",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                address:
                  "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
              },
              {
                i128: "5417",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              address:
                "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
            },
            {
              string:
                "ETH:GBFXOHVAS43OIWNIO7XLRJAHT3BICFEIKOJLZVXNT572MISM4CMGSOCC",
            },
          ],
          data: {
            i128: "5417",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "4fc673b3805637ddcaf2ff5c29844d8a8985cbf702ddd86042073e2db49da737",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "0",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string:
                "ETH:GBFXOHVAS43OIWNIO7XLRJAHT3BICFEIKOJLZVXNT572MISM4CMGSOCC",
            },
          ],
          data: {
            i128: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "cb9a565dc3577a7ea46a9d4191c7124ca836b40d87f531be27f31729f879571a",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "16570301",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string:
                "sUSD:GCHW7CWI7GMIYQYFXMFJNJX5645XGWIINIAEQK3SABQO6CAYL5T7JYIH",
            },
          ],
          data: {
            i128: "16570301",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "80176910c0ed131a1c1e21fd8abbc94618e664834634b0b3fa72eef04b972384",
            },
            {
              symbol: "update",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
              },
              {
                symbol: "standard",
              },
              {
                vec: [
                  {
                    u128: "30",
                  },
                ],
              },
              {
                vec: [
                  {
                    u128: "79537325",
                  },
                  {
                    u128: "244073531754",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "update",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "trade",
            },
            {
              address:
                "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
            },
            {
              address:
                "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
          ],
          data: {
            vec: [
              {
                i128: "5417",
              },
              {
                i128: "16570301",
              },
              {
                i128: "9",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "update_reserves",
            },
          ],
          data: {
            vec: [
              {
                i128: "79537325",
              },
              {
                i128: "244073531754",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            u128: "5417",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "swap",
            },
            {
              vec: [
                {
                  address:
                    "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
                },
                {
                  address:
                    "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                },
              ],
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CARBT6Z25NNE7PD24BFXXXMSRYZUGFA5RHI23PMSIXBUVJZQLS56HJLP",
              },
              {
                address:
                  "CBH4M45TQBLDPXOK6L7VYKMEJWFITBOL64BN3WDAIIDT4LNUTWTTOCKF",
              },
              {
                address:
                  "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
              },
              {
                u128: "5417",
              },
              {
                u128: "16570301",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "4e0d6a8014eca7c7e27b4b7c56fdfc2f0ab88f9d941958b003dbf387a6205514",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                u32: 1,
              },
              {
                u32: 0,
              },
              {
                u128: "2763289870",
              },
              {
                u128: "16570301",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "cb9a565dc3577a7ea46a9d4191c7124ca836b40d87f531be27f31729f879571a",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                address:
                  "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
              },
              {
                i128: "16570301",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              address:
                "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
            },
            {
              string:
                "sUSD:GCHW7CWI7GMIYQYFXMFJNJX5645XGWIINIAEQK3SABQO6CAYL5T7JYIH",
            },
          ],
          data: {
            i128: "16570301",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "cb9a565dc3577a7ea46a9d4191c7124ca836b40d87f531be27f31729f879571a",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "0",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string:
                "sUSD:GCHW7CWI7GMIYQYFXMFJNJX5645XGWIINIAEQK3SABQO6CAYL5T7JYIH",
            },
          ],
          data: {
            i128: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0925b0d6eaf1341128f952757a4595a245adb5bf61cb4794c900b64e3680c2a1",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
              },
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                i128: "2763289870",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              string:
                "VELO:GDM4RQUQQUVSKQA7S6EM7XBZP3FCGH4Q7CL6TABQ7B2BEJ5ERARM2M5M",
            },
          ],
          data: {
            i128: "2763289870",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "80176910c0ed131a1c1e21fd8abbc94618e664834634b0b3fa72eef04b972384",
            },
            {
              symbol: "update",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
              },
              {
                symbol: "standard",
              },
              {
                vec: [
                  {
                    u128: "30",
                  },
                ],
              },
              {
                vec: [
                  {
                    u128: "39438765266393",
                  },
                  {
                    u128: "235804935994",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "update",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "trade",
            },
            {
              address:
                "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
            },
            {
              address:
                "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
          ],
          data: {
            vec: [
              {
                i128: "16570301",
              },
              {
                i128: "2763289870",
              },
              {
                i128: "24856",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "update_reserves",
            },
          ],
          data: {
            vec: [
              {
                i128: "39438765266393",
              },
              {
                i128: "235804935994",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_strict_receive",
            },
          ],
          data: {
            u128: "16570301",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "swap",
            },
            {
              vec: [
                {
                  address:
                    "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
                },
                {
                  address:
                    "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
                },
              ],
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBHA22UACTWKPR7CPNFXYVX57QXQVOEPTWKBSWFQAPN7HB5GEBKRJB63",
              },
              {
                address:
                  "CDFZUVS5YNLXU7VENKOUDEOHCJGKQNVUBWD7KMN6E7ZROKPYPFLRUJFG",
              },
              {
                address:
                  "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
              },
              {
                u128: "16570301",
              },
              {
                u128: "2763289870",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0925b0d6eaf1341128f952757a4595a245adb5bf61cb4794c900b64e3680c2a1",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              },
              {
                address:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              },
              {
                i128: "2763289870",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
            {
              string:
                "VELO:GDM4RQUQQUVSKQA7S6EM7XBZP3FCGH4Q7CL6TABQ7B2BEJ5ERARM2M5M",
            },
          ],
          data: {
            i128: "2763289870",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_chained_strict_receive",
            },
          ],
          data: {
            u128: "77589403",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "0925b0d6eaf1341128f952757a4595a245adb5bf61cb4794c900b64e3680c2a1",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              },
              {
                address:
                  "GAT2STHP2QJOQMP7AOGN7V55ZC4HCSRTHO5CCUWSF2XXZMTZT7HAQWDE",
              },
              {
                i128: "2755000000",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
            {
              address:
                "GAT2STHP2QJOQMP7AOGN7V55ZC4HCSRTHO5CCUWSF2XXZMTZT7HAQWDE",
            },
            {
              string:
                "VELO:GDM4RQUQQUVSKQA7S6EM7XBZP3FCGH4Q7CL6TABQ7B2BEJ5ERARM2M5M",
            },
          ],
          data: {
            i128: "2755000000",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
            },
            {
              symbol: "transfer",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              },
              {
                address:
                  "GAT2STHP2QJOQMP7AOGN7V55ZC4HCSRTHO5CCUWSF2XXZMTZT7HAQWDE",
              },
              {
                i128: "681786",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "transfer",
            },
            {
              address:
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            },
            {
              address:
                "GAT2STHP2QJOQMP7AOGN7V55ZC4HCSRTHO5CCUWSF2XXZMTZT7HAQWDE",
            },
            {
              string: "native",
            },
          ],
          data: {
            i128: "681786",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "transfer",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
      type_: "contract",
      body: {
        v0: {
          topics: [
            {
              symbol: "charge_provider_fee",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CAESLMGW5LYTIEJI7FJHK6SFSWRELLNVX5Q4WR4UZEALMTRWQDBKDPAG",
              },
              {
                u128: "8289870",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "swap_chained_strict_receive",
            },
          ],
          data: {
            u128: "77589403",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_entry",
            },
          ],
          data: {
            u64: "41",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_entry",
            },
          ],
          data: {
            u64: "25",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_read_byte",
            },
          ],
          data: {
            u64: "308",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "ledger_write_byte",
            },
          ],
          data: {
            u64: "13384",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_key_byte",
            },
          ],
          data: {
            u64: "124",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_key_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_data_byte",
            },
          ],
          data: {
            u64: "308",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_data_byte",
            },
          ],
          data: {
            u64: "13384",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "read_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "write_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event",
            },
          ],
          data: {
            u64: "31",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "emit_event_byte",
            },
          ],
          data: {
            u64: "7180",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "cpu_insn",
            },
          ],
          data: {
            u64: "23581272",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "mem_byte",
            },
          ],
          data: {
            u64: "25380766",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "invoke_time_nsecs",
            },
          ],
          data: {
            u64: "3719617",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_key_byte",
            },
          ],
          data: {
            u64: "112",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_data_byte",
            },
          ],
          data: {
            u64: "2512",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_rw_code_byte",
            },
          ],
          data: {
            u64: "0",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: true,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "core_metrics",
            },
            {
              symbol: "max_emit_event_byte",
            },
          ],
          data: {
            u64: "368",
          },
        },
      },
    },
  },
];
