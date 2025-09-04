"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Icon,
  Input,
  Link,
  Notification,
  Text,
} from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";
import { stringify } from "lossless-json";

import { SdsLink } from "@/components/SdsLink";
import { formComponentTemplateEndpoints } from "@/components/formComponentTemplateEndpoints";
import { InputSideElement } from "@/components/InputSideElement";
import { Box } from "@/components/layout/Box";
import { PrettyJsonTextarea } from "@/components/PrettyJsonTextarea";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { CopyJsonPayloadButton } from "@/components/CopyJsonPayloadButton";
import { PageCard } from "@/components/layout/PageCard";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";

import { useStore } from "@/store/useStore";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { parseJsonString } from "@/helpers/parseJsonString";
import { localStorageSavedEndpointsHorizon } from "@/helpers/localStorageSavedEndpointsHorizon";
import { localStorageSavedRpcMethods } from "@/helpers/localStorageSavedRpcMethods";
import { delayedAction } from "@/helpers/delayedAction";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";
import { shareableUrl } from "@/helpers/shareableUrl";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { sanitizeUrl } from "@/helpers/sanitizeUrl";

import { Routes } from "@/constants/routes";
import {
  ENDPOINTS_PAGES_HORIZON,
  ENDPOINTS_PAGES_RPC,
} from "@/constants/endpointsPages";
import { useEndpoint } from "@/query/useEndpoint";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";
import { useCodeWrappedSetting } from "@/hooks/useCodeWrappedSetting";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import {
  AnyObject,
  AssetObject,
  AssetObjectValue,
  Network,
  FiltersObject,
  SavedRpcMethod,
  SavedEndpointHorizon,
} from "@/types/types";

import { EndpointsLandingPage } from "../components/EndpointsLandingPage";
import { SavedEndpointsPage } from "../components/SavedEndpointsPage";
import { EndpointsJsonResponse } from "../components/EndpointsJsonResponse";

export default function Endpoints() {
  const pathname = usePathname();
  const isRpcEndpoint = pathname?.includes(Routes.ENDPOINTS_RPC);
  const currentPage = pathname?.split(Routes.ENDPOINTS)?.[1];

  const horizonPage = ENDPOINTS_PAGES_HORIZON.navItems
    .find((page) => pathname?.includes(page.route))
    ?.nestedItems?.find((i) => i.route === pathname);

  const rpcPage = ENDPOINTS_PAGES_RPC.navItems.find(
    (page) => pathname === page.route,
  );

  const page = isRpcEndpoint ? rpcPage : horizonPage;
  const pageData = isRpcEndpoint ? rpcPage?.form : horizonPage?.form;

  const requiredFields = sanitizeArray(
    pageData?.requiredParams?.split(",") || [],
  );

  const { endpoints, network, isDynamicNetworkSelect } = useStore();
  const {
    params,
    currentEndpoint,
    network: endpointNetwork,
    updateParams,
    updateCurrentEndpoint,
    updateNetwork,
    resetParams,
  } = endpoints;

  const REGEX_TEMPLATE_SEARCH_PARAMS = /\{\?.+?\}/;
  const REGEX_TEMPLATE_SEARCH_PARAMS_VALUE = /(?<=\{\?).+?(?=\})/;
  const REGEX_TEMPLATE_PATH_PARAM_VALUE = /(?<=\{).+?(?=\})/;

  // Parse page URL from the template to get path and search params
  const parseTemplate = useCallback((templateString: string | undefined) => {
    let template = templateString;
    let templateParams = "";

    if (template) {
      const matchSearchParams = template.match(
        REGEX_TEMPLATE_SEARCH_PARAMS,
      )?.[0];

      if (matchSearchParams) {
        template = template.replace(matchSearchParams, "");
        templateParams =
          matchSearchParams.match(REGEX_TEMPLATE_SEARCH_PARAMS_VALUE)?.[0] ??
          "";
      }
    }

    // Getting path params
    if (template) {
      const urlPathParamArr: string[] = [];

      template.split("/").forEach((p) => {
        const param = p.match(REGEX_TEMPLATE_PATH_PARAM_VALUE)?.[0];

        if (param) {
          urlPathParamArr.push(param);
        }
      });

      setUrlPathparams(urlPathParamArr.join(","));
    }

    return {
      templatePath: template ?? "",
      templateParams: templateParams ?? "",
    };
    // Not including RegEx const
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formError, setFormError] = useState<AnyObject>({});
  const [requestUrl, setRequestUrl] = useState<string>("");
  const [urlPath, setUrlPath] = useState("");
  const [urlPathParams, setUrlPathparams] = useState("");
  const [urlParams, setUrlParams] = useState("");
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const [isCodeWrapped, setIsCodeWrapped] = useCodeWrappedSetting();

  const isTransactionPost = () => {
    return [
      Routes.ENDPOINTS_TRANSACTIONS_POST.toString(),
      Routes.ENDPOINTS_TRANSACTIONS_POST_ASYNC.toString(),
    ].includes(pathname || "");
  };

  const getRpcPostPayloadProps = (endpoint: string) => {
    const defaultRpcRequestBody: AnyObject = {
      jsonrpc: "2.0",
      id: 8675309,
      method: pageData?.rpcMethod,
    };

    const pagination =
      params.cursor || params.limit
        ? sanitizeObject({ cursor: params.cursor, limit: Number(params.limit) })
        : undefined;

    switch (endpoint) {
      case Routes.ENDPOINTS_GET_EVENTS: {
        const filteredParams = params.filters ? JSON.parse(params.filters) : {};

        // do not display the empty string unless its field is filled
        const filteredContractIds = filteredParams.contract_ids
          ? filteredParams.contract_ids.filter((topic: string) => topic.length)
          : [];

        const filteredTopics = filteredParams.topics
          ? filteredParams.topics
              .filter((topic: string) => topic.length)
              .map((item: string) => {
                if (!item) return [];

                try {
                  // Parse the JSON string into an actual array
                  const parsed = JSON.parse(item);

                  return parsed;
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                  // If parsing fails, wrap it in an array
                  return [item];
                }
              })
          : [];

        return {
          ...defaultRpcRequestBody,
          params: {
            xdrFormat: params.xdrFormat || "base64",
            startLedger: Number(params.startLedger) || null,
            ...(pagination && { pagination }),
            filters: [
              {
                type: filteredParams.type ?? "",
                contractIds: filteredContractIds ?? [],
                topics: filteredTopics ?? [],
              },
            ],
          },
        };
      }

      case Routes.ENDPOINTS_GET_LEDGER_ENTRIES: {
        return {
          ...defaultRpcRequestBody,
          params: {
            keys:
              (params.ledgerKeyEntries &&
                JSON.parse(params.ledgerKeyEntries)) ??
              [],
            xdrFormat: params.xdrFormat || "base64",
          },
        };
      }

      case Routes.ENDPOINTS_GET_LEDGERS: {
        return {
          ...defaultRpcRequestBody,
          params: {
            startLedger: Number(params.startLedger) || null,
            ...(pagination && { pagination }),
            xdrFormat: params.xdrFormat || "base64",
          },
        };
      }

      case Routes.ENDPOINTS_GET_TRANSACTION: {
        return {
          ...defaultRpcRequestBody,
          params: {
            hash: params.transaction ?? "",
            xdrFormat: params.xdrFormat || "base64",
          },
        };
      }

      case Routes.ENDPOINTS_GET_TRANSACTIONS: {
        return {
          ...defaultRpcRequestBody,
          params: {
            startLedger: Number(params.startLedger) || null,
            ...(pagination && { pagination }),
            xdrFormat: params.xdrFormat || "base64",
          },
        };
      }

      case Routes.ENDPOINTS_SEND_TRANSACTION: {
        return {
          ...defaultRpcRequestBody,
          params: {
            transaction: params.tx ?? "",
            xdrFormat: params.xdrFormat || "base64",
          },
        };
      }

      case Routes.ENDPOINTS_SIMULATE_TRANSACTION: {
        return {
          ...defaultRpcRequestBody,
          params: {
            transaction: params.tx ?? "",
            resourceConfig: sanitizeObject({
              instructionLeeway: Number(params.resourceConfig) || undefined,
            }),
            xdrFormat: params.xdrFormat || "base64",
            authMode: params.authMode || "",
          },
        };
      }

      default: {
        return defaultRpcRequestBody;
      }
    }
  };

  const getPostPayload = () => {
    let payload;

    if (pageData?.requestMethod === "POST") {
      if (isTransactionPost()) {
        payload = { tx: params.tx ?? "" };
      }

      if (isRpcEndpoint && pathname) {
        payload = getRpcPostPayloadProps(pathname);
      }
    }

    return payload;
  };

  const queryClient = useQueryClient();
  const {
    data: endpointData,
    isLoading,
    isFetching,
    error: endpointError,
    refetch,
    isSuccess,
    isError,
  } = useEndpoint({
    requestUrl,
    postData: pageData?.requestMethod === "POST" ? getPostPayload() : undefined,
    headers: getNetworkHeaders(network, isRpcEndpoint ? "rpc" : "horizon"),
  });

  const responseEl = useRef<HTMLDivElement | null>(null);

  const isSubmitEnabled = () => {
    if (isRpcEndpoint && !network.rpcUrl) {
      return false;
    }

    let isValidReqFields = true;
    let isValidReqAssetFields = true;
    let isValid = true;

    // Checking if all required fields have values
    const missingReqFields = requiredFields.reduce((res, cur) => {
      if (!params[cur]) {
        return [...res, cur];
      }

      return res;
    }, [] as string[]);

    isValidReqFields = missingReqFields.length === 0;

    // Checking if there are any errors
    isValid = isEmptyObject(formError);

    // Asset components
    const assetParams = [
      params.asset,
      params.selling_asset,
      params.buying_asset,
      params.base_asset,
      params.counter_asset,
      params.destination_asset,
      params.source_asset,
    ];

    assetParams.forEach((aParam) => {
      // No need to keep checking if one field is invalid
      if (!isValidReqAssetFields) {
        return;
      }

      // When non-native asset is selected, code and issuer fields are required
      if (aParam) {
        const assetObj = parseJsonString(aParam);
        isValidReqAssetFields = validateAssetObj(assetObj);
      }
    });

    const isAssetMultiValid = true;

    const assetMulti = [
      params.source_assets,
      params.destination_assets,
      params.reserves,
    ];

    assetMulti.forEach((a) => {
      if (a) {
        const saParams = parseJsonString(a);

        saParams.forEach((sa: AssetObjectValue) => {
          if (!isAssetMultiValid) {
            return;
          }

          isValidReqAssetFields = validateAssetObj(sa);
        });
      }
    });

    // RPC Cursor field can be used instead of the required Start Ledger Sequence
    if (
      isRpcEndpoint &&
      requiredFields.includes("startLedger") &&
      !params.startLedger
    ) {
      isValidReqFields = Boolean(params.cursor);
    }

    return (
      isValidReqAssetFields && isValidReqFields && isValid && isAssetMultiValid
    );
  };

  const validateAssetObj = (asset: AssetObjectValue) => {
    if (
      ["issued", "credit_alphanum4", "credit_alphanum12"].includes(
        asset.type as string,
      )
    ) {
      return Boolean(asset.code && asset.issuer);
    }

    return true;
  };

  const resetQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["endpoint", "response"],
      }),
    [queryClient],
  );

  const resetStates = useCallback(() => {
    resetParams();
    setFormError({});
    resetQuery();
  }, [resetParams, resetQuery]);

  useEffect(() => {
    // Validate saved params when the page loads
    const paramErrors = () => {
      return Object.keys(params).reduce((res, param) => {
        const error = formComponentTemplateEndpoints(param)?.validate?.(
          parseJsonString(params[param]),
          requiredFields.includes(param),
        );

        if (error) {
          return { ...res, [param]: error };
        }

        return res;
      }, {});
    };

    const error: any = paramErrors();

    // Handle XDR validation
    if (error?.tx?.result === "success") {
      delete error.tx;
    }

    setFormError(error);

    // We want to check this only when the page mounts for the first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapParamToValue = (key: string, value: string) => {
    const [param, prop] = (value as string)?.split(".") || [];
    const mappedValue = parseJsonString(params?.[param])?.[prop];

    return mappedValue ? { [key]: mappedValue } : {};
  };

  // Persist mapped custom template props to params
  useEffect(() => {
    const paramMapping = pageData?.custom?.paramMapping;

    if (paramMapping) {
      const mappedParams = Object.entries(paramMapping).reduce(
        (res, [key, value]) => {
          const mappedVal = mapParamToValue(key, value as string);

          return { ...res, ...mappedVal };
        },
        {} as AnyObject,
      );

      if (!isEmptyObject(mappedParams)) {
        updateParams(mappedParams);
      }
    }
    // Run this only once when page loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPage) {
      updateCurrentEndpoint(currentPage);
    }

    // Clear form and errors if navigating to another endpoint page. We don't
    // want to keep previous form values.
    if (currentEndpoint && ![currentPage, "/saved"].includes(currentEndpoint)) {
      resetStates();
    }
  }, [currentEndpoint, currentPage, resetStates, updateCurrentEndpoint]);

  useEffect(() => {
    const { templatePath, templateParams } = parseTemplate(
      pageData?.endpointUrlTemplate,
    );
    setUrlPath(templatePath);
    setUrlParams(templateParams);
  }, [pageData?.endpointUrlTemplate, parseTemplate]);

  useEffect(() => {
    // Save network for endpoints if we don't have it yet.
    if (network.id && !endpointNetwork.id) {
      updateNetwork(network as Network);
      // When network changes, clear saved params and errors.
    } else if (
      network.id &&
      network.id !== endpointNetwork.id &&
      !isDynamicNetworkSelect
    ) {
      resetStates();
      updateNetwork(network as Network);
    }
  }, [
    endpointNetwork.id,
    isDynamicNetworkSelect,
    network,
    resetStates,
    updateNetwork,
  ]);

  // Scroll to response
  useScrollIntoView(isSuccess || isError, responseEl);

  const createAssetString = (asset: AssetObjectValue) => {
    if (asset.type === "native") {
      return "native";
    }

    return `${asset.code}:${asset.issuer}`;
  };

  const buildUrl = useCallback(() => {
    const parseUrlPath = (path: string) => {
      const pathArr: string[] = [];

      path.split("/").forEach((p) => {
        const param = p.match(REGEX_TEMPLATE_PATH_PARAM_VALUE)?.[0];

        if (param) {
          return pathArr.push(params[param] ?? "");
        }

        return pathArr.push(p);
      });

      return pathArr.join("/");
    };

    const baseUrl = isRpcEndpoint
      ? `${endpointNetwork.rpcUrl}${parseUrlPath(urlPath)}`
      : `${endpointNetwork.horizonUrl}${parseUrlPath(urlPath)}`;

    if (pageData?.requestMethod === "POST") {
      return baseUrl;
    }

    const searchParams = new URLSearchParams();
    const templateParams = urlParams?.split(",");

    const getParamRequestValue = (param: string) => {
      const value = parseJsonString(params[param]);

      // Boolean values
      if (!value && typeof value !== "boolean") {
        return false;
      }

      // Asset string
      if (["asset", "selling", "buying"].includes(param)) {
        return createAssetString(value);
      }

      // Comma separated assets string
      if (["source_assets", "destination_assets", "reserves"].includes(param)) {
        return sanitizeArray(
          value.map((v: AssetObjectValue) =>
            isEmptyObject(sanitizeObject(v)) ? undefined : createAssetString(v),
          ),
        ).join(",");
      }

      return `${value}`;
    };

    // Build search params keeping the same params order
    templateParams?.forEach((p) => {
      const paramVal = getParamRequestValue(p);

      if (paramVal) {
        searchParams.set(p, paramVal);
      }
    });

    const searchParamString = searchParams.toString();

    return sanitizeUrl(
      `${baseUrl}${searchParamString ? `?${searchParamString}` : ""}`,
    );
    // Not including RegEx const
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    endpointNetwork.horizonUrl,
    endpointNetwork.rpcUrl,
    params,
    urlParams,
    urlPath,
  ]);

  useEffect(() => {
    setRequestUrl(buildUrl());
  }, [buildUrl]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Adding a bit of a delay to make sure reset doesn't affect refetch
    const delay = isError || isSuccess ? 100 : 0;

    if (delay) {
      resetQuery();
    }

    delayedAction({
      action: () => {
        refetch();

        trackEvent(TrackingEvent.ENDPOINTS_SUBMIT, {
          endpoint: isRpcEndpoint ? "rpc" : "horizon",
          route: page?.route,
        });
      },
      delay,
    });
  };

  const renderPostPayload = () => {
    let renderedProps = getPostPayload();

    if (pageData?.requestMethod === "POST") {
      if (isTransactionPost()) {
        renderedProps = { tx: params.tx ?? "" };
      }

      if (isRpcEndpoint && pathname) {
        renderedProps = getRpcPostPayloadProps(pathname);
      }
    }

    if (renderedProps) {
      return (
        <>
          <div className="Endpoints__txTextarea">
            <PrettyJsonTextarea
              json={renderedProps}
              label="Payload"
              isCodeWrapped={isCodeWrapped}
            />
          </div>
          <Box gap="md" direction="row" justify="space-between" align="center">
            <JsonCodeWrapToggle
              isChecked={isCodeWrapped}
              onChange={(isChecked) => {
                setIsCodeWrapped(isChecked);
              }}
            />

            <CopyJsonPayloadButton
              jsonString={stringify(renderedProps, null, 2) || ""}
            />
          </Box>
        </>
      );
    }
    return null;
  };

  const renderEndpointUrl = () => {
    if (!pageData) {
      return null;
    }

    return (
      <>
        <div className="Endpoints__urlBar">
          <Input
            data-testid="endpoints-url"
            id="endpoint-url"
            fieldSize="md"
            value={requestUrl}
            readOnly
            disabled
            leftElement={
              <InputSideElement
                variant="text"
                placement="left"
                data-testid="endpoints-url-method"
                addlClassName="Endpoints__urlBar__requestMethod"
              >
                {pageData.requestMethod}
              </InputSideElement>
            }
          />
          <Box
            gap="sm"
            align="center"
            justify="space-between"
            direction="row"
            addlClassName="Endpoints__urlBar__buttons"
          >
            <Button
              size="md"
              variant="secondary"
              type="submit"
              disabled={!isSubmitEnabled()}
              isLoading={isLoading || isFetching}
              data-testid="endpoints-submitBtn"
            >
              Submit
            </Button>

            <ShareUrlButton shareableUrl={shareableUrl("requests")} />

            <Button
              size="md"
              variant="tertiary"
              icon={<Icon.Save01 />}
              type="button"
              onClick={() => {
                setIsSaveModalVisible(true);
              }}
              showActionTooltip
              actionTooltipText="Saved"
            ></Button>
          </Box>
        </div>
      </>
    );
  };

  const renderFields = () => {
    const allFields = sanitizeArray([
      ...urlPathParams.split(","),
      ...(pageData?.custom?.renderComponents || []),
      ...urlParams.split(","),
    ]);

    if (!pageData || (allFields.length === 0 && !isRpcEndpoint)) {
      return null;
    }

    return (
      <div className="Endpoints__content">
        <div className="PageBody__content" data-testid="endpoints-pageContent">
          {allFields.map((f) => {
            const component = formComponentTemplateEndpoints(
              f,
              pageData.custom?.[f],
            );

            if (component) {
              const isRequired = requiredFields.includes(f);

              // storeValue is saved in the store and may need special
              // formatting (sanitizing object or array, for exmaple).
              // Error check needs the original value.
              const handleChange = (value: any, storeValue: any) => {
                if (isSuccess || isError) {
                  resetQuery();
                }

                // Mapping custom value to template params
                const mappedParams = pageData?.custom?.paramMapping
                  ? Object.entries(pageData.custom.paramMapping).reduce(
                      (res, [key, val]) => {
                        const [param, prop] = (val as string)?.split(".") || [];

                        if (param === f) {
                          return { ...res, [key]: value?.[prop] };
                        }

                        return res;
                      },
                      {} as AnyObject,
                    )
                  : {};

                updateParams({
                  [f]: storeValue,
                  ...mappedParams,
                });

                const error = component.validate?.(value, isRequired);

                if (error && error.result !== "success") {
                  setFormError({ ...formError, [f]: error });
                } else if (formError[f]) {
                  const updatedErrors = { ...formError };
                  delete updatedErrors[f];
                  setFormError(updatedErrors);
                }
              };

              switch (f) {
                case "asset":
                case "selling":
                case "selling_asset":
                case "buying":
                case "buying_asset":
                case "base_asset":
                case "counter_asset":
                case "destination_asset":
                case "source_asset":
                  return component.render({
                    value: params[f],
                    error: formError[f],
                    isRequired,
                    onChange: (assetObj: AssetObject) => {
                      handleChange(
                        assetObj,
                        isEmptyObject(sanitizeObject(assetObj || {}))
                          ? undefined
                          : JSON.stringify(assetObj),
                      );
                    },
                  });
                case "source_assets":
                case "destination_assets":
                case "reserves":
                  return component.render({
                    values: parseJsonString(params[f]),
                    error: formError[f],
                    isRequired,
                    onChange: (assetArr: AssetObject[]) => {
                      handleChange(
                        assetArr,
                        assetArr ? JSON.stringify(assetArr) : undefined,
                      );
                    },
                  });
                case "order":
                case "include_failed":
                  return component.render({
                    value: params[f],
                    error: formError[f],
                    isRequired,
                    onChange: (optionId: string | undefined) => {
                      handleChange(optionId, optionId);
                    },
                  });
                case "startLedger":
                  return component.render({
                    value: params[f],
                    error: formError[f],
                    isRequired,
                    onChange: (ledgerSeq: string | undefined) => {
                      handleChange(ledgerSeq, ledgerSeq);
                    },
                  });
                // Custom endpoint component
                case "filters":
                  return component.render({
                    value: params[f],
                    error: formError[f],
                    isRequired,
                    onChange: (filtersObject: FiltersObject) => {
                      handleChange(
                        filtersObject,
                        isEmptyObject(sanitizeObject(filtersObject || {}))
                          ? undefined
                          : JSON.stringify(filtersObject),
                      );
                    },
                  });
                case "ledgerKeyEntries":
                  return component.render({
                    value: params[f],
                    error: formError[f],
                    isRequired,
                    onChange: (ledgerKeyXdr: string[]) => {
                      handleChange(
                        ledgerKeyXdr,
                        ledgerKeyXdr ? JSON.stringify(ledgerKeyXdr) : undefined,
                      );
                    },
                  });
                default:
                  return component.render({
                    value: params[f],
                    error: formError[f],
                    isRequired,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e.target.value, e.target.value);
                    },
                  });
              }
            }

            return null;
          })}

          {renderPostPayload()}
        </div>
      </div>
    );
  };

  const renderInfoMessage = () => {
    if (isRpcEndpoint) {
      return (
        <>
          This tool can be used to run queries against the{" "}
          <SdsLink href="https://developers.stellar.org/docs/data/rpc">
            REST API methods
          </SdsLink>{" "}
          of RPC servers. RPC is one of the developer-facing services for the
          Stellar ecosystem.
        </>
      );
    }

    return (
      <>
        This tool can be used to run queries against the{" "}
        <SdsLink href="https://developers.stellar.org/network/horizon/resources">
          REST API endpoints
        </SdsLink>{" "}
        of Horizon servers. Horizon is one of the developer-facing services for
        the Stellar ecosystem.
      </>
    );
  };

  const renderPostAsyncTxResponseMessage = () => {
    if (pathname === Routes.ENDPOINTS_TRANSACTIONS_POST_ASYNC && endpointData) {
      if (endpointData.json.tx_status === "PENDING" && endpointData.json.hash) {
        const href = buildEndpointHref(Routes.ENDPOINTS_TRANSACTIONS_SINGLE, {
          transaction: endpointData.json.hash,
        });

        return (
          <div className="FieldNote FieldNote--note FieldNote--lg">
            Check the async transaction’s status <Link href={href}>here</Link>
          </div>
        );
      }
    }

    return null;
  };

  if (pathname === Routes.ENDPOINTS) {
    return <EndpointsLandingPage />;
  }

  if (pathname === Routes.SAVED_ENDPOINTS) {
    return <SavedEndpointsPage />;
  }

  if (pathname === Routes.ENDPOINTS_RPC) {
    return (
      <div className="Endpoints__content">
        <div className="PageBody__content" data-testid="endpoints-pageContent">
          {renderPostPayload()}
        </div>
      </div>
    );
  }

  if (!pageData) {
    return <>{`${page?.label} page is coming soon.`}</>;
  }

  return (
    <>
      <PageCard
        heading={page?.label}
        rightElement={
          <SdsLink
            href={pageData.docsUrl}
            icon={<Icon.LinkExternal01 />}
            data-testid="endpoints-docsLink"
          >
            View Docs
          </SdsLink>
        }
      >
        <form className="PageBody" onSubmit={handleSubmit}>
          {renderEndpointUrl()}

          {/* display a missing request url banner if requestUrl is empty */}
          {!requestUrl ? (
            <Notification
              title={`Set a ${endpointNetwork.label} RPC URL in order to submit`}
              icon={<Icon.AlertTriangle />}
              variant="warning"
              isFilled
            />
          ) : null}

          {renderFields()}
        </form>
      </PageCard>

      {endpointData || endpointError ? (
        <div ref={responseEl}>
          {endpointError ? (
            <Alert placement="inline" variant="error" title="Error">
              {`${endpointError}`}
            </Alert>
          ) : null}

          {endpointData ? (
            <Card>
              <div className="PageBody">
                <Text
                  size="sm"
                  as="h2"
                  weight="semi-bold"
                  addlClassName="PageBody__title"
                >
                  JSON Response
                  {endpointData.isError ? (
                    <span className="PageBody__title__icon">
                      <Icon.AlertTriangle />
                    </span>
                  ) : null}
                </Text>

                <div
                  className={`PageBody__content PageBody__scrollable ${endpointData.isError ? "PageBody__content--error" : ""}`}
                >
                  <EndpointsJsonResponse
                    json={endpointData.json}
                    isCodeWrapped={isCodeWrapped}
                  />
                </div>

                <div className="PageFooter">
                  <div className="PageFooter__left">
                    <JsonCodeWrapToggle
                      isChecked={isCodeWrapped}
                      onChange={(isChecked) => {
                        setIsCodeWrapped(isChecked);
                      }}
                    />
                  </div>
                  <div className="PageFooter__right">
                    <CopyJsonPayloadButton
                      jsonString={stringify(endpointData.json, null, 2) || ""}
                    />
                  </div>
                </div>
                {renderPostAsyncTxResponseMessage()}
              </div>
            </Card>
          ) : null}
        </div>
      ) : null}

      <Alert variant="primary" placement="inline">
        {renderInfoMessage()}
      </Alert>

      <SaveToLocalStorageModal
        type="save"
        itemTitle={isRpcEndpoint ? "RPC Method" : "Horizon Endpoint"}
        itemProps={{
          url: requestUrl,
          method: pageData.requestMethod,
          route: pathname,
          params,
          shareableUrl: shareableUrl("requests"),
          ...(isRpcEndpoint
            ? { payload: getPostPayload(), rpcMethod: pageData.rpcMethod }
            : {}),
        }}
        allSavedItems={
          isRpcEndpoint
            ? localStorageSavedRpcMethods.get()
            : localStorageSavedEndpointsHorizon.get()
        }
        isVisible={isSaveModalVisible}
        onClose={() => {
          setIsSaveModalVisible(false);
        }}
        onUpdate={(updatedItems) => {
          if (isRpcEndpoint) {
            localStorageSavedRpcMethods.set(updatedItems as SavedRpcMethod[]);
          } else {
            localStorageSavedEndpointsHorizon.set(
              updatedItems as SavedEndpointHorizon[],
            );
          }

          trackEvent(TrackingEvent.ENDPOINTS_SAVE, {
            endpoint: isRpcEndpoint ? "rpc" : "horizon",
            route: page?.route,
          });
        }}
      />
    </>
  );
}
