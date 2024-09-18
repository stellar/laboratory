import { Icon } from "@stellar/design-system";
import { Routes } from "@/constants/routes";
import {
  ENDPOINTS_PAGES_HORIZON,
  ENDPOINTS_PAGES_RPC,
  EndpointsPagesProps,
} from "@/constants/endpointsPages";

export const ACCOUNT_NAV_ITEMS = [
  {
    navItems: [
      {
        route: Routes.ACCOUNT_CREATE,
        label: "Create Account Keypair",
      },
      {
        route: Routes.ACCOUNT_FUND,
        label: "Fund Account",
      },
      {
        route: Routes.ACCOUNT_CREATE_MUXED,
        label: "Create Muxed Account",
      },
      {
        route: Routes.ACCOUNT_PARSE_MUXED,
        label: "Parse Muxed Account",
      },
    ],
  },
];

const ENDPOINTS_PAGES_INTRO: EndpointsPagesProps = {
  navItems: [
    {
      route: Routes.ENDPOINTS,
      label: "About API Explorer",
    },
  ],
  hasBottomDivider: false,
};
const ENDPOINTS_PAGES_SAVED: EndpointsPagesProps = {
  navItems: [
    {
      route: Routes.ENDPOINTS_SAVED,
      label: "Saved Requests",
      icon: <Icon.Save03 />,
    },
  ],
  hasBottomDivider: true,
};

export const ENDPOINTS_NAV_ITEMS = [
  ENDPOINTS_PAGES_SAVED,
  ENDPOINTS_PAGES_INTRO,
  ENDPOINTS_PAGES_RPC,
  ENDPOINTS_PAGES_HORIZON,
];

export const TRANSACTION_NAV_ITEMS = [
  {
    navItems: [
      {
        route: Routes.SAVED_TRANSACTIONS,
        label: "Saved Transactions",
        icon: <Icon.Save03 />,
      },
    ],
    hasBottomDivider: true,
  },
  {
    navItems: [
      {
        route: Routes.BUILD_TRANSACTION,
        label: "Build Transaction",
      },
      {
        route: Routes.SIGN_TRANSACTION,
        label: "Sign Transaction",
      },
      {
        route: Routes.SIMULATE_TRANSACTION,
        label: "Simulate Transaction",
      },
      {
        route: Routes.SUBMIT_TRANSACTION,
        label: "Submit Transaction",
      },
      {
        route: Routes.FEE_BUMP_TRANSACTION,
        label: "Fee Bump",
      },
    ],
  },
];

export const XDR_NAV_ITEMS = [
  {
    navItems: [
      {
        route: Routes.VIEW_XDR,
        label: "XDR to JSON",
      },
      {
        route: Routes.TO_XDR,
        label: "JSON to XDR",
      },
    ],
  },
];
