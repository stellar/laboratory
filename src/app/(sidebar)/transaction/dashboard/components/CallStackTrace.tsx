import React, { JSX, useState } from "react";
import { Alert, Icon, Label, Text, Toggle } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import {
  DiagnosticEventJson,
  formatDiagnosticEvents,
  FormattedEventData,
  ProcessedEvent,
} from "@/helpers/formatDiagnosticEvents";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";

import { getContractIdError } from "@/validate/methods/getContractIdError";
import { useStore } from "@/store/useStore";
import { STELLAR_EXPERT } from "@/constants/settings";

import { AnyObject, NetworkType } from "@/types/types";

export const CallStackTrace = ({
  diagnosticEvents,
}: {
  diagnosticEvents: DiagnosticEventJson[] | AnyObject | undefined;
}) => {
  const { network } = useStore();

  const data =
    diagnosticEvents && Array.isArray(diagnosticEvents)
      ? formatDiagnosticEvents(diagnosticEvents)
      : null;

  const [isCollapsedView, setIsCollapsedView] = useState(false);

  if (!data?.callStack?.length) {
    return (
      <TransactionTabEmptyMessage title="No call stack trace">
        This transaction has no call stack trace.
      </TransactionTabEmptyMessage>
    );
  }

  const truncateParams = (
    data: FormattedEventData[],
    maxItems: number,
  ): FormattedEventData[] => {
    let itemCount = 0;
    let ellipsisAdded = false;

    const isContainer = (type: string): boolean => {
      return type === "vec" || type === "map";
    };

    const addEllipsisIfNeeded = (items: any[], wasTruncated: boolean) => {
      if (wasTruncated && !ellipsisAdded && items.length > 0) {
        items.push({ value: "...", type: "ellipsis" });
        ellipsisAdded = true;
      }
    };

    const truncateArray = (items: any[]) => {
      const truncatedArray: any[] = [];
      let wasTruncated = false;

      for (const item of items) {
        if (itemCount >= maxItems) {
          wasTruncated = true;
          break;
        }

        const result = traverse(item);

        if (result !== undefined) {
          truncatedArray.push(result);
        }
      }

      addEllipsisIfNeeded(truncatedArray, wasTruncated);

      return {
        truncatedArray,
        wasTruncated,
      };
    };

    const traverse = (node: any): any => {
      if (
        node &&
        typeof node === "object" &&
        "type" in node &&
        "value" in node
      ) {
        const isContainerType = isContainer(node.type);

        if (!isContainerType) {
          itemCount++;

          if (itemCount > maxItems) {
            return undefined;
          }

          return node;
        }

        if (Array.isArray(node.value)) {
          const { truncatedArray } = truncateArray(node.value);

          if (truncatedArray.length > 0) {
            return { ...node, value: truncatedArray };
          }

          return undefined;
        }

        return node;
      }

      if (Array.isArray(node)) {
        const { truncatedArray } = truncateArray(node);

        return truncatedArray.length > 0 ? truncatedArray : undefined;
      }

      return node;
    };

    const result: FormattedEventData[] | undefined = traverse(data);

    return result || [];
  };

  const hasEllipsisAnywhere = (data: any): boolean => {
    if (!data) return false;

    if (Array.isArray(data)) {
      return data.some((item) => {
        if (item?.type === "ellipsis") return true;

        if (Array.isArray(item?.value)) return hasEllipsisAnywhere(item.value);

        return false;
      });
    }

    return false;
  };

  const renderData = ({
    dataItem,
    parentId,
    voidAsEmptyFn,
    isFnParams,
  }: {
    dataItem: FormattedEventData;
    parentId?: string;
    voidAsEmptyFn?: boolean;
    isFnParams?: boolean;
  }) => {
    const { type, value } = dataItem;

    // Ellipsis (special case) for collapsed params
    if (type === "ellipsis") {
      return <span className="CallStackTrace__ellipsis">{value}</span>;
    }

    // Array
    if (type === "vec") {
      let renderVal = value;

      if (isFnParams && isCollapsedView) {
        renderVal = truncateParams(value, 4);
      }

      const hasEllipsis = hasEllipsisAnywhere(renderVal);

      return (
        <span className="CallStackTrace__itemArray">
          {/* Don’t show square brackets for param arrays */}
          {parentId ? <Bracket char="[" /> : null}
          <span
            className="CallStackTrace__itemArray__items"
            data-has-ellipsis={hasEllipsis}
          >
            {renderVal.map((v, vIndex) => {
              const id = `vec-${vIndex}`;

              return (
                <span
                  key={parentId ? `${parentId}-${id}` : `${id}`}
                  className="CallStackTrace__itemArray__item"
                >
                  {renderData({ dataItem: v, parentId: id })}
                  <Comma enabled={vIndex !== renderVal.length - 1} />
                </span>
              );
            })}
          </span>
          {/* We need to hide extra brackets if there is ellipsis */}
          {parentId && !hasEllipsis ? <Bracket char="]" /> : null}
        </span>
      );
    }

    // Object
    if (type === "map") {
      return (
        <span className="CallStackTrace__itemObject">
          <Bracket char="{" />
          {value.map((v, vIndex) => {
            return (
              <span
                key={`map-${v.key.type}-${vIndex}`}
                className="CallStackTrace__itemObject__item"
              >
                {renderData({ dataItem: v.key })}
                <Colon />
                {renderData({ dataItem: v.val })}
                <Comma enabled={vIndex !== value.length - 1} />
              </span>
            );
          })}
          {!hasEllipsisAnywhere(value.map((item) => item.val)) && (
            <Bracket char="}" />
          )}
        </span>
      );
    }

    // Void
    if (type === "void") {
      // For function params, we want to show void as ()
      return <TypedValueItem value={voidAsEmptyFn ? "()" : "void"} />;
    }

    if (type === "address") {
      return <AddressItem value={value} networkId={network.id} />;
    }

    // Primitive
    return (
      <TypedValueItem
        value={value}
        type={type}
        title={isAsset(value) ? `${value}` : undefined}
      />
    );
  };

  const renderContractId = (contractId: string) => (
    <span className="CallStackTrace__itemContract">
      <span>at</span>
      <SdsLink
        variant="secondary"
        href={buildContractExplorerHref(contractId)}
        target="_blank"
        isUnderline
        title={contractId}
      >
        {shortenStellarAddress(contractId)}
      </SdsLink>
    </span>
  );

  const renderItemContent = (event: ProcessedEvent) => {
    // Contract event
    if (event.type === "contract_event") {
      return (
        <span className="CallStackTrace__itemContent">
          <span>
            <span
              className="CallStackTrace__itemFunc"
              data-is-collapsed={isCollapsedView}
            >
              <span className="CallStackTrace__itemFunc__func">
                {event.name}
              </span>
              {event.dataContractParams?.length ? (
                <>
                  <Bracket char="[" />
                  <span className="CallStackTrace__itemFunc__params">
                    {renderData({
                      dataItem: {
                        type: "vec",
                        value: event.dataContractParams,
                      },
                      voidAsEmptyFn: true,
                      isFnParams: true,
                    })}
                  </span>
                  <Bracket char="]" />
                </>
              ) : null}
            </span>

            {event.contractId ? renderContractId(event.contractId) : null}
          </span>

          <span className="CallStackTrace__itemData">
            <span>data:</span>
            {renderData({
              dataItem: event.data,
              voidAsEmptyFn: true,
              parentId: `data-${event.name}`,
            })}
          </span>
        </span>
      );
    }

    // Function
    return (
      <span className="CallStackTrace__itemContent">
        <span>
          <span
            className="CallStackTrace__itemFunc"
            data-is-collapsed={isCollapsedView}
          >
            <span className="CallStackTrace__itemFunc__func">{event.name}</span>
            <Bracket char="(" />
            <span className="CallStackTrace__itemFunc__params">
              {renderData({
                dataItem: event.data,
                voidAsEmptyFn: true,
                isFnParams: true,
              })}
            </span>
            <Bracket char=")" />
          </span>

          {event.contractId ? renderContractId(event.contractId) : null}
        </span>

        {event.return ? (
          <span className="CallStackTrace__itemReturn">
            <span className="CallStackTrace__icon">
              <Icon.ArrowRight />
            </span>
            {renderData({
              dataItem: event.return.data,
              parentId: event.name,
            })}
            {event.return?.contractId
              ? renderContractId(event.return.contractId)
              : null}
          </span>
        ) : null}
      </span>
    );
  };

  const renderNested = (
    events: ProcessedEvent[],
    parentId?: string,
    depth: number = 0,
  ) => {
    return events.map((event, eventIndex) => {
      return (
        <div
          key={
            parentId
              ? `${parentId}-${event.type}-${eventIndex}`
              : `${event.type}-${eventIndex}`
          }
          className="CallStackTrace__event"
          data-is-error={event.isError}
        >
          <EventItem
            event={event}
            depth={depth}
            renderContent={renderItemContent}
            renderNested={renderNested}
          />
        </div>
      );
    });
  };

  return (
    <Box gap="md">
      <Box
        gap="md"
        direction="row"
        align="center"
        justify="space-between"
        wrap="wrap"
      >
        <Text as="div" size="xs" weight="regular">
          This log shows all contract-related events that occurred during the
          transaction in chronological order.
        </Text>

        <Box gap="xs" direction="row" align="center">
          <Label htmlFor="call-stack-params-toggle" size="sm">
            Show all params
          </Label>

          <Toggle
            id="call-stack-params-toggle"
            fieldSize="sm"
            checked={isCollapsedView}
            onChange={() => setIsCollapsedView(!isCollapsedView)}
          />
        </Box>
      </Box>

      {data.errorLevel === "all" ? (
        <Alert placement="inline" variant="error" title="Transaction failed">
          This transaction failed and was fully rolled back. All state changes
          were reverted, and no contract effects were applied.
        </Alert>
      ) : null}

      {data.errorLevel === "some" ? (
        <Alert
          placement="inline"
          variant="warning"
          title="Transaction partially failed"
        >
          This transaction succeeded, but some internal contract calls failed
          and their effects were rolled back.
        </Alert>
      ) : null}

      <div className="CallStackTrace" data-error-level={data.errorLevel}>
        <div className="CallStackTrace__scrollable">
          {renderNested(data.callStack)}
        </div>
      </div>
    </Box>
  );
};

// =============================================================================
// Helpers
// =============================================================================
const isAsset = (value: unknown) => {
  return typeof value === "string" && value?.split(":")?.length === 2;
};

const renderAssetString = (value: string) => {
  if (isAsset(value)) {
    const [code, issuer] = value.split(":");

    return `${code}:${shortenStellarAddress(issuer)}`;
  }

  return value;
};

// =============================================================================
// Components
// =============================================================================
const TypedValueItem = ({
  value,
  type,
  title,
}: {
  value: any;
  type?: string;
  title?: string;
}) => {
  const val =
    type && ["string", "symbol"].includes(type) ? (
      <Quotes>{renderAssetString(value)}</Quotes>
    ) : (
      `${value}`
    );

  return (
    <span
      className="CallStackTrace__typedValueItem"
      {...(type ? { "data-type": type === "symbol" ? "sym" : type } : {})}
      {...(title ? { title } : {})}
    >
      {val}
    </span>
  );
};

const AddressItem = ({
  value,
  networkId,
}: {
  value: any;
  networkId: NetworkType;
}) => {
  const seNetwork = getStellarExpertNetwork(networkId);
  const isContract = !getContractIdError(value);

  let linkEl: string | JSX.Element;

  // Stellar account on Futurnet or Custom network
  if (!isContract && !seNetwork) {
    linkEl = shortenStellarAddress(value);
  } else {
    const props = {
      href: isContract
        ? buildContractExplorerHref(value)
        : `${STELLAR_EXPERT}/${seNetwork}/account/${value}`,
      ...(isContract ? { target: "_blank" } : {}),
    };

    linkEl = (
      <SdsLink variant="secondary" {...props} isUnderline>
        {shortenStellarAddress(value)}
      </SdsLink>
    );
  }

  return (
    <span
      className="CallStackTrace__typedValueItem"
      data-type="address"
      title={value}
    >
      {linkEl}
    </span>
  );
};

const Comma = ({ enabled }: { enabled?: boolean }) => {
  if (enabled) {
    return <span className="CallStackTrace__comma">,</span>;
  }

  return null;
};

const Colon = () => {
  return <span className="CallStackTrace__colon">:</span>;
};

const Bracket = ({
  char,
  hasComma,
}: {
  char: "{" | "}" | "[" | "]" | "(" | ")";
  hasComma?: boolean;
}) => (
  <span className="CallStackTrace__bracket">
    {char}
    {hasComma ? <Comma /> : null}
  </span>
);

const Quotes = ({ children }: { children: React.ReactNode }) => (
  <>
    <span className="CallStackTrace__quotes">{'"'}</span>
    {children}
    <span className="CallStackTrace__quotes">{'"'}</span>
  </>
);

const EventItem = ({
  event,
  depth,
  renderContent,
  renderNested,
}: {
  event: ProcessedEvent;
  depth: number;
  renderContent: (event: ProcessedEvent) => JSX.Element;
  renderNested: (
    events: ProcessedEvent[],
    parentId?: string,
    depth?: number,
  ) => JSX.Element[];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasNestedItems = event.nested.length > 0;

  const getVerticalLineTop = () => {
    const basePoint = depth === 1 ? 16 : 0;

    return hasNestedItems ? basePoint + 26 : basePoint;
  };

  const getVerticalLineHeight = () => {
    const basePoint = depth === 1 ? 16 : 0;

    return basePoint + verticalLineTop;
  };

  const verticalLineTop = getVerticalLineTop();

  return (
    <>
      <div className="CallStackTrace__event__info">
        {hasNestedItems && isExpanded ? (
          <div
            className="CallStackTrace__verticalLine"
            data-depth={depth}
            style={{
              left: `${depth === 0 ? 8 : 27}px`,
              top: `${verticalLineTop}px`,
              height:
                depth === 0
                  ? "100%"
                  : `calc(100% - ${getVerticalLineHeight()}px)`,
            }}
          ></div>
        ) : null}

        {/* Don’t render arrow if it’s a top-level item without nested items */}
        {depth === 0 && !hasNestedItems ? null : (
          <span
            role="button"
            tabIndex={0}
            className="CallStackTrace__icon"
            data-visible={hasNestedItems}
            data-is-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon.ChevronDown />
          </span>
        )}

        {event.isError ? (
          <span className="CallStackTrace__itemError CallStackTrace__icon">
            <Icon.XCircle />
          </span>
        ) : null}

        <span className="CallStackTrace__itemType" data-type={event.type}>
          {event.type}
        </span>

        {renderContent(event)}
      </div>

      {event.nested.length && isExpanded ? (
        <div className="CallStackTrace__event__nested">
          {renderNested(event.nested, undefined, depth + 1)}
        </div>
      ) : null}
    </>
  );
};
