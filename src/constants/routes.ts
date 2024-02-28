export enum Routes {
  ROOT = "/",
  // Account
  CREATE_ACCOUNT = "/account/create",
  FUND_ACCOUNT = "/account/fund",
  CREATE_MUXED_ACCOUNT = "/account/muxed-create",
  PARSE_MUXED_ACCOUNT = "/account/muxed-parse",
  // Explore Endpoints
  EXPLORE_ENDPOINTS = "/explore-endpoints",
  // Transactions
  BUILD_TRANSACTION = "/transaction/build",
  SIGN_TRANSACTION = "/transaction/sign",
  SIMULATE_TRANSACTION = "/transaction/simulate",
  SUBMIT_TRANSACTION = "/transaction/submit",
  FEE_BUMP_TRANSACTION = "/transaction/fee-bump",
  // View XDR
  VIEW_XDR = "/xdr/view",
  TO_XDR = "/xdr/to",
  // Soroban
  SOROBAN_CONTRACT_EXPLORER = "/soroban/contract-explorer",
}
