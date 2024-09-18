import { delayedAction } from "@/helpers/delayedAction";
import { useEffect } from "react";

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
