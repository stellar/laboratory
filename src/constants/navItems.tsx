import React from "react";
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
        route: Routes.SAVED_KEYPAIRS,
        label: "Saved Keypairs",
        icon: <Icon.Save03 />,
      },
    ],
    hasBottomDivider: true,
  },
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

export const SMART_CONTRACTS_NAV_ITEMS = [
  {
    navItems: [
      {
        route: Routes.SMART_CONTRACTS_SAVED,
        label: "Saved Smart Contract IDs",
        icon: <Icon.Save03 />,
      },
    ],
    hasBottomDivider: true,
  },
  {
    instruction: "Smart Contract Tools",
    navItems: [
      {
        route: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
        label: "Contract Explorer",
      },
      {
        route: Routes.SMART_CONTRACTS_CONTRACT_LIST,
        label: "Smart Contract List",
      },
    ],
  },
];

// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// NEW

const processNestedItems = (items: any[]): NavItem[] => {
  return items.map((item) => {
    const processed: NavItem = {
      label: item.label,
      route: item.route,
      ...(item.icon ? { icon: item.icon } : {}),
    };

    if (item.nestedItems?.length) {
      processed.subNav = processNestedItems(item.nestedItems);
    }

    return processed;
  });
};

const getEndpointsNav = (endpointsPages: EndpointsPagesProps) => {
  return endpointsPages.navItems.reduce((res: NavItem[], cur) => {
    const item: NavItem = {
      label: cur.label,
      route: cur.route,
      ...(cur.icon ? { icon: cur.icon } : {}),
    };

    if (cur.nestedItems?.length) {
      item.subNav = processNestedItems(cur.nestedItems);
    }

    return [...res, item];
  }, []);
};

export const MOBILE_NAV = [
  {
    label: "View XDR",
    subNav: XDR_NAV_ITEMS,
  },
  {
    label: "Account",
    subNav: ACCOUNT_NAV_ITEMS,
  },
  {
    label: "Transactions",
    subNav: TRANSACTION_NAV_ITEMS,
  },
  {
    label: "API Explorer",
    subNav: ENDPOINTS_NAV_ITEMS,
  },
  {
    label: "Smart Contracts",
    subNav: SMART_CONTRACTS_NAV_ITEMS,
  },
];

export type NavItem = {
  label: string;
  route: Routes;
  subNav?: NavItem[];
  icon?: React.ReactNode;
};

const ACCOUNT_NAV = [
  {
    route: Routes.SAVED_KEYPAIRS,
    label: "Saved Keypairs",
    icon: <Icon.Save03 />,
  },
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
];

const ENDPOINTS_NAV = [
  {
    route: Routes.ENDPOINTS_SAVED,
    label: "Saved Requests",
    icon: <Icon.Save03 />,
  },
  {
    route: Routes.ENDPOINTS,
    label: "About API Explorer",
  },
  {
    route: Routes.ENDPOINTS_RPC,
    label: "RPC Methods",
    subNav: getEndpointsNav(ENDPOINTS_PAGES_RPC),
  },
  {
    route: Routes.ENDPOINTS_HORIZON,
    label: "Horizon Endpoints",
    subNav: getEndpointsNav(ENDPOINTS_PAGES_HORIZON),
  },
];

const SMART_CONTRACTS_NAV = [
  {
    route: Routes.SMART_CONTRACTS_SAVED,
    label: "Saved Smart Contract IDs",
    icon: <Icon.Save03 />,
  },
  {
    route: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
    label: "Contract Explorer",
  },
  {
    route: Routes.SMART_CONTRACTS_CONTRACT_LIST,
    label: "Smart Contract List",
  },
];

const TRANSACTION_NAV = [
  {
    route: Routes.SAVED_TRANSACTIONS,
    label: "Saved Transactions",
    icon: <Icon.Save03 />,
  },
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
];

const XDR_NAV = [
  {
    route: Routes.VIEW_XDR,
    label: "XDR to JSON",
  },
  {
    route: Routes.TO_XDR,
    label: "JSON to XDR",
  },
];

export const NAV: NavItem[] = [
  {
    route: Routes.ROOT,
    label: "Introduction",
  },
  {
    route: Routes.XDR,
    label: "View XDR",
    subNav: XDR_NAV,
  },
  {
    route: Routes.ACCOUNT,
    label: "Account",
    subNav: ACCOUNT_NAV,
  },
  {
    route: Routes.TRANSACTION,
    label: "Transactions",
    subNav: TRANSACTION_NAV,
  },
  {
    route: Routes.ENDPOINTS,
    label: "API Explorer",
    subNav: ENDPOINTS_NAV,
  },
  {
    route: Routes.SMART_CONTRACTS,
    label: "Smart Contracts",
    subNav: SMART_CONTRACTS_NAV,
  },
  ...(process.env.NEXT_PUBLIC_ENABLE_EXPLORER === "true"
    ? [
        {
          route: Routes.BLOCKCHAIN_EXPLORER,
          label: "Blockchain Explorer",
        },
      ]
    : []),
];
