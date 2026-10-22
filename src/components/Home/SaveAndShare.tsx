import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Icon } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SectionHeader } from "@/components/Home/SectionHeader";

import { getPublicResourcePath } from "@/helpers/getPublicResourcePath";
import { useStore } from "@/store/useStore";

import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const SaveAndShare = () => {
  const router = useRouter();
  const { theme } = useStore();
  const imgSuffix = theme === "sds-theme-light" ? "" : "-dark";

  return (
    <div className="SaveAndShare">
      <Box gap="lg" addlClassName="SaveAndShare__copy">
        <SectionHeader
          title="Save and share your work"
          description="Save transactions and experiments to revisit later or share with others."
        />

        <div>
          <Button
            size="md"
            variant="tertiary"
            icon={<Icon.ArrowRight />}
            iconPosition="right"
            onClick={() => {
              trackEvent(TrackingEvent.HOME_TOP_BTN, { type: "view saved" });
              router.push(Routes.SAVED_TRANSACTIONS);
            }}
          >
            View saved
          </Button>
        </div>
      </Box>

      {/* Light (1773x537) and dark (2711x824) exports share an aspect ratio and
          render at 591x179 CSS, so they stay sharp on retina; next/image serves
          an appropriate srcset. */}
      <div className="SaveAndShare__art" aria-hidden="true">
        <Image
          src={getPublicResourcePath(
            `/images/lab-home-save-share-v2${imgSuffix}.png`,
          )}
          alt=""
          width={591}
          height={179}
        />
      </div>
    </div>
  );
};
