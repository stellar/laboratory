import { Icon, Text } from "@stellar/design-system";

import { CardGrid } from "@/components/Home/CardGrid";
import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

const EXPLORE_INSPECT: {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "transactions",
    title: "Transactions.",
    description: "Build, sign, submit, and inspect.",
    route: Routes.TRANSACTION_DASHBOARD,
    icon: <Icon.SwitchHorizontal01 />,
  },
  {
    id: "smart-contracts",
    title: "Smart contracts.",
    description: "Deploy, explore, and call contracts.",
    route: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
    icon: <Icon.Cube01 />,
  },
  {
    id: "api-explorer",
    title: "API explorer.",
    description: "Test Stellar RPC and Horizon endpoints.",
    route: Routes.ENDPOINTS,
    icon: <Icon.Server01 />,
  },
  {
    id: "xdr-tools",
    title: "XDR tools.",
    description: "Decode, encode, and compare Stellar XDR.",
    route: Routes.VIEW_XDR,
    icon: <Icon.Code01 />,
  },
];

export const ExploreInspect = () => (
  <CardGrid columns={4} isBorderless addlClassName="ExploreInspect">
    {EXPLORE_INSPECT.map((item) => (
      <CardGrid.Cell
        key={item.id}
        href={item.route}
        onClick={() =>
          trackEvent(TrackingEvent.HOME_EXPLORE, { card: item.id })
        }
      >
        <span className="ExploreInspect__tile" aria-hidden="true">
          {item.icon}
        </span>

        <Text as="div" size="sm" addlClassName="ExploreInspect__body">
          <strong className="ExploreInspect__title">{item.title}</strong>{" "}
          {item.description}
        </Text>
      </CardGrid.Cell>
    ))}
  </CardGrid>
);
