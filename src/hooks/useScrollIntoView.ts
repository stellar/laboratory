import { useEffect } from "react";
import { delayedAction } from "@/helpers/delayedAction";

export const useScrollIntoView = (
  isEnabled: boolean,
  scrollEl: React.MutableRefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    if (isEnabled) {
      delayedAction({
        action: () => {
          scrollEl?.current?.scrollIntoView({ behavior: "smooth" });
        },
        delay: 300,
      });
    }
  }, [isEnabled, scrollEl]);
};
