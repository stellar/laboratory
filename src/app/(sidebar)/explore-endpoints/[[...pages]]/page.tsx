"use client";

import { useState } from "react";
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

export default function ExploreEndpoints() {
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("endpoints-tab-params");

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
        {/* TODO: disable if can't submit */}
        <Button size="md" variant="secondary" type="submit">
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
