import find from "lodash/find";
import AccountMerge from "../components/OperationPanes/AccountMerge";
import AllowTrust from "../components/OperationPanes/AllowTrust";
import BeginSponsoringFutureReserves from "../components/OperationPanes/BeginSponsoringFutureReserves";
import BumpSequence from "../components/OperationPanes/BumpSequence";
import ChangeTrust from "../components/OperationPanes/ChangeTrust";
import ClaimClaimableBalance from "../components/OperationPanes/ClaimClaimableBalance";
import Clawback from "../components/OperationPanes/Clawback";
import ClawbackClaimableBalance from "../components/OperationPanes/ClawbackClaimableBalance";
import CreateAccount from "../components/OperationPanes/CreateAccount";
import CreateClaimableBalance from "../components/OperationPanes/CreateClaimableBalance";
import EndSponsoringFutureReserves from "../components/OperationPanes/EndSponsoringFutureReserves";
import GenericOffer from "../components/OperationPanes/GenericOffer";
import { LiquidityPoolDeposit } from "../components/OperationPanes/LiquidityPoolDeposit";
import { LiquidityPoolWithdraw } from "../components/OperationPanes/LiquidityPoolWithdraw";
import ManageBuyOffer from "../components/OperationPanes/ManageBuyOffer";
import ManageData from "../components/OperationPanes/ManageData";
import ManageSellOffer from "../components/OperationPanes/ManageSellOffer";
import PathPaymentStrictReceive from "../components/OperationPanes/PathPaymentStrictReceive";
import PathPaymentStrictSend from "../components/OperationPanes/PathPaymentStrictSend";
import Payment from "../components/OperationPanes/Payment";
import RevokeSponsorship from "../components/OperationPanes/RevokeSponsorship";
import SetOptions from "../components/OperationPanes/SetOptions";
import SetTrustLineFlags from "../components/OperationPanes/SetTrustLineFlags";

export function getOperation(opName) {
  return find(operationsMap, { name: opName });
}

// Operations map documentation:
// [ // In an array because we really want this to be ordered correctly (whereas for params, it is not as important)
//   {
//     name: 'createAccount', // Corresponds to the operation key in js-stellar-sdk.Operation
//     label: 'Create Account', // Human friendly name for the operation
//     operationPane: require('../components/OperationPanes/CreateAccount'), // React component that contains the multiple pickers for this operation
//     helpNote: "" // Operation description or note
//     docsUrl: "" // Link to docs
//   },
// ]

export const operationsMap = [
  {
    name: "createAccount",
    label: "Create Account",
    operationPane: CreateAccount,
    helpNote:
      "Creates and funds a new account with the specified starting balance.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#create-account",
  },
  {
    name: "payment",
    label: "Payment",
    operationPane: Payment,
    helpNote: "Sends an amount in a specific asset to a destination account.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#payment",
  },
  {
    name: "pathPaymentStrictSend",
    label: "Path Payment Strict Send",
    operationPane: PathPaymentStrictSend,
    helpNote:
      "Sends an amount in a specific asset to a destination account through a path of offers. This allows the asset sent (e.g., 450 XLM) to be different from the asset received (e.g, 6 BTC). A Path Payment Strict Send allows a user to specify the amount of the asset to send. The amount received will vary based on offers in the order books",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#path-payment-strict-send",
  },
  {
    name: "pathPaymentStrictReceive",
    label: "Path Payment Strict Receive",
    operationPane: PathPaymentStrictReceive,
    helpNote:
      "Sends an amount in a specific asset to a destination account through a path of offers. This allows the asset sent (e.g., 450 XLM) to be different from the asset received (e.g, 6 BTC). A Path Payment Strict Receive allows a user to specify the amount of the asset received. The amount sent varies based on offers in the order books.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#path-payment-strict-receive",
  },
  {
    name: "manageSellOffer",
    label: "Manage Sell Offer",
    operationPane: ManageSellOffer,
    helpNote: "Creates, updates, or deletes an offer.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#manage-buy-offer",
  },
  {
    name: "manageBuyOffer",
    label: "Manage Buy Offer",
    operationPane: ManageBuyOffer,
    helpNote: "Creates, updates, or deletes an offer.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#manage-sell-offer",
  },
  {
    name: "createPassiveSellOffer",
    label: "Create Passive Sell Offer",
    operationPane: GenericOffer,
    helpNote:
      "Creates an offer that does not take another offer of equal price when created.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#create-passive-offer",
  },
  {
    name: "setOptions",
    label: "Set Options",
    operationPane: SetOptions,
    helpNote: "Sets various configuration options for an account.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#set-options",
  },
  {
    name: "changeTrust",
    label: "Change Trust",
    operationPane: ChangeTrust,
    helpNote: "Creates, updates, or deletes a trustline.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#change-trust",
  },
  {
    name: "allowTrust",
    label: "Allow Trust",
    operationPane: AllowTrust,
    helpNote: "Updates the authorized flag of an existing trustline.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#allow-trust",
  },
  {
    name: "accountMerge",
    label: "Account Merge",
    operationPane: AccountMerge,
    helpNote:
      "Transfers the native balance (the amount of XLM an account holds) to another account and removes the source account from the ledger.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#account-merge",
  },
  {
    name: "manageData",
    label: "Manage Data",
    operationPane: ManageData,
    helpNote: "Sets, modifies, or deletes a Data Entry (name/value pair).",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#manage-data",
  },
  {
    name: "bumpSequence",
    label: "Bump Sequence",
    operationPane: BumpSequence,
    helpNote: "Bumps sequence number.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#bump-sequence",
  },
  {
    name: "createClaimableBalance",
    label: "Create Claimable Balance",
    operationPane: CreateClaimableBalance,
    helpNote: "Creates a new claimable balance.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#create-claimable-balance",
  },
  {
    name: "claimClaimableBalance",
    label: "Claim Claimable Balance",
    operationPane: ClaimClaimableBalance,
    helpNote: "Claims a claimable balance.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#claim-claimable-balance",
  },
  {
    name: "beginSponsoringFutureReserves",
    label: "Begin Sponsoring Future Reserves",
    operationPane: BeginSponsoringFutureReserves,
    helpNote:
      "Initiate a sponsorship. There must be a corresponding End Sponsoring Future Reserves operation in the same transaction.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#begin-sponsoring-future-reserves",
  },
  {
    name: "endSponsoringFutureReserves",
    label: "End Sponsoring Future Reserves",
    operationPane: EndSponsoringFutureReserves,
    helpNote: "End a sponsorship.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#end-sponsoring-future-reserves",
  },
  {
    name: "revokeSponsorship",
    label: "Revoke Sponsorship",
    operationPane: RevokeSponsorship,
    helpNote: "Revoke sponsorship of a ledger entry.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#revoke-sponsorship",
  },
  {
    name: "clawback",
    label: "Clawback",
    operationPane: Clawback,
    helpNote: "Creates a clawback operation.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#clawback",
  },
  {
    name: "clawbackClaimableBalance",
    label: "Clawback Claimable Balance",
    operationPane: ClawbackClaimableBalance,
    helpNote: "Creates a clawback operation for a claimable balance.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#clawback-claimable-balance",
  },
  {
    name: "setTrustLineFlags",
    label: "Set Trust Line Flags",
    operationPane: SetTrustLineFlags,
    helpNote: "Creates a trustline flag configuring operation.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#set-trustline-flags",
  },
  {
    name: "liquidityPoolDeposit",
    label: "Liquidity Pool Deposit",
    operationPane: LiquidityPoolDeposit,
    helpNote: "Deposits assets into a liquidity pool.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#liquidity-pool-deposit",
  },
  {
    name: "liquidityPoolWithdraw",
    label: "Liquidity Pool Withdraw",
    operationPane: LiquidityPoolWithdraw,
    helpNote: "Withdraw assets from a liquidity pool.",
    docsUrl:
      "https://developers.stellar.org/docs/start/list-of-operations/#liquidity-pool-withdraw",
  },
];
