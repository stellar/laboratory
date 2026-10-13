import Image from "next/image";
import { Button, Icon, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { NextLink } from "@/components/NextLink";

import { getPublicResourcePath } from "@/helpers/getPublicResourcePath";
import { openUrl } from "@/helpers/openUrl";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

const TUTORIALS_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLmr3tp_7-7GiyTrRhKjlznmWe7AqFPq6i";

// @TODO Dark thumbnail exports don't exist yet, so both themes resolve to the same
// screenshot. Add a `-${imgTheme}` suffix here when they do.
const TUTORIALS: {
  id: string;
  title: string;
  description: string;
  image: string;
  youTubeLink: string;
}[] = [
  {
    id: "create-account",
    title: "Create an account",
    description: "Creates and funds a new Stellar account.",
    image: "/images/lab-home-tutorial-create-account.png",
    youTubeLink: "https://www.youtube.com/watch?v=7j5t69f40dM",
  },
  {
    id: "payments",
    title: "Payments",
    description: "Send an amount in a specific asset to a destination account.",
    image: "/images/lab-home-tutorial-payments.png",
    youTubeLink: "https://www.youtube.com/watch?v=NsDxKZE5ESY",
  },
  {
    id: "hello-world",
    title: "Hello world",
    description: "Build a contract, deploy it, then invoke a method.",
    image: "/images/lab-home-tutorial-hello-world.png",
    youTubeLink: "https://www.youtube.com/watch?v=XcFgR_OHKl8",
  },
];

export const LearnByBuilding = () => (
  <Box gap="sm" addlClassName="LearnByBuilding">
    <div className="CardGrid" data-columns="3">
      {TUTORIALS.map((item) => (
        <div className="CardGrid__cell" key={item.id}>
          <NextLink
            href={item.youTubeLink}
            className="LearnByBuilding__thumbnail"
            aria-label={`Watch: ${item.title}`}
            onClick={() =>
              trackEvent(TrackingEvent.HOME_TUTORIAL, { tutorial: item.id })
            }
          >
            <Image
              src={getPublicResourcePath(item.image)}
              alt=""
              aria-hidden="true"
              width={540}
              height={320}
            />
            <span className="LearnByBuilding__play" aria-hidden="true">
              <Icon.Play />
            </span>
          </NextLink>

          <Text
            as="div"
            size="sm"
            weight="medium"
            addlClassName="LearnByBuilding__title"
          >
            {item.title}
          </Text>

          <Text as="p" size="sm" addlClassName="LearnByBuilding__description">
            {item.description}
          </Text>
        </div>
      ))}
    </div>

    <div className="LearnByBuilding__viewAll">
      <Button
        size="md"
        variant="tertiary"
        icon={<Icon.LinkExternal01 />}
        iconPosition="right"
        onClick={() => {
          trackEvent(TrackingEvent.HOME_TUTORIAL, { tutorial: "view all" });
          openUrl(TUTORIALS_PLAYLIST_URL);
        }}
      >
        View all tutorials
      </Button>
    </div>
  </Box>
);
