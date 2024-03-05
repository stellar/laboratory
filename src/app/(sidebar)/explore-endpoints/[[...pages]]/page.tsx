"use client";

import { usePathname } from "next/navigation";
import { Card, Icon, Text } from "@stellar/design-system";

import { InfoCards } from "@/components/InfoCards";
import { Routes } from "@/constants/routes";

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
    buttonLabel: "Go to docs",
    buttonIcon: <Icon.LinkExternal01 />,
    buttonAction: () =>
      window.open(
        "https://developers.stellar.org/api/horizon/resources/",
        "_blank",
      ),
  },
];

export default function ExploreEndpoints() {
  const pathname = usePathname();

  if (pathname === Routes.EXPLORE_ENDPOINTS) {
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
  }

  return renderPage(pathname);
}

const renderPage = (pathname: string) => {
  // TODO: add switch to render path component
  return <div>{`Explore Endpoints: ${pathname}`}</div>;
};
