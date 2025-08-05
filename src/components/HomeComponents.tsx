import { useState } from "react";
import Image from "next/image";
import { Heading, Icon, Text, Button } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";

import { ThemeColorType } from "@/types/types";

export const HomeSection = ({
  title,
  eyebrow,
  description,
  children,
  isTopSection = false,
}: {
  title: string;
  eyebrow?: string;
  description?: React.ReactNode;
  children: React.ReactElement | React.ReactElement[];
  isTopSection?: boolean;
}) => (
  <div className="Lab__home__section" data-no-padding="true">
    <Box gap="xl" addlClassName="Lab__home__content">
      <Box gap="xs">
        {eyebrow ? <div className="Lab__home__eyebrow">{eyebrow}</div> : null}
        <Heading
          as={isTopSection ? "h1" : "h2"}
          size={isTopSection ? "md" : "xs"}
          weight="semi-bold"
        >
          {title}
        </Heading>
        {description ? (
          <Text size="md" as="p">
            {description}
          </Text>
        ) : null}
      </Box>

      {children}
    </Box>
  </div>
);

export const HomeTutorials = () => {
  // TODO: replace placeholder data
  const tutorials = [
    {
      title: "Create Account",
      description: "Creates and funds a new Stellar account.",
      youTubeLink:
        "https://www.youtube.com/embed/BSbkptStkKY?si=E1WMYdnM5hsfePyr",
    },
    {
      title: "Payment",
      description:
        "Send an amount in a specific asset to a destination account.",
      youTubeLink:
        "https://www.youtube.com/embed/B18a9AGrsA4?si=ezfrR3Lec8NoyHdy",
    },
    {
      title: "Change Trust",
      description:
        "Create, update, or delete trustlines for the assets on the network.",
      youTubeLink:
        "https://www.youtube.com/embed/0HKCpCKQLJo?si=PtlxiR3vdKxmzL_N",
    },
    {
      title: "Manage Offers",
      description: "TODO: add description",
      youTubeLink:
        "https://www.youtube.com/embed/bAbcYh03x10?si=KxxDxv4dZTd45m3d",
    },
    {
      title: "Create Account",
      description: "Creates and funds a new Stellar account.",
      youTubeLink:
        "https://www.youtube.com/embed/BSbkptStkKY?si=E1WMYdnM5hsfePyr",
    },
    {
      title: "Payment",
      description:
        "Send an amount in a specific asset to a destination account.",
      youTubeLink:
        "https://www.youtube.com/embed/B18a9AGrsA4?si=ezfrR3Lec8NoyHdy",
    },
    {
      title: "Change Trust",
      description:
        "Create, update, or delete trustlines for the assets on the network.",
      youTubeLink:
        "https://www.youtube.com/embed/0HKCpCKQLJo?si=PtlxiR3vdKxmzL_N",
    },
    {
      title: "Manage Offers",
      description: "TODO: add description",
      youTubeLink:
        "https://www.youtube.com/embed/bAbcYh03x10?si=KxxDxv4dZTd45m3d",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="Lab__home__tutorials">
      {/* Video */}
      <div className="Lab__home__tutorials__video">
        <iframe
          width="100%"
          height="100%"
          src={tutorials[selectedIndex].youTubeLink}
          title={`${tutorials[selectedIndex].title} video`}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* List */}
      <div className="Lab__home__tutorials__list">
        <div className="Lab__home__tutorials__list__container">
          <Box gap="xs" addlClassName="Lab__home__tutorials__list__scroll">
            {tutorials.map((t, idx) => (
              <div
                key={`tutorialItem-${idx}`}
                className="Lab__home__tutorials__item"
                onClick={() => {
                  setSelectedIndex(idx);
                }}
                data-selected={selectedIndex === idx}
              >
                <Text
                  as="div"
                  size="sm"
                  weight="semi-bold"
                  addlClassName="Lab__home__tutorials__item__title"
                  data-number={idx + 1}
                >
                  {t.title}
                </Text>
                <Text
                  as="div"
                  size="sm"
                  addlClassName="Lab__home__tutorials__item__description"
                >
                  {t.description}
                </Text>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
};

export const HomeNetworks = ({ theme }: { theme: ThemeColorType | null }) => {
  const imgTheme = theme === "sds-theme-dark" ? "dark" : "light";

  // TODO: add button actions
  const networkItems = [
    {
      id: "testnet",
      title: "Testnet",
      description:
        "Works like a staging environment. Test and develop without using real XLM.",
      imagePath: `/images/lab-home-net-test-${imgTheme}.png`,
      links: [
        {
          label: "Try Testnet",
        },
      ],
    },
    {
      id: "mainnet",
      title: "Mainnet",
      description:
        "This is the production environment. Connect to the Stellar public network.",
      imagePath: `/images/lab-home-net-main-${imgTheme}.png`,
      links: [
        {
          label: "Try Mainnet",
        },
      ],
    },
    {
      id: "local",
      title: "Local Network",
      description: "Use the Stellar CLI to create a local network.",
      imagePath: `/images/lab-home-net-local-${imgTheme}.png`,
      links: [
        {
          label: "Use Quickstart",
        },
        {
          label: "Use Stellar CLI",
        },
      ],
    },
  ];

  return (
    <div className="Lab__home__networks">
      {networkItems.map((i) => (
        <div
          key={`networkItem-${i.id}`}
          className="Lab__home__networks__item"
          data-id={i.id}
        >
          <div className="Lab__home__networks__image">
            <Image
              src={i.imagePath}
              alt={`${i.title} image`}
              width={304}
              height={200}
            />
          </div>
          <Box gap="md" addlClassName="Lab__home__networks__content">
            <Box gap="xs">
              <Text
                size="xl"
                as="div"
                weight="semi-bold"
                addlClassName="Lab__home__networks__title"
              >
                {i.title}
              </Text>
              <Text
                size="md"
                as="div"
                addlClassName="Lab__home__networks__description"
              >
                {i.description}
              </Text>
            </Box>
            <Box gap="sm">
              {i.links.map((l, idx) => (
                <Button
                  variant="tertiary"
                  size="lg"
                  key={`networkItem-${i.id}-btn-${idx}`}
                  icon={<Icon.ArrowRight />}
                >
                  {l.label}
                </Button>
              ))}
            </Box>
          </Box>
        </div>
      ))}
    </div>
  );
};

export const HomeResources = () => {
  const resourceItems = [
    {
      title: "Developer Docs",
      description: "Place to find answers, how to build features step by step.",
      link: "https://developers.stellar.org/",
    },
    {
      title: "YouTube",
      description: "Watch tutorials, hear from us, and get inspired to build.",
      link: "https://www.youtube.com/@StellarDevelopmentFoundation",
    },
    {
      title: "Stellar Quest",
      description: "Get tested and earn rewards like XLM and NFTs.",
      link: "https://quest.stellar.org/",
    },
    {
      title: "X (Twitter)",
      description:
        "Follow along with us @StellarOrg for updates on our platforms.",
      link: "https://twitter.com/StellarOrg",
    },
    {
      title: "Discord",
      // TODO: description cut off
      description: "Chat with us and the rest of the dev community on our...",
      link: "https://discord.gg/stellardev",
    },
  ];

  return (
    <div className="Lab__home__resources">
      {resourceItems.map((i, idx) => (
        <div className="Lab__home__resources__item" key={`resourceItem-${idx}`}>
          <Text size="sm" as="div" addlClassName="Lab__home__resources__title">
            {i.title}
          </Text>
          <Text
            size="md"
            as="div"
            weight="medium"
            addlClassName="Lab__home__resources__description"
          >
            {i.description}{" "}
            <SdsLink
              href={i.link}
              variant="primary"
              icon={<Icon.LinkExternal01 />}
            ></SdsLink>
          </Text>
        </div>
      ))}
    </div>
  );
};
