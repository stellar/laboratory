import React, { useState } from "react";
import { Icon, Loader } from "@stellar/design-system";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { isValidUrl } from "@/helpers/isValidUrl";

import { SdsLink } from "@/components/SdsLink";
import { AnyObject } from "@/types/types";

import "./styles.scss";

export type CustomKeyValueLinkMap = {
  [key: string]: {
    text?: string;
    getHref: (value: string, key?: string) => string;
    condition?: (
      val: string,
      parentKey?: string,
      isRpcResponse?: boolean,
    ) => boolean;
  };
};

type PrettyJsonProps = {
  json: AnyObject;
  customKeyValueLinkMap?: CustomKeyValueLinkMap;
  customValueRenderer?: (
    item: any,
    key: string,
    parentKey?: string,
  ) => React.ReactNode | null;
  customKeyRenderer?: (item: any, key: string) => React.ReactNode | null;
  isLoading?: boolean;
  isCollapsible?: boolean;
};

type Char = "{" | "}" | "[" | "]";

export const PrettyJson = ({
  json,
  customKeyValueLinkMap,
  customValueRenderer,
  customKeyRenderer,
  isLoading,
  isCollapsible = true,
}: PrettyJsonProps) => {
  if (typeof json !== "object") {
    return null;
  }

  const isRpcResponse = Object.keys(json)[0] === "jsonrpc";

  const ItemCount = ({ itemList }: { itemList: any[] }) => (
    <div className="PrettyJson__expandSize">{getItemSizeLabel(itemList)}</div>
  );

  const Collapsible = ({
    itemKey,
    itemList,
    char,
    children,
  }: {
    itemKey?: string;
    itemList: any[];
    char: Char;
    children: React.ReactNode;
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const customRender =
      itemKey && customKeyRenderer
        ? customKeyRenderer(children, itemKey)
        : null;

    return (
      <div
        className="PrettyJson__nested"
        {...(customRender ? { "data-is-custom-key": "" } : {})}
      >
        <div
          className={`PrettyJson__inline ${isCollapsible ? "PrettyJson--click" : ""}`}
          {...(isCollapsible
            ? {
                onClick: () => setIsExpanded(!isExpanded),
              }
            : {})}
        >
          {isCollapsible ? (
            <div className="PrettyJson__expandIcon">
              {isExpanded ? <Icon.MinusSquare /> : <Icon.PlusSquare />}
            </div>
          ) : null}
          {itemKey ? <Key>{itemKey}</Key> : null}
          <Bracket char={char} isCollapsed={!isExpanded} />
          {isCollapsible ? <ItemCount itemList={itemList} /> : null}
          {customRender}
        </div>
        {isExpanded ? (
          <div>
            {children}
            <div>
              <Bracket char={getClosingChar(char)} />
              <Comma />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const getItemSizeLabel = (items: any[]) => {
    const size = items.length;

    return size === 1 ? `${size} item` : `${size} items`;
  };

  const render = (item: any, parentKey?: string): React.ReactElement => {
    const renderValue = (item: any, key: string, parentKey?: string) => {
      const custom = customKeyValueLinkMap?.[key];

      if (custom) {
        if (
          custom.condition &&
          !custom.condition(item, parentKey, isRpcResponse)
        ) {
          return render(item, key);
        }

        const href = custom.getHref(item, key);

        return (
          <SdsLink
            href={href || item}
            {...(href ? { target: "_blank" } : {})}
            isUnderline
          >
            {custom.text || item}
          </SdsLink>
        );
      }

      const customValue = customValueRenderer
        ? customValueRenderer(item, key, parentKey)
        : null;

      return customValue ?? render(item, key);
    };

    switch (typeof item) {
      case "object":
        return (
          <React.Fragment key={parentKey}>
            {Object.entries(item).map(([key, value]) => {
              const keyProp = parentKey ? `${parentKey}-${key}` : key;

              if (typeof value === "object") {
                if (value === null) {
                  return (
                    <div key={keyProp} className="PrettyJson__inline">
                      <div className="PrettyJson__nested">
                        <Key>{key}</Key>
                      </div>
                      <Value>
                        null
                        <Comma />
                      </Value>
                    </div>
                  );
                }

                if (Array.isArray(value)) {
                  if (value.length === 0) {
                    return (
                      <div key={keyProp} className="PrettyJson__inline">
                        <div className="PrettyJson__nested">
                          <Key>{key}</Key>
                        </div>
                        <Value>
                          {`[]`}
                          <Comma />
                        </Value>
                      </div>
                    );
                  }

                  return (
                    <Collapsible
                      key={keyProp}
                      itemKey={key}
                      itemList={value}
                      char="["
                    >
                      {value.map((v, index) => {
                        if (typeof v === "object") {
                          if (v === null) {
                            return (
                              <div
                                key={`${keyProp}-${index}`}
                                className="PrettyJson__nested"
                              >
                                <Value>
                                  null
                                  <Comma />
                                </Value>
                              </div>
                            );
                          }

                          return (
                            <Collapsible
                              key={`${keyProp}-${index}`}
                              itemList={Object.keys(v)}
                              char="{"
                            >
                              {render(v, key)}
                            </Collapsible>
                          );
                        }

                        return render(v, key);
                      })}
                    </Collapsible>
                  );
                }

                if (value && isEmptyObject(value)) {
                  return (
                    <div key={keyProp} className="PrettyJson__inline">
                      <div className="PrettyJson__nested">
                        <Key>{key}</Key>
                      </div>
                      <Value>
                        {`{}`}
                        <Comma />
                      </Value>
                    </div>
                  );
                }

                return (
                  <Collapsible
                    key={keyProp}
                    itemKey={key}
                    itemList={Object.keys(value)}
                    char="{"
                  >
                    {render(value, key)}
                  </Collapsible>
                );
              }

              return (
                <div key={keyProp} className="PrettyJson__inline">
                  <div className="PrettyJson__nested">
                    <Key>{key}</Key>
                  </div>
                  {renderValue(value, key, parentKey)}
                </div>
              );
            })}
          </React.Fragment>
        );
      case "string":
        return renderStringValue({ item, parentKey, customValueRenderer });
      case "function":
        return (
          <Value>
            {`${JSON.stringify(item)}`}
            <Comma />
          </Value>
        );
      default:
        return (
          <Value>
            <ValueType type={typeof item}>{`${item}`}</ValueType>
            <Comma />
          </Value>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="PrettyJson__loaderContainer">
        <Loader />
      </div>
    );
  }

  return (
    <div className="PrettyJson">
      <Bracket char="{" />
      {render(json)}
      <Bracket char="}" isEnd />
    </div>
  );
};

// =============================================================================
// Components
// =============================================================================
const Key = ({ children }: { children: string }) => (
  <div className="PrettyJson__key">
    {`"${children}"`}
    <Colon />
  </div>
);

const Value = ({
  children,
  addlClassName,
}: {
  children: React.ReactNode;
  addlClassName?: string;
}) => (
  <div className={`PrettyJson__value ${addlClassName || ""}`}>{children}</div>
);

const ValueType = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) => <span className={`PrettyJson__value--${type}`}>{children}</span>;

const Quotes = ({ isVisible = true }: { isVisible?: boolean }) =>
  isVisible ? <span className="PrettyJson__quotes">{'"'}</span> : null;

const Colon = () => <span className="PrettyJson__colon">{":"}</span>;

const Comma = () => <span className="PrettyJson__comma">{","}</span>;

const Bracket = ({
  char,
  children,
  isCollapsed,
  isEnd,
}: {
  char: Char;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  isEnd?: boolean;
}) => (
  <span
    className={`PrettyJson__bracket${isEnd ? " PrettyJson__bracket--end" : ""}`}
  >
    {char}
    {children}
    {isCollapsed ? `...${getClosingChar(char)}` : null}
  </span>
);

// =============================================================================
// Helpers
// =============================================================================
const getClosingChar = (char: Char) => (char === "[" ? "]" : "}");

const renderStringValue = ({
  item,
  addlClassName,
  itemType,
  parentKey,
  customValueRenderer,
}: {
  item: string;
  addlClassName?: string;
  itemType?: "number" | "string";
  parentKey?: string;
  customValueRenderer?: (
    item: any,
    key: string,
    parentKey?: string,
  ) => React.ReactNode | null;
}) => {
  const customValue =
    customValueRenderer && customValueRenderer(item, "", parentKey);

  if (customValue) {
    return (
      <Value addlClassName={addlClassName}>
        <>{customValue}</>
        <Comma />
      </Value>
    );
  }

  let type = ["number", "bigint"].includes(typeof item) ? "number" : "string";
  let value = item;

  if (typeof item === "bigint") {
    value = BigInt(item).toString();
  }

  if (itemType) {
    type = itemType;
  }

  return (
    <Value addlClassName={addlClassName}>
      {typeof item === "string" && isValidUrl(item) ? (
        <>
          <Quotes />
          <SdsLink href={item} isUnderline>
            {item}
          </SdsLink>
          <Quotes />
        </>
      ) : (
        <>
          <Quotes isVisible={type === "string"} />
          <ValueType type={type}>{value}</ValueType>
          <Quotes isVisible={type === "string"} />
        </>
      )}
      <Comma />
    </Value>
  );
};

PrettyJson.renderStringValue = renderStringValue;
