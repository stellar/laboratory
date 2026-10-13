import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Icon } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SectionHeader } from "@/components/Home/SectionHeader";

import { getPublicResourcePath } from "@/helpers/getPublicResourcePath";

import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const SaveAndShare = () => {
  const router = useRouter();

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

      {/* 3x export (1773x537) rendered at 591x179 CSS, so it stays sharp on
          retina; next/image serves an appropriate srcset. */}
      <div className="SaveAndShare__art" aria-hidden="true">
        <Image
          src={getPublicResourcePath("/images/lab-home-save-share-v2.png")}
          alt=""
          width={591}
          height={179}
        />
      </div>
    </div>
  );
};
