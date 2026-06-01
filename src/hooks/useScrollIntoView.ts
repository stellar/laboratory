import { useEffect } from "react";
import { scrollElIntoView } from "@/helpers/scrollElIntoView";

export const useScrollIntoView = (
  isEnabled: boolean,
  scrollEl: React.RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    if (isEnabled) {
      scrollElIntoView(scrollEl);
    }
  }, [isEnabled, scrollEl]);
};
