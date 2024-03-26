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

  const render = (item: any): React.ReactElement => {
    switch (typeof item) {
      case "object":
        return (
          <>
            {Object.entries(item).map(([key, value]) => {
              if (typeof value === "object") {
                if (Array.isArray(value)) {
                  if (value.length === 0) {
                    return (
                      <div key={key} className="PrettyJson__inline">
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
                    <div key={key} className="PrettyJson__nested">
                      <div className="PrettyJson__inline">
                        <Key>{key}</Key>
                        <Bracket char="[" />
                      </div>
                      <div>{value.map((v) => render(v))}</div>
                      <div>
                        <Bracket char="]" />
                        <Comma />
                      </div>
                    </div>
                  );
                }

                if (value && isEmptyObject(value)) {
                  return (
                    <div key={key} className="PrettyJson__inline">
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
                  <div key={key} className="PrettyJson__nested">
                    <div className="PrettyJson__inline">
                      <Key>{key}</Key>
                      <Bracket char="{" />
                    </div>
                    <div>{render(value)}</div>
                    <div>
                      <Bracket char="}" />
                      <Comma />
                    </div>
                  </div>
                );
              }

              return (
                <div key={key} className="PrettyJson__inline">
                  <div className="PrettyJson__nested">
                    <Key>{key}</Key>
                  </div>
                  {render(value)}
                </div>
              );
            })}
          </>
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
              `"${item}"`
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
            {`${item}`}
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
