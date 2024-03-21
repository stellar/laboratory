"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CopyText,
  Icon,
  Input,
  Link,
  Text,
} from "@stellar/design-system";

import { InfoCards } from "@/components/InfoCards";
import { TabView } from "@/components/TabView";
import { SdsLink } from "@/components/SdsLink";
import { WithInfoText } from "@/components/WithInfoText";
import { NextLink } from "@/components/NextLink";

import { useStore } from "@/store/useStore";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { parseJsonString } from "@/helpers/parseJsonString";

import { Routes } from "@/constants/routes";
import { EXPLORE_ENDPOINTS_PAGES_HORIZON } from "@/constants/exploreEndpointsPages";
import { formComponentTemplate } from "@/constants/formComponentTemplate";
import { AnyObject, AssetObject, Network } from "@/types/types";

// TODO: handle streaming

export default function ExploreEndpoints() {
  const pathname = usePathname();
  const currentPage = pathname.split(Routes.EXPLORE_ENDPOINTS)?.[1];

  const page = EXPLORE_ENDPOINTS_PAGES_HORIZON.navItems
    .find((page) => pathname.includes(page.route))
    ?.nestedItems?.find((i) => i.route === pathname);

  const pageData = page?.form;
  const requiredFields = sanitizeArray(
    pageData?.requiredParams?.split(",") || [],
  );

  const { exploreEndpoints, network } = useStore();
  const {
    params,
    currentEndpoint,
    network: endpointNetwork,
    updateParams,
    updateCurrentEndpoint,
    updateNetwork,
    resetParams,
  } = exploreEndpoints;

  const [activeTab, setActiveTab] = useState("endpoints-tab-params");
  const [formError, setFormError] = useState<AnyObject>({});
  const [requestUrl, setRequestUrl] = useState<string>("");

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

    // When non-native asset is selected, code and issuer fields are required
    if (params.asset) {
      const assetObj = parseJsonString(params.asset);

      if (
        ["issued", "credit_alphanum4", "credit_alphanum12"].includes(
          assetObj.type,
        )
      ) {
        isValidReqAssetFields = Boolean(assetObj.code && assetObj.issuer);
      }
    }

    return isValidReqAssetFields && isValidReqFields && isValid;
  };

  useEffect(() => {
    // Validate saved params when the page loads
    const paramErrors = () => {
      return Object.keys(params).reduce((res, param) => {
        const error = formComponentTemplate(param)?.validate?.(
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

  useEffect(() => {
    if (currentPage) {
      updateCurrentEndpoint(currentPage);
    }

    // Clear form and errors if navigating to another endpoint page. We don't
    // want to keep previous form values.
    if (currentEndpoint && currentEndpoint !== currentPage) {
      resetParams();
      setFormError({});
    }
  }, [currentPage, currentEndpoint, updateCurrentEndpoint, resetParams]);

  useEffect(() => {
    // Save network for endpoints if we don't have it yet.
    if (network.id && !endpointNetwork.id) {
      updateNetwork(network as Network);
      // When network changes, clear saved params and errors.
    } else if (network.id && network.id !== endpointNetwork.id) {
      resetParams();
      setFormError({});
      updateNetwork(network as Network);
    }
  }, [endpointNetwork.id, network, resetParams, updateNetwork]);

  const buildUrl = useCallback(() => {
    const mapPathParamToValue = (pathParams: string[]) => {
      return pathParams.map((pp) => params[pp] ?? pp).join("/");
    };

    const endpointPath = `/accounts${pageData?.endpointPathParams ? `/${mapPathParamToValue(pageData.endpointPathParams.split(","))}` : ""}`;
    const endpointParams = pageData?.endpointParams;

    const baseUrl = `${endpointNetwork.horizonUrl}${endpointPath}`;
    const searchParams = new URLSearchParams();
    const templateParams = endpointParams?.split(",");

    const getParamRequestValue = (param: string) => {
      const value = parseJsonString(params[param]);

      if (!value) {
        return false;
      }

      if (param === "asset") {
        if (value.type === "native") {
          return "native";
        }

        return `${value.code}:${value.issuer}`;
      }

      return value;
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
  }, [
    endpointNetwork.horizonUrl,
    pageData?.endpointParams,
    pageData?.endpointPathParams,
    params,
  ]);

  useEffect(() => {
    setRequestUrl(buildUrl());
  }, [buildUrl]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: handle submit
  };

  const renderEndpointUrl = () => {
    if (!pageData) {
      return null;
    }

    return (
      <div className="Endpoints__urlBar">
        <Input
          id="endpoint-url"
          fieldSize="md"
          value={requestUrl}
          readOnly
          disabled
          leftElement={
            <div className="Endpoints__input__requestType">
              {pageData.requestMethod}
            </div>
          }
        />
        <Button
          size="md"
          variant="secondary"
          type="submit"
          disabled={!isSubmitEnabled()}
        >
          Submit
        </Button>
        <CopyText textToCopy={requestUrl}>
          <Button size="md" variant="tertiary" icon={<Icon.Copy01 />}></Button>
        </CopyText>
      </div>
    );
  };

  const renderFields = () => {
    if (!pageData) {
      return null;
    }

    const allFields = sanitizeArray([
      ...pageData.endpointPathParams.split(","),
      ...pageData.endpointParams.split(","),
    ]);

    return (
      <div className="Endpoints__content">
        <div className="Endpoints__content__inputs">
          {allFields.map((f) => {
            const component = formComponentTemplate(f, pageData.custom?.[f]);

            if (component) {
              const isRequired = requiredFields.includes(f);

              // storeValue is saved in the store and may need special
              // formatting (sanitizing object or array, for exmaple).
              // Error check needs the original value.
              const handleChange = (value: any, storeValue: any) => {
                updateParams({
                  [f]: storeValue,
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
                case "order":
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

        {pageData.isStreaming ? (
          <WithInfoText href="https://developers.stellar.org/network/horizon/structure/streaming">
            <Checkbox
              id="streaming-mode"
              label="Server-Sent Events (streaming mode)"
              fieldSize="md"
            />
          </WithInfoText>
        ) : null}
      </div>
    );
  };

  if (pathname === Routes.EXPLORE_ENDPOINTS) {
    return <ExploreEndpointsLandingPage />;
  }

  if (!pageData) {
    return <>{`${page?.label} page is coming soon.`}</>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TabView
          heading={{ title: page.label, href: pageData.info }}
          staticTop={renderEndpointUrl()}
          tab1={{
            id: "endpoints-tab-params",
            label: "Params",
            content: renderFields(),
          }}
          tab2={{
            id: "endpoints-tab-json",
            label: "JSON Response",
            content: <div>TODO: render JSON</div>,
          }}
          onTabChange={(id) => {
            setActiveTab(id);
          }}
          activeTabId={activeTab}
        />
      </form>
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

const ExploreEndpointsLandingPage = () => {
  const infoCards = [
    {
      id: "stellar-rpc",
      title: "Stellar RPC Endpoints",
      description: "Learn about the RPC endpoints in our Developer Docs.",
      buttonLabel: "See docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        window.open(
          "https://developers.stellar.org/network/soroban-rpc/methods",
          "_blank",
        ),
    },
    {
      id: "horizon",
      title: "Horizon Endpoints",
      description: "Learn about the Horizon endpoints in our Developer Docs.",
      buttonLabel: "See docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        window.open(
          "https://developers.stellar.org/network/horizon/resources",
          "_blank",
        ),
    },
  ];

  return (
    <>
      <Card>
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Explore Endpoints
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
            <Link href="https://developers.stellar.org/docs">
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
