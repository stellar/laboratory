/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: "build",
  basePath: process.env.NEXT_BASE_PATH || undefined,
  // Adding client side redirects to support old URLs in case they were saved or
  // bookmarked.
  async redirects() {
    return [
      {
        source: "/endpoints/accounts",
        destination: "/endpoints/horizon/accounts",
        permanent: true,
      },
      {
        source: "/endpoints/accounts/single",
        destination: "/endpoints/horizon/accounts/single",
        permanent: true,
      },
      {
        source: "/endpoints/assets",
        destination: "/endpoints/horizon/assets",
        permanent: true,
      },
      {
        source: "/endpoints/claimable-balances",
        destination: "/endpoints/horizon/claimable-balances",
        permanent: true,
      },
      {
        source: "/endpoints/claimable-balances/single",
        destination: "/endpoints/horizon/claimable-balances/single",
        permanent: true,
      },
      {
        source: "/endpoints/effects",
        destination: "/endpoints/horizon/effects",
        permanent: true,
      },
      {
        source: "/endpoints/effects/account",
        destination: "/endpoints/horizon/effects/account",
        permanent: true,
      },
      {
        source: "/endpoints/effects/ledger",
        destination: "/endpoints/horizon/effects/ledger",
        permanent: true,
      },
      {
        source: "/endpoints/effects/liquidity-pool",
        destination: "/endpoints/horizon/effects/liquidity-pool",
        permanent: true,
      },
      {
        source: "/endpoints/effects/operation",
        destination: "/endpoints/horizon/effects/operation",
        permanent: true,
      },
      {
        source: "/endpoints/effects/transaction",
        destination: "/endpoints/horizon/effects/transaction",
        permanent: true,
      },
      {
        source: "/endpoints/fee-stats",
        destination: "/endpoints/horizon/fee-stats",
        permanent: true,
      },
      {
        source: "/endpoints/ledgers",
        destination: "/endpoints/horizon/ledgers", 
        permanent: true,
      },
      {
        source: "/endpoints/ledgers/single",
        destination: "/endpoints/horizon/ledgers/single", 
        permanent: true,
      },
      {
        source: "/endpoints/liquidity-pools",
        destination: "/endpoints/horizon/liquidity-pools",
        permanent: true,
      },
      {
        source: "/endpoints/liquidity-pools/single",
        destination: "/endpoints/horizon/liquidity-pools/single",
        permanent: true,
      },
      {
        source: "/endpoints/offers",
        destination: "/endpoints/horizon/offers",
        permanent: true,
      },
      {
        source: "/endpoints/offers/single",
        destination: "/endpoints/horizon/offers/single",
        permanent: true,
      },
      {
        source: "/endpoints/offers/account",
        destination: "/endpoints/horizon/offers/account",
        permanent: true,
      },
      {
        source: "/endpoints/operations",
        destination: "/endpoints/horizon/operations",
        permanent: true,
      },
      {
        source: "/endpoints/operations/single",
        destination: "/endpoints/horizon/operations/single",
        permanent: true,
      },
      {
        source: "/endpoints/operations/account",
        destination: "/endpoints/horizon/operations/account",
        permanent: true,
      },
      {
        source: "/endpoints/operations/ledger",
        destination: "/endpoints/horizon/operations/ledger",
        permanent: true,
      },
      {
        source: "/endpoints/operations/liquidity-pool",
        destination: "/endpoints/horizon/operations/liquidity-pool",
        permanent: true,
      },
      {
        source: "/endpoints/operations/transaction",
        destination: "/endpoints/horizon/operations/transaction",
        permanent: true,
      },
      {
        source: "/endpoints/order-book",
        destination: "/endpoints/horizon/order-book",
        permanent: true,
      },
      {
        source: "/endpoints/order-book/details",
        destination: "/endpoints/horizon/order-book/details",
        permanent: true,
      },
      {
        source: "/endpoints/paths",
        destination: "/endpoints/horizon/paths",
        permanent: true,
      },
      {
        source: "/endpoints/paths/strict-receive",
        destination: "/endpoints/horizon/paths/strict-receive",
        permanent: true,
      },
      {
        source: "/endpoints/paths/strict-send",
        destination: "/endpoints/horizon/paths/strict-send",
        permanent: true,
      },
      {
        source: "/endpoints/payments",
        destination: "/endpoints/horizon/payments",
        permanent: true,
      },
      {
        source: "/endpoints/payments/account",
        destination: "/endpoints/horizon/payments/account",
        permanent: true,
      },
      {
        source: "/endpoints/payments/ledger",
        destination: "/endpoints/horizon/payments/ledger",
        permanent: true,
      },
      {
        source: "/endpoints/payments/transaction",
        destination: "/endpoints/horizon/payments/transaction",
        permanent: true,
      },
      {
        source: "/endpoints/trade-aggregations",
        destination: "/endpoints/horizon/trade-aggregations",
        permanent: true,
      },
      {
        source: "/endpoints/trades",
        destination: "/endpoints/horizon/trades",
        permanent: true,
      },
      {
        source: "/endpoints/trades/account",
        destination: "/endpoints/horizon/trades/account",
        permanent: true,
      },
      {
        source: "/endpoints/trades/liquidity-pool",
        destination: "/endpoints/horizon/trades/liquidity-pool",
        permanent: true,
      },
      {
        source: "/endpoints/trades/offer",
        destination: "/endpoints/horizon/trades/offer",
        permanent: true,
      },
      {
        source: "/endpoints/transactions",
        destination: "/endpoints/horizon/transactions",
        permanent: true,
      },
      {
        source: "/endpoints/transactions/single",
        destination: "/endpoints/horizon/transactions/single",
        permanent: true,
      },
      {
        source: "/endpoints/transactions/post",
        destination: "/endpoints/horizon/transactions/post",
        permanent: true,
      },
      {
        source: "/endpoints/transactions/post-async",
        destination: "/endpoints/horizon/transactions/post-async",
        permanent: true,
      },
      {
        source: "/endpoints/transactions/account",
        destination: "/endpoints/horizon/transactions/account",
        permanent: true,
      },
      {
        source: "/endpoints/transactions/ledger",
        destination: "/endpoints/horizon/transactions/ledger",
        permanent: true,
      },
      {
        source: "/endpoints/transactions/liquidity-pool",
        destination: "/endpoints/horizon/transactions/liquidity-pool",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
