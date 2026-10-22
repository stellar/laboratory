import { Icon, Text } from "@stellar/design-system";

import { CardGrid } from "@/components/Home/CardGrid";
import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

// Glyphs chosen so no two read as "code": transfer, module, server, code.
const ICONS: Record<string, React.ReactNode> = {
  transactions: <Icon.SwitchHorizontal01 />,
  "smart-contracts": <Icon.Cube01 />,
  "api-explorer": <Icon.Server01 />,
  "xdr-tools": <Icon.Code01 />,
};

const EXPLORE_INSPECT: {
  id: string;
  title: string;
  description: string;
  route: string;
}[] = [
  {
    id: "transactions",
    title: "Transactions",
    description: "Build, sign, submit, and inspect.",
    route: Routes.TRANSACTION_DASHBOARD,
  },
  {
    id: "smart-contracts",
    title: "Smart contracts",
    description: "Deploy, explore, and call contracts.",
    route: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
  },
  {
    id: "api-explorer",
    title: "API explorer",
    description: "Test Stellar RPC and Horizon endpoints.",
    route: Routes.ENDPOINTS,
  },
  {
    id: "xdr-tools",
    title: "XDR tools",
    description: "Decode, encode, and compare Stellar XDR.",
    route: Routes.VIEW_XDR,
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
          {ICONS[item.id]}
        </span>

        <Text as="div" size="sm" addlClassName="ExploreInspect__body">
          <strong className="ExploreInspect__title">{item.title}.</strong>{" "}
          {item.description}
        </Text>
      </CardGrid.Cell>
    ))}
  </CardGrid>
);
