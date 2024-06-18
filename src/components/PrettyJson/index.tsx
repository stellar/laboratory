import React from "react";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { isValidUrl } from "@/helpers/isValidUrl";
import { SdsLink } from "@/components/SdsLink";
import { AnyObject } from "@/types/types";

import "./styles.scss";

export const PrettyJson = ({ json }: { json: AnyObject }) => {
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
  }: {
    char: "{" | "}" | "[" | "]";
    children?: React.ReactNode;
  }) => (
    <span className="PrettyJson__bracket">
      {char}
      {children}
    </span>
  );

  const render = (item: any, parentKey?: string): React.ReactElement => {
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
                    <div key={keyProp} className="PrettyJson__nested">
                      <div className="PrettyJson__inline">
                        <Key>{key}</Key>
                        <Bracket char="[" />
                      </div>
                      <div>
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
                              <div
                                key={`${keyProp}-${index}`}
                                className="PrettyJson__nested"
                              >
                                <div className="PrettyJson__inline">
                                  <Bracket char="{" />
                                </div>
                                <div>{render(v)}</div>
                                <div>
                                  <Bracket char="}" />
                                  <Comma />
                                </div>
                              </div>
                            );
                          }

                          return render(v, key);
                        })}
                      </div>
                      <div>
                        <Bracket char="]" />
                        <Comma />
                      </div>
                    </div>
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
                  <div key={keyProp} className="PrettyJson__nested">
                    <div className="PrettyJson__inline">
                      <Key>{key}</Key>
                      <Bracket char="{" />
                    </div>
                    <div>{render(value, key)}</div>
                    <div>
                      <Bracket char="}" />
                      <Comma />
                    </div>
                  </div>
                );
              }

              return (
                <div key={keyProp} className="PrettyJson__inline">
                  <div className="PrettyJson__nested">
                    <Key>{key}</Key>
                  </div>
                  {render(value, key)}
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
