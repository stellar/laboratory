import React from "react";
import { Icon } from "@stellar/design-system";
import { Routes } from "@/constants/routes";
import {
  ENDPOINTS_PAGES_HORIZON,
  ENDPOINTS_PAGES_RPC,
  EndpointsPagesProps,
} from "@/constants/endpointsPages";

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

export type NavItem = {
  label: string;
  route: Routes;
  subNav?: NavItem[];
  icon?: React.ReactNode;
};

const ACCOUNT_NAV = [
  {
    route: Routes.ACCOUNT_CREATE,
    label: "Create account keypair",
  },
  {
    route: Routes.ACCOUNT_FUND,
    label: "Fund account",
  },
  {
    route: Routes.ACCOUNT_CREATE_MUXED,
    label: "Create muxed account",
  },
  {
    route: Routes.ACCOUNT_PARSE_MUXED,
    label: "Parse muxed account",
  },
];

const ENDPOINTS_NAV = [
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
    route: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
    label: "Contract explorer",
  },
  {
    route: Routes.SMART_CONTRACTS_CONTRACT_LIST,
    label: "Smart contract list",
  },
  {
    route: Routes.SMART_CONTRACTS_DEPLOY_CONTRACT,
    label: "Upload and deploy contract",
  },
];

const TRANSACTION_NAV = [
  {
    route: Routes.BUILD_TRANSACTION,
    label: "Build transaction",
  },
  {
    route: Routes.SIGN_TRANSACTION,
    label: "Sign transaction",
  },
  {
    route: Routes.SIMULATE_TRANSACTION,
    label: "Simulate transaction",
  },
  {
    route: Routes.SUBMIT_TRANSACTION,
    label: "Submit transaction",
  },
  {
    route: Routes.FEE_BUMP_TRANSACTION,
    label: "Fee bump",
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
  {
    route: Routes.DIFF_XDR,
    label: "Diff XDRs",
  },
];

export const NAV: NavItem[] = [
  {
    route: Routes.SAVED,
    label: "Saved",
    icon: <Icon.Save03 />,
    subNav: [
      {
        route: Routes.SAVED_KEYPAIRS,
        label: "Keypairs",
      },
      {
        route: Routes.SAVED_ENDPOINTS,
        label: "Requests",
      },
      {
        route: Routes.SAVED_TRANSACTIONS,
        label: "Transactions",
      },
      {
        route: Routes.SAVED_SMART_CONTRACTS,
        label: "Smart Contracts",
      },
    ],
  },
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
  ...(process.env.NEXT_PUBLIC_ENABLE_EXPLORER === "true" &&
  process.env.NODE_ENV === "production"
    ? []
    : [
        {
          route: Routes.SMART_CONTRACTS,
          label: "Smart Contracts",
          subNav: SMART_CONTRACTS_NAV,
        },
      ]),
  {
    route: Routes.TRANSACTION_DASHBOARD,
    label: "Transaction dashboard",
  },
  ...(process.env.NEXT_PUBLIC_ENABLE_EXPLORER === "true"
    ? [
        {
          route: Routes.TRANSACTIONS_EXPLORER,
          label: "Transactions explorer",
        },
      ]
    : []),
  {
    route: Routes.NETWORK_LIMITS,
    label: "Network limits",
  },
];
