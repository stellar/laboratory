import { delayedAction } from "@/helpers/delayedAction";

export const scrollElIntoView = (
  scrollEl: React.RefObject<HTMLDivElement | HTMLAnchorElement | null>,
) => {
  delayedAction({
    action: () => {
      scrollEl?.current?.scrollIntoView({ behavior: "smooth" });
    },
    delay: 300,
  });
};
