"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  CopyText,
  Icon,
  Input,
  Link,
  Text,
  Textarea,
} from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";

import { InfoCards } from "@/components/InfoCards";
import { SdsLink } from "@/components/SdsLink";
import { NextLink } from "@/components/NextLink";
import { formComponentTemplateEndpoints } from "@/components/formComponentTemplateEndpoints";
import { PrettyJson } from "@/components/PrettyJson";
import { InputSideElement } from "@/components/InputSideElement";

import { useStore } from "@/store/useStore";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { parseJsonString } from "@/helpers/parseJsonString";
import { openUrl } from "@/helpers/openUrl";

import { Routes } from "@/constants/routes";
import { ENDPOINTS_PAGES_HORIZON } from "@/constants/endpointsPages";
import { useEndpoint } from "@/query/useEndpoint";
import {
  AnyObject,
  AssetObject,
  AssetObjectValue,
  Network,
} from "@/types/types";

export default function Endpoints() {
  const pathname = usePathname();
  const currentPage = pathname.split(Routes.ENDPOINTS)?.[1];

  const page = ENDPOINTS_PAGES_HORIZON.navItems
    .find((page) => pathname.includes(page.route))
    ?.nestedItems?.find((i) => i.route === pathname);

  const pageData = page?.form;
  const requiredFields = sanitizeArray(
    pageData?.requiredParams?.split(",") || [],
  );

  const { endpoints, network } = useStore();
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

  const queryClient = useQueryClient();
  const {
    data: endpointData,
    isLoading,
    isFetching,
    error: endpointError,
    refetch,
    isSuccess,
    isError,
  } = useEndpoint(
    requestUrl,
    // There is only one endpoint request for POST, using params directly for
    // simplicity.
    pageData?.requestMethod === "POST" ? { tx: params.tx ?? "" } : undefined,
  );

  const responseEl = useRef<HTMLDivElement | null>(null);

  const isSubmitEnabled = () => {
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

    setFormError(paramErrors());

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
    if (currentEndpoint && currentEndpoint !== currentPage) {
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
    } else if (network.id && network.id !== endpointNetwork.id) {
      resetStates();
      updateNetwork(network as Network);
    }
  }, [endpointNetwork.id, network, resetStates, updateNetwork]);

  // Scroll to response
  useEffect(() => {
    if (isSuccess || isError) {
      responseEl?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isSuccess, isError]);

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

    const baseUrl = `${endpointNetwork.horizonUrl}${parseUrlPath(urlPath)}`;

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

    return `${baseUrl}${searchParamString ? `?${searchParamString}` : ""}`;
    // Not including RegEx const
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpointNetwork.horizonUrl, params, urlParams, urlPath]);

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

    const t = setTimeout(() => {
      refetch();
      clearTimeout(t);
    }, delay);
  };

  const renderPostPayload = () => {
    if (pageData?.requestMethod === "POST") {
      return (
        <div className="Endpoints__txTextarea">
          <Textarea
            id="tx"
            fieldSize="md"
            label="Payload"
            value={JSON.stringify({ tx: params.tx ?? "" }, null, 2)}
            rows={5}
            disabled
            spellCheck={false}
          />
        </div>
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
              >
                {pageData.requestMethod}
              </InputSideElement>
            }
          />
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
          <CopyText textToCopy={requestUrl}>
            <Button
              size="md"
              variant="tertiary"
              icon={<Icon.Copy01 />}
              type="button"
            ></Button>
          </CopyText>
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

    if (!pageData || allFields.length === 0) {
      return null;
    }

    return (
      <div className="Endpoints__content">
        <div className="PageBody__content" data-testid="endpoints-pageContent">
          {renderPostPayload()}

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

                if (error) {
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
        </div>
      </div>
    );
  };

  if (pathname === Routes.ENDPOINTS) {
    return <EndpointsLandingPage />;
  }

  if (!pageData) {
    return <>{`${page?.label} page is coming soon.`}</>;
  }

  return (
    <>
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          {page.label}
        </Text>

        <SdsLink
          href={pageData.docsUrl}
          icon={<Icon.LinkExternal01 />}
          data-testid="endpoints-docsLink"
        >
          {`View ${pageData.docsLabel ? `${pageData.docsLabel} ` : ""}documentation`}
        </SdsLink>
      </div>

      <Card>
        <form className="PageBody" onSubmit={handleSubmit}>
          {renderEndpointUrl()}
          {renderFields()}
        </form>
      </Card>

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
                  <PrettyJson json={endpointData.json} />
                </div>

                <div className="PageFooter">
                  <div>{/* TODO: add conditional StellarExpert link */}</div>
                  <div>
                    <CopyText
                      textToCopy={JSON.stringify(endpointData.json, null, 2)}
                    >
                      <Button
                        size="md"
                        variant="tertiary"
                        icon={<Icon.Copy01 />}
                        iconPosition="left"
                      >
                        Copy JSON
                      </Button>
                    </CopyText>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      ) : null}

      <Alert variant="primary" placement="inline">
        This tool can be used to run queries against the{" "}
        <SdsLink href="https://developers.stellar.org/network/horizon/resources">
          REST API endpoints
        </SdsLink>{" "}
        on the Horizon server. Horizon is the client facing library for the
        Stellar ecosystem.
      </Alert>
    </>
  );
}

const EndpointsLandingPage = () => {
  const infoCards = [
    {
      id: "stellar-rpc",
      title: "Stellar RPC Endpoints",
      description: "Learn about the RPC endpoints in our Developer Docs.",
      buttonLabel: "See docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        openUrl("https://developers.stellar.org/network/soroban-rpc/methods"),
    },
    {
      id: "horizon",
      title: "Horizon Endpoints",
      description: "Learn about the Horizon endpoints in our Developer Docs.",
      buttonLabel: "See docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        openUrl("https://developers.stellar.org/network/horizon/resources"),
    },
  ];

  return (
    <>
      <Card>
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Endpoints
          </Text>

          <Text size="sm" as="p">
            The Stellar Laboratory is a set of tools that enables people to try
            out and learn about the Stellar network. The Laboratory can{" "}
            <NextLink href={Routes.BUILD_TRANSACTION} sds-variant="primary">
              build transactions
            </NextLink>
            ,{" "}
            <NextLink href={Routes.SIGN_TRANSACTION} sds-variant="primary">
              sign them
            </NextLink>
            , and{" "}
            <NextLink href={Routes.SUBMIT_TRANSACTION} sds-variant="primary">
              submit them to the network
            </NextLink>
            . In this section of the Laboratory, you can explore the various
            endpoints from the RPC and Horizon, make requests to these
            endpoints, and save them for future use.
          </Text>

          <Text size="sm" as="p">
            For Stellar docs, take a look at the{" "}
            <Link href="https://developers.stellar.org/">
              Stellar developers site
            </Link>
            .
          </Text>
        </div>
      </Card>
      <InfoCards infoCards={infoCards} />
    </>
  );
};
