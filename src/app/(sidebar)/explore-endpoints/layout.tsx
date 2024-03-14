"use client";

import React from "react";
import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { Routes } from "@/constants/routes";

export default function ExploreEndpointsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // TODO: add saved endpoints
    // TODO: add RPC endpoints
    <LayoutSidebarContent sidebar={[horizon_endpoints]}>
      {children}
    </LayoutSidebarContent>
  );
}

const horizon_endpoints = {
  instruction: "Horizon Endpoints",
  navItems: [
    {
      route: Routes.EXPLORE_ENDPOINTS_ACCOUNTS,
      label: "Accounts",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_ACCOUNTS,
          label: "All Accounts",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_ACCOUNTS_SINGLE,
          label: "Single Account",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_ASSETS,
      label: "Assets",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_ASSETS,
          label: "All Assets",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_CLAIMABLE_BALANCES,
      label: "Claimable Balances",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_CLAIMABLE_BALANCES,
          label: "All Claimable Balances",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_CLAIMABLE_BALANCES_SINGLE,
          label: "Single Claimable Balance",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_EFFECTS,
      label: "Effects",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS,
          label: "All Effects",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_ACCOUNT,
          label: "Effects for Account",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_LEDGER,
          label: "Effects for Ledger",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_LIQUIDITY_POOL,
          label: "Effects for Liquidity Pool",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_OPERATION,
          label: "Effects for Operation",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_TRANSACTION,
          label: "Effects for Transaction",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_FEE_STATS,
      label: "Fee Stats",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_FEE_STATS,
          label: "All Fee Stats",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_LEDGERS,
      label: "Ledgers",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_LEDGERS,
          label: "All Ledgers",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_LEDGERS_SINGLE,
          label: "Single Ledger",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_LIQUIDITY_POOLS,
      label: "Liquidity Pools",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_LIQUIDITY_POOLS,
          label: "All Liquidity Pools",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_LIQUIDITY_POOLS_SINGLE,
          label: "Single Liquidity Pool",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_OFFERS,
      label: "Offers",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_OFFERS,
          label: "All Offers",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OFFERS_SINGLE,
          label: "Single Offer",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OFFERS_ACCOUNT,
          label: "Offers for Account",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_OPERATIONS,
      label: "Operations",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS,
          label: "All Operations",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_SINGLE,
          label: "Single Operation",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_ACCOUNT,
          label: "Operations for Account",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_LEDGER,
          label: "Operations for Ledger",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_LIQUIDITY_POOL,
          label: "Operations for Liquidity Pool",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_TRANSACTION,
          label: "Operations for Transaction",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_ORDER_BOOK_DETAILS,
      label: "Order Book",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_ORDER_BOOK_DETAILS,
          label: "Details",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_PATHS_PAYMENT,
      label: "Paths",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_PATHS_PAYMENT,
          label: "Find Payment Paths",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PATHS_STRICT_RECEIVE,
          label: "Find Strict Receive Payment Paths",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PATHS_STRICT_SEND,
          label: "Find Strict Send Payment Paths",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_PAYMENTS,
      label: "Payments",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS,
          label: "All Payments",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_ACCOUNT,
          label: "Payments for Account",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_LEDGER,
          label: "Payments for Ledger",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_TRANSACTION,
          label: "Payments for Transaction",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_TRADE_AGGREGATIONS,
      label: "Trade Aggregations",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADE_AGGREGATIONS,
          label: "All Trade Aggregations",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_TRADES,
      label: "Trades",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES,
          label: "All Trades",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES_ACCOUNT,
          label: "Trades for Account",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES_LIQUIDITY_POOL,
          label: "Trades for Liquidity Pool",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES_OFFER,
          label: "Trades for Offer",
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS,
      label: "Transactions",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS,
          label: "All Transactions",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_SINGLE,
          label: "Single Transaction",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_POST,
          label: "Post Transaction",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_ACCOUNT,
          label: "Transactions for Account",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_LEDGER,
          label: "Transactions for Ledger",
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_LIQUIDITY_POOL,
          label: "Transactions for Liquidity Pool",
        },
      ],
    },
  ],
};
