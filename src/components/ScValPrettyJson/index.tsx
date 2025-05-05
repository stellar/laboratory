import { Fragment } from "react";
import { XdrLargeInt } from "@stellar/stellar-sdk";
import { parse, stringify } from "lossless-json";
import { v4 as uuidv4 } from "uuid";

import { SdsLink } from "@/components/SdsLink";
import { STELLAR_EXPERT } from "@/constants/settings";

import { useStore } from "@/store/useStore";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import * as StellarXdr from "@/helpers/StellarXdr";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";
import { getContractIdError } from "@/validate/methods/getContractIdError";

import { AnyObject } from "@/types/types";

import "./styles.scss";

/* Create contract storage JSON-like structure */
export const ScValPrettyJson = ({
  isReady,
  xdrString,
  json,
}: {
  isReady: boolean;
  xdrString?: string;
  json?: AnyObject | null;
}) => {
  const { network } = useStore();

  if (!isReady) {
    return null;
  }

  const parseJson = () => {
    try {
      return xdrString
        ? (parse(StellarXdr.decode("ScVal", xdrString)) as AnyObject)
        : null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  };

  type ItemType =
    | "array"
    | "object"
    | "function"
    | "primitive"
    | "boolean"
    | null;

  const getItemType = (item: any): ItemType => {
    if (typeof item === "object") {
      if (Array.isArray(item)) {
        return "array";
      } else {
        return item === null ? null : "object";
      }
    } else {
      return "primitive";
    }
  };

  const renderAddress = (value: string) => {
    const seNetwork = getStellarExpertNetwork(network.id);
    const isContract = !getContractIdError(value);

    if (seNetwork) {
      const params = isContract
        ? {
            href: buildContractExplorerHref(value),
            target: "_blank",
          }
        : {
            href: `${STELLAR_EXPERT}/${seNetwork}/account/${value}`,
          };

      return (
        <div className="ScValPrettyJson__value" data-type="address">
          <SdsLink {...params} variant="secondary" isUnderline title={value}>
            {shortenStellarAddress(value)}
          </SdsLink>
        </div>
      );
    }

    return (
      <div className="ScValPrettyJson__value" data-type="address" title={value}>
        {shortenStellarAddress(value)}
      </div>
    );
  };

  const render = ({
    item,
    parentKey,
    isKey,
    renderKey,
  }: {
    item: any;
    parentKey?: string;
    isKey?: boolean;
    renderKey?: string;
  }): React.ReactNode => {
    const itemType = getItemType(item);
    // "map" array should be rendered as object
    const isMap = parentKey === "map";

    if (itemType === "array") {
      // Empty array or object
      if (item.length === 0) {
        return (
          <div className="ScValPrettyJson__value" key={renderKey}>
            {isMap ? "{ }" : "[ ]"}
          </div>
        );
      }

      const renderedItems = item.map((arrayItem: any, arrayIndex: number) => (
        <Fragment key={`${renderKey}-${arrayIndex}`}>
          {render({
            item: arrayItem,
            parentKey,
            isKey,
            renderKey: `${renderKey || ""}${parentKey || ""}-${arrayIndex}`,
          })}
        </Fragment>
      ));

      if (isKey) {
        return renderedItems;
      }

      return (
        <Fragment key={renderKey}>
          <Bracket char={isMap ? "{" : "["} />
          <div className="ScValPrettyJson__container">{renderedItems}</div>
          <Bracket char={isMap ? "}" : "]"} />
        </Fragment>
      );
    }

    if (itemType === "object") {
      const entries = Object.entries(item);

      if (entries.length === 2) {
        // Handle key/value pair
        const [key, keyVal] = entries[0];
        const [value, valueVal] = entries[1];

        if (key === "key" && value === "val") {
          return (
            <div className="ScValPrettyJson__row" key={renderKey}>
              {render({
                item: keyVal,
                parentKey,
                isKey: true,
                renderKey: `${renderKey}-${parentKey}-key`,
              })}
              {render({
                item: valueVal,
                parentKey,
                isKey: false,
                renderKey: `${renderKey}-${parentKey}-val`,
              })}
            </div>
          );
        }
      }

      // Render by object key type
      if (entries.length === 1) {
        const [eKey, eVal] = entries[0];

        switch (eKey) {
          case "contract_instance":
          case "map":
          case "vec":
          case "wasm":
          case "symbol":
          case "string":
            return render({
              item: eVal,
              parentKey: eKey,
              isKey,
              // Using UUID to make sure key will be unique
              renderKey: `${renderKey || parentKey || ""}${eKey}-${uuidv4()}`,
            });
          case "bool":
            return (
              <div
                className="ScValPrettyJson__value"
                data-type={eKey}
                key={renderKey}
              >
                {stringify(eVal)}
              </div>
            );
          case "address":
            return renderAddress(eVal as string);
          case "i8":
          case "u8":
          case "i16":
          case "u16":
          case "i32":
          case "u32":
          case "i64":
          case "u64":
            return render({
              item: stringify(eVal),
              parentKey: eKey,
              isKey,
              renderKey: `${renderKey}-${parentKey}-${eKey}`,
            });
          case "i128":
          case "u128":
          case "i256":
          case "u256":
            try {
              const hiVal = stringify((eVal as any)?.hi);
              const loVal = stringify((eVal as any)?.lo);

              if (hiVal && loVal) {
                const val = stringify(
                  new XdrLargeInt(eKey, [loVal, hiVal]).toBigInt(),
                );

                return render({
                  item: val,
                  parentKey: eKey,
                  isKey,
                  renderKey: `${renderKey}-${parentKey}-${eKey}`,
                });
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              // do nothing
            }

            return render({
              item: stringify(eVal),
              parentKey: eKey,
              isKey,
              renderKey: `${renderKey}-${parentKey}-${eKey}`,
            });
          default:
            return (
              <Fragment key={renderKey}>
                <Bracket char="{" />
                <div className="ScValPrettyJson__container">
                  <div className="ScValPrettyJson__row">
                    <div className="ScValPrettyJson__key">{eKey}</div>
                    {render({
                      item: eVal,
                      parentKey: eKey,
                      isKey,
                      renderKey: `${renderKey}-${parentKey}-${eKey}`,
                    })}
                  </div>
                </div>
                <Bracket char="}" />
              </Fragment>
            );
        }
      }

      return (
        <Fragment key={renderKey}>
          <Bracket char="{" />
          <div className="ScValPrettyJson__container">
            {entries.map((e, eIdx) => {
              const [eKey, eVal] = e;
              const renKey = `${renderKey}-${parentKey}-${eKey}-${eIdx}`;

              switch (eKey) {
                // Don't render these keys
                case "contract_instance":
                case "vec":
                case "wasm":
                case "symbol":
                  return (
                    <Fragment key={renKey}>
                      {render({
                        item: eVal,
                        parentKey: eKey,
                        isKey,
                        renderKey: renKey,
                      })}
                    </Fragment>
                  );
                default:
                  return (
                    <div className="ScValPrettyJson__row" key={renKey}>
                      <div className="ScValPrettyJson__key">{eKey}</div>
                      {render({
                        item: eVal,
                        parentKey: eKey,
                        isKey,
                        renderKey: renKey,
                      })}
                    </div>
                  );
              }
            })}
          </div>
          <Bracket char="}" />
        </Fragment>
      );
    }

    if (itemType === "function") {
      return (
        <div
          className="ScValPrettyJson__value"
          data-type="function"
          key={renderKey}
        >{`${JSON.stringify(item)}`}</div>
      );
    }

    if (itemType === "primitive") {
      return (
        <div
          className={isKey ? "ScValPrettyJson__key" : "ScValPrettyJson__value"}
          data-type={parentKey}
          key={renderKey}
        >
          {item}
        </div>
      );
    }

    // If the item is null
    return (
      <div className="ScValPrettyJson__value" key={renderKey}>
        null
      </div>
    );
  };

  // Entry point
  return (
    <div className="ScValPrettyJson">
      {render({ item: json ? json : parseJson() })}
    </div>
  );
};

// =============================================================================
// Components
// =============================================================================
const Bracket = ({ char }: { char: "{" | "}" | "[" | "]" }) => {
  return <div className="ScValPrettyJson__bracket">{char}</div>;
};
