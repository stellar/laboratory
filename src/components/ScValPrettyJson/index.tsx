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

  type ItemType = "array" | "object" | "function" | "primitive" | null;

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
        <SdsLink {...params} variant="secondary" isUnderline title={value}>
          {shortenStellarAddress(value)}
        </SdsLink>
      );
    }

    return shortenStellarAddress(value);
  };

  const renderPrimitive = ({
    value,
    type,
    isValueOnly,
    hasComma = false,
  }: {
    value: any;
    type: string;
    isValueOnly?: boolean;
    hasComma?: boolean;
  }) => {
    switch (type) {
      case "address":
        return isValueOnly ? (
          renderAddress(value)
        ) : (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {renderAddress(value)}
          </Value>
        );
      case "i8":
      case "u8":
      case "i16":
      case "u16":
      case "i32":
      case "u32":
      case "i64":
      case "u64":
        return isValueOnly ? (
          stringify(value)
        ) : (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {stringify(value)}
          </Value>
        );
      case "i128":
      case "u128":
      case "i256":
      case "u256": {
        let val = stringify(value);

        try {
          const hiVal = stringify((value as any)?.hi);
          const loVal = stringify((value as any)?.lo);

          if (hiVal && loVal) {
            val = stringify(new XdrLargeInt(type, [loVal, hiVal]).toBigInt());
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // do nothing
        }

        return isValueOnly ? (
          val
        ) : (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {val}
          </Value>
        );
      }
      case "symbol":
        if (typeof value === "object") {
          return render({ item: value, parentType: type, hasComma });
        }

        if (isValueOnly) {
          return value;
        }

        return (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {value}
          </Value>
        );
      case "bool":
      case "string":
      case "wasm":
      default:
        return isValueOnly ? (
          value
        ) : (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {value}
          </Value>
        );
    }
  };

  const renderObject = (obj: AnyObject) => {
    const objItems = Object.entries(obj);

    return (
      <Fragment key={`obj-${uuidv4()}`}>
        <Bracket char="{" />
        <Block>
          {objItems.map((objItm: any, idx: number) => {
            const keyValue = objItm[0];
            let valType = "";
            let valValue = objItm[1];

            if (!Array.isArray(valValue)) {
              [valType, valValue] = Object.entries(objItm[1])[0];
            }

            return (
              <Row key={`${valType}-${uuidv4()}`}>
                <Key hasColon={true}>{keyValue}</Key>
                {renderObjectOrPrimitive({
                  value: valValue,
                  type: valType,
                  hasComma: idx !== objItems.length - 1,
                })}
              </Row>
            );
          })}
        </Block>
        <Bracket char="}" />
      </Fragment>
    );
  };

  const renderArray = (
    arrItems: any[],
    type: string,
    hasComma: boolean = false,
  ) => {
    const isMap = type === "map";

    if (arrItems.length === 0) {
      return isMap ? (
        <EmptyObject hasComma={hasComma} />
      ) : (
        <EmptyArray hasComma={hasComma} />
      );
    }

    return (
      <Fragment key={`${type}-${uuidv4()}`}>
        <Bracket char={isMap ? "{" : "["} />
        <Block>
          {arrItems.map((itm: any, idx: number) =>
            renderObjectOrPrimitive({
              value: itm,
              type,
              hasComma: idx !== arrItems.length - 1,
            }),
          )}
        </Block>
        {/* Comma for nested items */}
        <Bracket char={isMap ? "}" : "]"} hasComma={hasComma} />
      </Fragment>
    );
  };

  const renderKey = (keyType: string, keyValue: any) => {
    // Key type can be a vector, handling it here
    if (keyType === "vec") {
      const [vecType, vecVal] = Object.entries(keyValue[0])[0];

      return (
        <Key type={vecType} hasColon={true}>
          {renderPrimitive({
            value: vecVal,
            type: vecType,
            isValueOnly: true,
          })}
        </Key>
      );
    }

    return (
      <Key type={keyType} hasColon={true}>
        {renderPrimitive({
          value: keyValue,
          type: keyType,
          isValueOnly: true,
        })}
      </Key>
    );
  };

  const renderKeyValue = ({
    mapItem,
    hasComma = false,
  }: {
    mapItem: any;
    hasComma?: boolean;
  }) => {
    const [keyType, keyValue] = Object.entries(mapItem.key)[0];

    // Not always value will be an object
    let valType = "";
    let valValue = mapItem.val;

    if (typeof mapItem.val === "object") {
      [valType, valValue] = Object.entries(mapItem.val)[0];
    }

    return (
      <Row key={`${valType}-${valType}-${uuidv4()}`}>
        {renderKey(keyType, keyValue)}
        {renderObjectOrPrimitive({ value: valValue, type: valType, hasComma })}
      </Row>
    );
  };

  const render = ({
    item,
    parentType,
    hasComma = false,
  }: {
    item: any;
    parentType?: string;
    hasComma?: boolean;
  }): React.ReactNode => {
    const itemType = getItemType(item);

    // Array
    if (itemType === "array") {
      // "map" array should be rendered as object
      const isMap = parentType === "map";

      // Empty array or object
      if (item.length === 0) {
        return isMap ? <EmptyObject /> : <EmptyArray />;
      }

      return renderArray(item, "", hasComma);
    }

    // Object
    if (itemType === "object") {
      const scType: string = Object.keys(item)[0];
      const scValue: any = Object.values(item)[0];

      switch (scType) {
        case "contract_instance":
          return renderObject(scValue);
        case "ledger_key_nonce": {
          const [keyType, keyValue] = Object.entries(scValue)[0];

          return renderPrimitive({
            value: stringify(keyValue),
            type: keyType,
            hasComma,
          });
        }
        case "map":
          return (
            <Fragment key={`${scType}-${uuidv4()}`}>
              <Bracket char="{" />
              <Block>
                {scValue.map((mapItm: any, idx: number) =>
                  renderKeyValue({
                    mapItem: mapItm,
                    hasComma: idx !== scValue.length - 1,
                  }),
                )}
              </Block>
              <Bracket char="}" />
            </Fragment>
          );
        case "vec":
          return renderArray(scValue, scType, hasComma);
        default:
          return renderPrimitive({ value: scValue, type: scType, hasComma });
      }
    }

    return renderPrimitive({
      value: item,
      type: "",
      hasComma,
    });
  };

  const renderObjectOrPrimitive = ({
    value,
    type,
    hasComma = false,
  }: {
    value: any;
    type: string;
    hasComma?: boolean;
  }) => {
    // If value is an array
    if (Array.isArray(value)) {
      return renderArray(value, type, hasComma);
    }

    let isKeyValue = false;

    // Checking if an object is a key-value object
    if (typeof value === "object") {
      const keys = Object.keys(value);

      if (keys.length === 2 && keys[0] === "key" && keys[1] === "val") {
        isKeyValue = true;
      }
    }

    if (isKeyValue) {
      return renderKeyValue({
        mapItem: value,
        hasComma,
      });
    }

    // If not a "primitive" value, we need to render as an object
    const objectTypes = ["contract_instance", "ledger_key_nonce", "map", "vec"];

    if (type && objectTypes.includes(type)) {
      return render({ item: value, parentType: type, hasComma });
    }

    return renderPrimitive({ value, type, hasComma });
  };

  // Entry point: render JSON, if provided, or parse XDR to JSON
  return (
    <div className="ScValPrettyJson">
      {render({ item: json ? json : parseJson() })}
    </div>
  );
};

// =============================================================================
// Components
// =============================================================================
// On the UI we use "sym" instead of "symbol"
const getType = (type: string) => (type === "symbol" ? "sym" : type);

const Block = ({ children }: { children: React.ReactNode }) => (
  <div className="ScValPrettyJson__block">{children}</div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="ScValPrettyJson__row">{children}</div>
);

const Key = ({
  children,
  type,
  hasColon,
}: {
  children: React.ReactNode;
  type?: string;
  hasColon: boolean;
}) => {
  const _type = getType(type || "");

  return (
    <Fragment key={`key-${type}-${uuidv4()}`}>
      <div className="ScValPrettyJson__key">
        <div {...(_type ? { "data-type": _type } : {})}>
          {_type === "sym" ? <Quotes>{children}</Quotes> : children}
        </div>
      </div>
      {hasColon ? <Colon /> : null}
    </Fragment>
  );
};

const Value = ({
  children,
  hasComma,
  type,
}: {
  children: React.ReactNode;
  hasComma?: boolean;
  type?: string;
}) => {
  const _type = getType(type || "");
  const _children = _type === "bool" ? `${children}` : children;
  const hasQuotes = ["sym", "string"].includes(_type);

  return (
    <div className="ScValPrettyJson__value">
      <div {...(_type ? { "data-type": _type } : {})}>
        {hasQuotes ? <Quotes>{_children}</Quotes> : _children}
      </div>
      {hasComma ? <Comma /> : null}
    </div>
  );
};

const Bracket = ({
  char,
  hasComma,
}: {
  char: "{" | "}" | "[" | "]";
  hasComma?: boolean;
}) => (
  <div className="ScValPrettyJson__bracket">
    {char}
    {hasComma ? <Comma /> : null}
  </div>
);

const Colon = () => <div className="ScValPrettyJson__colon">:</div>;

const Comma = () => <div className="ScValPrettyJson__comma">,</div>;

const Quotes = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="ScValPrettyJson__quotes">{'"'}</div>
    {children}
    <div className="ScValPrettyJson__quotes">{'"'}</div>
  </>
);

const EmptyObject = ({ hasComma }: { hasComma?: boolean }) => (
  <Fragment key={`emptyObj-${uuidv4()}`}>
    <Value>{"{  }"}</Value>
    {hasComma ? <Comma /> : null}
  </Fragment>
);

const EmptyArray = ({ hasComma }: { hasComma?: boolean }) => (
  <Fragment key={`emptyArr-${uuidv4()}`}>
    <Value>{"[  ]"}</Value>
    {hasComma ? <Comma /> : null}
  </Fragment>
);
