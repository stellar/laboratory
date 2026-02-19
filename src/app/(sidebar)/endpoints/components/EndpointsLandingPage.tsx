import { Icon, Text, Link } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { HomeSection } from "@/components/Home/Section";
import { useStore } from "@/store/useStore";
import { useWindowSize } from "@/hooks/useWindowSize";

import "@/styles/home.scss";

export const EndpointsLandingPage = () => {
  const { theme } = useStore();
  const { windowWidth } = useWindowSize();

  const imgTheme = theme === "sds-theme-light" ? "light" : "dark";
  const isMobile = windowWidth && windowWidth < 600;

  const rpcCards = [
    {
      id: "rpc-query",
      title: "RPC Query Methods",
      description:
        "Read Stellar blockchain data such as network state, accounts, transactions, and ledgers.",
      link: "https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods",
      icon: <Icon.SearchRefraction />,
    },
    {
      id: "rpc-sim-fees",
      title: "Simulation & Fees",
      description:
        "Validate and analyze transactions or smart contracts calls before execution. Better understand fees on the network.",
      link: "https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/simulateTransaction",
      icon: <Icon.Server05 />,
    },
    {
      id: "rpc-tx",
      title: "Transaction Execution",
      description:
        "Perform actual state change on the network, such as creating, signing, and submitting transactions.",
      link: "https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/sendTransaction",
      icon: <Icon.Dataflow03 />,
    },
  ];

  return (
    <Box gap="custom" customValue="48px" addlClassName="Endpoints__introPage">
      <HomeSection
        title="API Explorer"
        eyebrow="Introduction"
        description="The API Explorer lets you test, interact with, save, and share Stellar’s RPC and Horizon API requests directly in your browser."
        isPageTitle={true}
      />

      <HomeSection
        title="About RPC Methods"
        description={
          <>
            Multiple infrastructure providers offer Stellar RPC services with
            plans ranging from free to dedicated instances.{" "}
            <Link href="https://developers.stellar.org/docs/data/apis/api-providers">
              Learn more
            </Link>
            .
          </>
        }
      >
        <div className="Endpoints__rpcIntroCards">
          {rpcCards.map((card) => (
            <IntroCard
              key={card.id}
              title={card.title}
              icon={card.icon}
              description={card.description}
              link={card.link}
            />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        title="Save & Sharing"
        description="You can save methods in the browser’s local storage and get shareable link to provide to others."
      >
        <div className="Endpoints__imageBox">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              isMobile
                ? `/images/lab-endpoints-ss-mobile-${imgTheme}.png`
                : `/images/lab-endpoints-ss-${imgTheme}.png`
            }
            alt="Save & Sharing graphic"
          />
        </div>
      </HomeSection>

      <HomeSection
        title="About Horizon Endpoints"
        description={
          <>
            <span className="Endpoints__introCard--warning">Warning</span>:
            Horizon is considered deprecated in favor of Stellar RPC. While it
            will continue to receive updates to maintain compatibility with
            upcoming protocol releases, it won’t receive significant new feature
            development.{" "}
            <Link href="https://developers.stellar.org/docs/data/apis/horizon">
              Learn more
            </Link>
            .
          </>
        }
      >
        <IntroCard
          title="Horizon"
          icon={<Icon.Data />}
          description="Horizon provides an HTTP API to certain data in the Stellar network."
          link="https://developers.stellar.org/docs/data/apis/horizon/admin-guide/overview"
        />
      </HomeSection>
    </Box>
  );
};

const IntroCard = ({
  title,
  icon,
  description,
  link,
  children,
}: {
  title: string;
  icon: React.ReactElement;
  description: React.ReactNode;
  link: string;
  children?: React.ReactNode;
}) => {
  return (
    <a
      className="Endpoints__introCard"
      href={link}
      target="_blank"
      rel="noreferrer noopener"
    >
      <Box
        gap="lg"
        direction="row"
        align="center"
        justify="space-between"
        addlClassName="Endpoints__introCard__header"
      >
        <Box
          gap="sm"
          direction="row"
          align="center"
          addlClassName="Endpoints__introCard__title"
        >
          {icon}

          <Text size="md" as="h3" weight="semi-bold">
            {title}
          </Text>
        </Box>

        <Icon.ArrowUpRight />
      </Box>

      <Text size="sm" as="div">
        {description}
      </Text>

      {children}
    </a>
  );
};
