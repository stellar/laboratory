import {
  each,
  trim,
  isFunction,
  isUndefined,
  isString,
  get,
  reduce,
} from "lodash";
import UriTemplates from "uri-templates";
import { EndpointItemEndpoint, AnyObject } from "types/types";

export const buildRequestUrl = (
  baseUrl: string,
  endpoint: EndpointItemEndpoint | undefined,
  values: AnyObject,
) => {
  if (typeof endpoint === "undefined") {
    return "";
  }

  const uriTemplate = `${baseUrl}${endpoint.path.template}`;

  type Template = {
    fill: any;
    fromUri: any;
    template: string;
    varNames: string[];
  };

  // TODO: maybe we remove this package in Tier 3 (not updated in 5 years)
  const template: Template = UriTemplates(uriTemplate);

  // uriParams contains what we want to fill the url with
  const uriParams: AnyObject = {};

  each(template.varNames, (varName) => {
    // With the appropriate getter, extract/transform the relevant value from values
    // 1. Simple value:
    //      - no getter string in `endpoint.path`
    // 2. String resolver: value is inside object in `values`
    //      - getter string in `endpoint.path`
    // 3. Function resolver:
    //      - getter function in `endpoint.path`
    //
    // getter can only either be: `undefined`, `String`, or `Function`

    const getterPresent = varName in endpoint.path;
    const getter = endpoint.path[varName];
    const getterIsFunc = isFunction(getter);
    let value;

    if (getterPresent && getterIsFunc) {
      // case 3
      value = getter(values);
    } else if (getterPresent && !getterIsFunc) {
      // case 2
      value = get(values, getter);
    } else {
      // case 1
      value = values[varName];
    }

    if (!isUndefined(value) && value !== "") {
      if (!isString(value)) {
        throw new Error("Endpoint explorer value must be a string");
      }

      uriParams[varName] = trim(value);
    }
  });

  // Fill in unfilled parameters with placeholders (like {source_account})
  // Also create a map to unescape these placeholders
  type UnescapeMap = {
    oldStr: string;
    newStr: string;
  };

  const unescapeMap: UnescapeMap[] = [];

  each(template.fromUri(uriTemplate), (placeholder, param) => {
    if (!(param in uriParams)) {
      uriParams[param] = placeholder;
      unescapeMap.push({
        oldStr: encodeURIComponent(placeholder),
        newStr: placeholder,
      });
    }
  });

  const builtUrl = reduce(
    unescapeMap,
    (url, replacement) => {
      return url.replace(replacement.oldStr, replacement.newStr);
    },
    template.fill(uriParams),
  );

  return builtUrl;
};
