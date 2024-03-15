"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CopyText,
  Icon,
  Input,
  Text,
} from "@stellar/design-system";

import { InfoCards } from "@/components/InfoCards";
import { TabView } from "@/components/TabView";
import { SdsLink } from "@/components/SdsLink";
import { Routes } from "@/constants/routes";
import { WithInfoText } from "@/components/WithInfoText";

import { useStore } from "@/store/useStore";
import { validate } from "@/validate";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { AnyObject, Network } from "@/types/types";

// TODO: build URL with valid params
// TODO: render fields based on route
// TODO: add streaming

export default function ExploreEndpoints() {
  const pathname = usePathname();

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

  const requiredFields = ["sponsor"];

  // TODO: fields to validate
  const paramValidation = {
    sponsor: validate.publicKey,
    signer: validate.publicKey,
    asset: validate.asset,
  };

  // TODO:
  // const formParams = {
  //   sponsor: "",
  //   signer: "",
  //   // asset: "",
  //   cursor: "",
  //   limit: "",
  //   // order: "",
  // };

  const [activeTab, setActiveTab] = useState("endpoints-tab-params");
  const [formError, setFormError] = useState<AnyObject>({});
  const currentPage = pathname.split(Routes.EXPLORE_ENDPOINTS)?.[1];

  const isSubmitEnabled = () => {
    const missingReqFields = requiredFields.reduce((res, cur) => {
      if (!params[cur]) {
        return [...res, cur];
      }

      return res;
    }, [] as string[]);

    if (missingReqFields.length !== 0) {
      return false;
    }

    return isEmptyObject(formError);
  };

  useEffect(() => {
    // Validate saved params when the page loads
    const paramErrors = () => {
      return Object.keys(params).reduce((res, param) => {
        const error = (paramValidation as any)?.[param](
          params[param],
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

  if (pathname === Routes.EXPLORE_ENDPOINTS) {
    return <ExploreEndpointsLandingPage />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: handle submit
  };

  const renderEndpointUrl = () => {
    return (
      <div className="Endpoints__urlBar">
        <Input
          id="endpoint-url"
          fieldSize="md"
          // TODO: update URL
          value="https://"
          readOnly
          disabled
          // TODO: set request type
          leftElement={<div className="Endpoints__input__requestType">GET</div>}
        />
        <Button
          size="md"
          variant="secondary"
          type="submit"
          disabled={!isSubmitEnabled()}
        >
          Submit
        </Button>
        {/* TODO: add text to copy */}
        <CopyText textToCopy="">
          <Button size="md" variant="tertiary" icon={<Icon.Copy01 />}></Button>
        </CopyText>
      </div>
    );
  };

  const renderFields = () => {
    return (
      <div className="Endpoints__content">
        <div className="Endpoints__content__inputs">
          {/* TODO: render fields for path */}
          {`Explore Endpoints: ${pathname}`}

          <div>
            <Input
              label="Sponsor"
              id="sponsor"
              fieldSize="md"
              value={params.sponsor || ""}
              onChange={(e) => {
                updateParams({ [e.target.id]: e.target.value });
                const error = paramValidation.sponsor(
                  e.target.value,
                  requiredFields.includes(e.target.id),
                );

                if (error) {
                  setFormError({ ...formError, [e.target.id]: error });
                } else {
                  if (formError[e.target.id]) {
                    const updatedErrors = { ...formError };
                    delete updatedErrors[e.target.id];
                    setFormError(updatedErrors);
                  }
                }
              }}
              error={formError.sponsor}
            />

            <Input
              label="Signer"
              id="signer"
              fieldSize="md"
              value={params.signer || ""}
              onChange={(e) => {
                updateParams({ [e.target.id]: e.target.value });
                const error = paramValidation.signer(
                  e.target.value,
                  requiredFields.includes(e.target.id),
                );

                if (error) {
                  setFormError({ ...formError, [e.target.id]: error });
                } else {
                  if (formError[e.target.id]) {
                    const updatedErrors = { ...formError };
                    delete updatedErrors[e.target.id];
                    setFormError(updatedErrors);
                  }
                }
              }}
              error={formError.signer}
            />
          </div>
        </div>

        <WithInfoText href="https://developers.stellar.org/network/horizon/structure/streaming">
          <Checkbox
            id="streaming-mode"
            label="Server-Sent Events (streaming mode)"
            fieldSize="md"
          />
        </WithInfoText>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TabView
          heading={{ title: "Heading title", href: "http://stellar.org" }}
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
        <SdsLink href="https://developers.stellar.org/network/horizon">
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
      id: "soroban-rpc",
      title: "RPC Endpoints",
      description: "TODO: add text",
      buttonLabel: "See docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        window.open("https://soroban.stellar.org/api/methods", "_blank"),
    },
    {
      id: "horizon",
      title: "Horizon Endpoints",
      description: "TODO: add text",
      buttonLabel: "See docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        window.open(
          "https://developers.stellar.org/api/horizon/resources/",
          "_blank",
        ),
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
            TODO: add text
          </Text>
        </div>
      </Card>
      <InfoCards infoCards={infoCards} />
    </>
  );
};
