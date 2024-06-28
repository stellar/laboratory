import { Icon, Card, Text, Link } from "@stellar/design-system";
import { NextLink } from "@/components/NextLink";
import { Routes } from "@/constants/routes";
import { InfoCards } from "@/components/InfoCards";
import { openUrl } from "@/helpers/openUrl";

export const EndpointsLandingPage = () => {
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
