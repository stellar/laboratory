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

const calculateErrorLevel = (callStack: ProcessedEvent[]): ErrorLevel => {
  // Recursively flattens the event tree to get all events including nested ones.
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
const formatContractParams = (
  eventType: string | undefined,
  topics: ScValType[] | undefined,
): FormattedEventData[] | undefined => {
  if (eventType !== EVENT_TYPES.CONTRACT || !topics) {
    return undefined;
  }

  return topics.map((topic) => formatEventData(topic));
};

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

export const formatDiagnosticEvents = (
  dEvents: DiagnosticEventJson[],
): {
  callStack: ProcessedEvent[];
  // In case we want to include core metrics in the future
  // coreMetrics: CoreMetric[];
  errorLevel: ErrorLevel;
} => {
  // Early return for empty input
  if (!dEvents || dEvents.length === 0) {
    return {
      callStack: [],
      // coreMetrics: [],
      errorLevel: undefined,
    };
  }

  const { callStack } = processEvents(dEvents);

  return {
    callStack,
    // coreMetrics,
    errorLevel: calculateErrorLevel(callStack),
  };
};
