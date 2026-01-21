import { Fragment } from "react";
import { StrKey, XdrLargeInt } from "@stellar/stellar-sdk";
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
  formatAsset,
}: {
  isReady: boolean;
  xdrString?: string;
  json?: AnyObject | null;
  formatAsset?: boolean;
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
      case "string":
        // Format asset
        if (formatAsset && value?.split(":")?.length === 2) {
          const [code, issuer] = value.split(":");

          return (
            <div className="StellarDataRenderer__value">
              <div data-type="string">
                <Quotes>{code}</Quotes>
                {renderAddress(issuer)}
              </div>
              {hasComma ? <Comma /> : null}
            </div>
          );
        }

        return (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {`${value}`}
          </Value>
        );
      case "bool":
      case "wasm":
      default:
        return isValueOnly ? (
          value
        ) : (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {`${value}`}
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

            if (valValue && !Array.isArray(valValue)) {
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

    if (mapItem.val && typeof mapItem.val === "object") {
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
    if (value && typeof value === "object") {
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
      return render({
        item: value,
        parentType: type,
        hasComma,
      });
    }

    return renderPrimitive({ value, type, hasComma });
  };

  // Entry point: render JSON, if provided, or parse XDR to JSON
  return (
    <div className="StellarDataRenderer">
      {render({ item: json ? json : parseJson() })}
    </div>
  );
};

// =============================================================================
// Classic Operations Pretty JSON
// =============================================================================
export const ClassicOpPrettyJson = ({ value }: { value: any }) => {
  const { network } = useStore();

  const getValueType = (val: any): string => {
    if (val === null || val === undefined) {
      return "null";
    }
    if (typeof val === "boolean") {
      return "boolean";
    }
    if (typeof val === "number") {
      return "number";
    }
    if (typeof val === "string") {
      if (
        StrKey.isValidEd25519PublicKey(val) ||
        StrKey.isValidMed25519PublicKey(val) ||
        StrKey.isValidContract(val)
      ) {
        return "address";
      }
      return "string";
    }
    if (Array.isArray(val)) {
      return "array";
    }
    if (typeof val === "object") {
      // Check for asset object
      if (
        val.asset_type ||
        Object.keys(val).includes("credit_alphanum4") ||
        Object.keys(val).includes("credit_alphanum12")
      ) {
        return "asset_object";
      }
      // Check for price_r (rational number)
      if (val.n !== undefined && val.d !== undefined) {
        return "price_r";
      }
      return "object";
    }
    return "unknown";
  };

  const renderAddress = (val: string) => {
    const seNetwork = getStellarExpertNetwork(network.id);
    const isContract = !getContractIdError(val);

    if (seNetwork) {
      const params = isContract
        ? {
            href: buildContractExplorerHref(val),
            target: "_blank",
          }
        : {
            href: `${STELLAR_EXPERT}/${seNetwork}/account/${val}`,
          };

      return (
        <SdsLink {...params} variant="secondary" isUnderline title={val}>
          {shortenStellarAddress(val)}
        </SdsLink>
      );
    }

    return shortenStellarAddress(val);
  };

  const renderAssetObject = (asset: any, hasComma: boolean = false) => {
    if (asset?.credit_alphanum4 || asset?.credit_alphanum12) {
      const assetData = asset.credit_alphanum4 || asset.credit_alphanum12;

      return (
        <>
          <div className="StellarDataRenderer__value">
            <div data-type="asset">
              <Quotes>{assetData.asset_code}</Quotes>
              {renderAddress(assetData.issuer)}
            </div>
          </div>
          {hasComma ? <Comma /> : null}
        </>
      );
    }

    if (asset.asset_type === "liquidity_pool_shares") {
      return renderPrimitiveValue({
        value: `Liquidity Pool: ${asset.liquidity_pool_id}`,
        type: "string",
        hasComma,
      });
    }

    return renderObject(asset, hasComma);
  };

  const renderPriceR = (price: any) => {
    return (
      <Row>
        <Key hasColon={true}>n</Key>
        <Value hasComma={true}>{price.n}</Value>
        <Key hasColon={true}>d</Key>
        <Value>{price.d}</Value>
      </Row>
    );
  };

  const renderPrimitiveValue = ({
    value: val,
    type,
    hasComma = false,
  }: {
    value: any;
    type: string;
    hasComma?: boolean;
  }) => {
    switch (type) {
      case "address":
        return (
          <Value key={`${type}-${uuidv4()}`} type={type} hasComma={hasComma}>
            {renderAddress(val)}
          </Value>
        );
      case "boolean":
        return <Value type="bool" hasComma={hasComma}>{`${val}`}</Value>;
      case "number":
        return (
          <Value type="number" hasComma={hasComma}>
            {val}
          </Value>
        );
      case "string":
        return (
          <Value type="string" hasComma={hasComma}>
            {val}
          </Value>
        );
      case "null":
        return <Value hasComma={hasComma}>null</Value>;
      default:
        return <Value hasComma={hasComma}>{`${val}`}</Value>;
    }
  };

  const renderArray = (arr: any[], hasComma: boolean = false) => {
    if (arr.length === 0) {
      return <EmptyArray hasComma={hasComma} />;
    }

    return (
      <>
        <Bracket char="[" />
        <Block>
          {arr.map((item, idx) => (
            <Row key={`arr-item-${idx}-${uuidv4()}`}>
              {renderValue(item, idx !== arr.length - 1)}
            </Row>
          ))}
        </Block>
        <Bracket char="]" hasComma={hasComma} />
      </>
    );
  };

  const renderObject = (obj: any, hasComma: boolean = false) => {
    const entries = Object.entries(obj);

    if (entries.length === 0) {
      return <EmptyObject hasComma={hasComma} />;
    }

    return (
      <>
        <Bracket char="{" />
        <Block>
          {entries.map(([key, val], idx) => (
            <Row key={`obj-${key}-${uuidv4()}`}>
              <Key hasColon={true}>{key}</Key>
              {renderValue(val, idx !== entries.length - 1)}
            </Row>
          ))}
        </Block>
        <Bracket char="}" hasComma={hasComma} />
      </>
    );
  };

  const renderValue = (
    val: any,
    hasComma: boolean = false,
  ): React.ReactNode => {
    const type = getValueType(val);

    switch (type) {
      case "asset_object":
        return renderAssetObject(val, hasComma);
      case "price_r":
        return renderPriceR(val);
      case "array":
        return renderArray(val, hasComma);
      case "object":
        return renderObject(val, hasComma);
      default:
        return renderPrimitiveValue({ value: val, type, hasComma });
    }
  };

  return <div className="StellarDataRenderer">{renderValue(value)}</div>;
};

// =============================================================================
// Components
// =============================================================================
// On the UI we use "sym" instead of "symbol"
const getType = (type: string) => (type === "symbol" ? "sym" : type);

const Block = ({ children }: { children: React.ReactNode }) => (
  <div className="StellarDataRenderer__block">{children}</div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="StellarDataRenderer__row">{children}</div>
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
      <div className="StellarDataRenderer__key">
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
    <div className="StellarDataRenderer__value">
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
  <div className="StellarDataRenderer__bracket">
    {char}
    {hasComma ? <Comma /> : null}
  </div>
);

const Colon = () => <div className="StellarDataRenderer__colon">:</div>;

const Comma = () => <div className="StellarDataRenderer__comma">,</div>;

const Quotes = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="StellarDataRenderer__quotes">{'"'}</div>
    {children}
    <div className="StellarDataRenderer__quotes">{'"'}</div>
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
