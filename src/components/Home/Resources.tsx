import { Button, Icon, Logo, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { openUrl } from "@/helpers/openUrl";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const Resources = () => {
  const resourceItems = [
    {
      id: "youtube",
      title: "YouTube",
      description: "Watch tutorials, hear from us, and get inspired to build.",
      link: "https://www.youtube.com/@StellarDevelopmentFoundation",
      icon: <Logo.Youtube />,
    },
    {
      id: "discord",
      title: "Discord",
      description:
        "Join the conversation and build with us in the dev community.",
      link: "https://discord.gg/stellardev",
      icon: <Logo.Discord />,
    },
    {
      id: "stellar-quest",
      title: "Stellar Quest",
      description: "Get tested and earn rewards like XLM and NFTs.",
      link: "https://quest.stellar.org/",
      icon: <Logo.StellarShort />,
    },
    {
      id: "x",
      title: "X (Twitter)",
      description:
        "Follow along with us @StellarOrg for updates on our platforms.",
      link: "https://twitter.com/StellarOrg",
      icon: <Logo.XTwitter />,
    },
    {
      id: "dev-docs",
      title: "Developer Docs",
      description: "Place to find answers, how to build features step by step.",
      link: "https://developers.stellar.org/",
      icon: <Icon.Code01 />,
    },
  ];

  return (
    <div className="Lab__home__resources">
      {resourceItems.map((i) => (
        <Box
          gap="lg"
          addlClassName="Lab__home__resources__item"
          data-item={i.id}
          key={`resourceItem-${i.id}`}
        >
          <Box
            gap="sm"
            direction="row"
            align="center"
            addlClassName="Lab__home__resources__title"
          >
            {i.icon}
            <Text size="sm" as="div">
              {i.title}
            </Text>
          </Box>
          <Text
            size="md"
            as="div"
            weight="medium"
            addlClassName="Lab__home__resources__description"
          >
            {i.description}{" "}
          </Text>

          <Button
            size="md"
            variant="tertiary"
            icon={<Icon.LinkExternal01 />}
            onClick={() => {
              trackEvent(TrackingEvent.HOME_RESOURCES_BTN, {
                resource: i.id,
              });
              openUrl(i.link);
            }}
          >
            Check it out
          </Button>
        </Box>
      ))}
    </div>
  );
};
