import React, { useState } from "react";
import { Icon } from "@stellar/design-system";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { isValidUrl } from "@/helpers/isValidUrl";
import { SdsLink } from "@/components/SdsLink";
import { AnyObject } from "@/types/types";

import "./styles.scss";

export type CustomKeyValueLinkMap = {
  [key: string]: {
    text?: string;
    getHref: (value: string, key?: string) => string;
    condition?: (val: string) => boolean;
  };
};

type PrettyJsonProps = {
  json: AnyObject;
  customKeyValueLinkMap?: CustomKeyValueLinkMap;
};

type Char = "{" | "}" | "[" | "]";

export const PrettyJson = ({
  json,
  customKeyValueLinkMap,
}: PrettyJsonProps) => {
  if (typeof json !== "object") {
    return null;
  }

  const Key = ({ children }: { children: string }) => (
    <div className="PrettyJson__key">
      {`"${children}"`}
      <Colon />
    </div>
  );
  const Value = ({ children }: { children: React.ReactNode }) => (
    <div className="PrettyJson__value">{children}</div>
  );
  const ValueType = ({
    children,
    type,
  }: {
    children: React.ReactNode;
    type: string;
  }) => <span className={`PrettyJson__value--${type}`}>{children}</span>;
  const Quotes = () => <span className="PrettyJson__quotes">{'"'}</span>;
  const Colon = () => <span className="PrettyJson__colon">{":"}</span>;
  const Comma = () => <span className="PrettyJson__comma">{","}</span>;
  const Bracket = ({
    char,
    children,
    isCollapsed,
  }: {
    char: Char;
    children?: React.ReactNode;
    isCollapsed?: boolean;
  }) => (
    <span className="PrettyJson__bracket">
      {char}
      {children}
      {isCollapsed ? `...${getClosingChar(char)}` : null}
    </span>
  );
  const ItemCount = ({ itemList }: { itemList: any[] }) => (
    <div className="PrettyJson__expandSize">{getItemSizeLabel(itemList)}</div>
  );

  const Collapsible = ({
    key,
    itemKey,
    itemList,
    char,
    children,
  }: {
    key: string;
    itemKey?: string;
    itemList: any[];
    char: Char;
    children: React.ReactNode;
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <div key={key} className="PrettyJson__nested">
        <div
          className="PrettyJson__inline PrettyJson--click"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="PrettyJson__expandIcon">
            {isExpanded ? <Icon.MinusSquare /> : <Icon.PlusSquare />}
          </div>
          {itemKey ? <Key>{itemKey}</Key> : null}
          <Bracket char={char} isCollapsed={!isExpanded} />
          <ItemCount itemList={itemList} />
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

  const getClosingChar = (char: Char) => (char === "[" ? "]" : "}");

  const render = (item: any, parentKey?: string): React.ReactElement => {
    const renderValue = (item: any, key: string) => {
      const custom = customKeyValueLinkMap?.[key];

      if (custom) {
        if (custom.condition && !custom.condition(item)) {
          return render(item, key);
        }

        const href = custom.getHref(item, key);

        return (
          <SdsLink href={href || item} {...(href ? { target: "_blank" } : {})}>
            {custom.text || item}
          </SdsLink>
        );
      }

      return render(item, key);
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
                              {render(v)}
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
                  {renderValue(value, key)}
                </div>
              );
            })}
          </React.Fragment>
        );
      case "string":
        return (
          <Value>
            {isValidUrl(item) ? (
              <>
                <Quotes />
                <SdsLink href={item}>{item}</SdsLink>
                <Quotes />
              </>
            ) : (
              <>
                <Quotes />
                <ValueType type={isNaN(Number(item)) ? "string" : "number"}>
                  {item}
                </ValueType>
                <Quotes />
              </>
            )}
            <Comma />
          </Value>
        );
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

  return (
    <div className="PrettyJson">
      <Bracket char="{" />
      {render(json)}
      <Bracket char="}" />
    </div>
  );
};
