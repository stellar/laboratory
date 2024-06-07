import { SdsLink } from "@/components/SdsLink";
import {
  OPERATION_CLEAR_FLAGS,
  OPERATION_SET_FLAGS,
  OPERATION_TRUSTLINE_CLEAR_FLAGS,
  OPERATION_TRUSTLINE_SET_FLAGS,
} from "@/constants/settings";
import { AnyObject } from "@/types/types";

type TransactionOperation = {
  label: string;
  description: string;
  docsUrl: string;
  params: string[];
  requiredParams: string[];
  custom?: AnyObject;
};

export const TRANSACTION_OPERATIONS: { [key: string]: TransactionOperation } = {
  create_account: {
    label: "Create Account",
    description:
      "Creates and funds a new account with the specified starting balance.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#create-account",
    params: ["destination", "starting_balance"],
    requiredParams: ["destination", "starting_balance"],
  },
  payment: {
    label: "Payment",
    description:
      "Sends an amount in a specific asset to a destination account.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#payment",
    params: ["destination", "asset", "amount"],
    requiredParams: ["destination", "asset", "amount"],
  },
  path_payment_strict_send: {
    label: "Path Payment Strict Send",
    description:
      "Sends an amount in a specific asset to a destination account through a path of offers. This allows the asset sent (e.g., 450 XLM) to be different from the asset received (e.g, 6 BTC). A Path Payment Strict Send allows a user to specify the amount of the asset to send. The amount received will vary based on offers in the order books.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#path-payment-strict-send",
    params: [
      "destination",
      "send_asset",
      "send_amount",
      "path",
      "dest_asset",
      "dest_min",
    ],
    requiredParams: [
      "destination",
      "send_asset",
      "send_amount",
      "dest_asset",
      "dest_min",
    ],
    custom: {
      send_asset: {
        label: "Sending Asset",
        note: "The asset to be deduced from the sender's account.",
      },
      send_amount: {
        label: "Send Amount",
      },
      dest_asset: {
        label: "Destination Asset",
        note: "The asset to be received by the destination account.",
      },
      dest_min: {
        label: "Minimum Destination Amount",
        note: "The minimum amount the destination can receive.",
      },
    },
  },
  path_payment_strict_receive: {
    label: "Path Payment Strict Receive",
    description:
      "Sends an amount in a specific asset to a destination account through a path of offers. This allows the asset sent (e.g., 450 XLM) to be different from the asset received (e.g, 6 BTC). A Path Payment Strict Receive allows a user to specify the amount of the asset received. The amount sent varies based on offers in the order books.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#path-payment-strict-receive",
    params: [
      "destination",
      "send_asset",
      "send_max",
      "path",
      "dest_asset",
      "dest_amount",
    ],
    requiredParams: [
      "destination",
      "send_asset",
      "send_max",
      "dest_asset",
      "dest_amount",
    ],
    custom: {
      send_asset: {
        label: "Sending Asset",
        note: "The asset to be deduced from the sender's account.",
      },
      send_max: {
        label: "Maximum send amount",
      },
      dest_asset: {
        label: "Destination Asset",
        note: "The asset to be received by the destination account.",
      },
      dest_amount: {
        label: "Destination Amount",
      },
    },
  },
  manage_sell_offer: {
    label: "Manage Sell Offer",
    description: "Creates, updates, or deletes an offer.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#manage-sell-offer",
    params: ["selling", "buying", "amount", "price", "offer_id"],
    requiredParams: ["selling", "buying", "amount", "price", "offer_id"],
    custom: {
      amount: {
        label: "Amount you are selling",
        note: "An amount of zero will delete the offer.",
      },
      price: {
        label: "Price of 1 unit of selling in terms of buying",
      },
      offer_id: {
        note: "If 0, will create a new offer. Existing offer id numbers can be found using the Offers for Account endpoint.",
      },
    },
  },
  manage_buy_offer: {
    label: "Manage Buy Offer",
    description: "Creates, updates, or deletes an offer.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#manage-buy-offer",
    params: ["selling", "buying", "buy_amount", "price", "offer_id"],
    requiredParams: ["selling", "buying", "buy_amount", "price", "offer_id"],
    custom: {
      buy_amount: {
        label: "Amount you are buying",
        note: "An amount of zero will delete the offer.",
      },
      price: {
        label: "Price of 1 unit of buying in terms of selling",
      },
      offer_id: {
        note: "If 0, will create a new offer. Existing offer id numbers can be found using the Offers for Account endpoint.",
      },
    },
  },
  create_passive_sell_offer: {
    label: "Create Passive Sell Offer",
    description:
      "Creates an offer that does not take another offer of equal price when created.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#create-passive-sell-offer",
    params: ["selling", "buying", "amount", "price"],
    requiredParams: ["selling", "buying", "amount", "price"],
    custom: {
      amount: {
        label: "Amount you are selling",
        note: "An amount of zero will delete the offer.",
      },
      price: {
        label: "Price of 1 unit of selling in terms of buying",
      },
    },
  },
  set_options: {
    label: "Set Options",
    description: "Sets various configuration options for an account.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#set-options",
    params: [
      "inflation_dest",
      "set_flags",
      "clear_flags",
      "master_weight",
      "low_threshold",
      "med_threshold",
      "high_threshold",
      "signer",
      "home_domain",
    ],
    requiredParams: [],
    custom: {
      master_weight: {
        label: "Master Weight",
        infoLink:
          "https://developers.stellar.org/docs/encyclopedia/signatures-multisig#thresholds",
        note: (
          <SdsLink href="https://developers.stellar.org/docs/encyclopedia/signatures-multisig">
            See documentation for multisignature accounts
          </SdsLink>
        ),
        showWarning: true,
      },
      low_threshold: {
        label: "Low Threshold",
        infoLink:
          "https://developers.stellar.org/docs/encyclopedia/signatures-multisig#thresholds",
      },
      med_threshold: {
        label: "Medium Threshold",
        infoLink:
          "https://developers.stellar.org/docs/encyclopedia/signatures-multisig#thresholds",
        note: (
          <SdsLink href="https://developers.stellar.org/docs/encyclopedia/signatures-multisig">
            See documentation for multisignature accounts
          </SdsLink>
        ),
        showWarning: true,
      },
      high_threshold: {
        label: "High Threshold",
        infoLink:
          "https://developers.stellar.org/docs/encyclopedia/signatures-multisig#thresholds",
        note: (
          <SdsLink href="https://developers.stellar.org/docs/encyclopedia/signatures-multisig">
            See documentation for multisignature accounts
          </SdsLink>
        ),
        showWarning: true,
      },
      set_flags: {
        options: OPERATION_SET_FLAGS,
      },
      clear_flags: {
        options: OPERATION_CLEAR_FLAGS,
      },
    },
  },
  change_trust: {
    label: "Change Trust",
    description: "Creates, updates, or deletes a trustline.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#change-trust",
    params: ["line", "limit"],
    requiredParams: ["line"],
    custom: {
      limit: {
        note: "Leave empty to default to the max int64.",
        // Use "note_add" to show another note below "note"
        note_add: "Set to 0 to remove the trust line.",
      },
    },
  },
  allow_trust: {
    label: "Allow Trust",
    description: "Updates the authorized flag of an existing trustline.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#allow-trust",
    params: ["trustor", "assetCode", "authorize"],
    requiredParams: ["trustor", "assetCode", "authorize"],
  },
  account_merge: {
    label: "Account Merge",
    description:
      "Transfers the native balance (the amount of XLM an account holds) to another account and removes the source account from the ledger.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#account-merge",
    params: ["destination"],
    requiredParams: ["destination"],
  },
  manage_data: {
    label: "Manage Data",
    description: "Sets, modifies, or deletes a Data Entry (name/value pair).",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#manage-data",
    params: ["data_name", "data_value"],
    requiredParams: ["data_name"],
    custom: {
      data_value: {
        note: "If empty, will delete the data entry named in this operation.",
        // Use "note_add" to show another note below "note"
        note_add: "Note: The laboratory only supports strings.",
      },
    },
  },
  bump_sequence: {
    label: "Bump Sequence",
    description: "Bumps sequence number.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#bump-sequence",
    params: ["bump_to"],
    requiredParams: ["bump_to"],
  },
  create_claimable_balance: {
    label: "Create Claimable Balance",
    description: "Creates a new claimable balance.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#create-claimable-balance",
    params: ["asset", "amount", "claimants"],
    requiredParams: ["asset", "amount", "claimants"],
  },
  claim_claimable_balance: {
    label: "Claim Claimable Balance",
    description: "Claims a claimable balance.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#claim-claimable-balance",
    params: ["balance_id"],
    requiredParams: ["balance_id"],
  },
  begin_sponsoring_future_reserves: {
    label: "Begin Sponsoring Future Reserves",
    description:
      "Initiate a sponsorship. There must be a corresponding End Sponsoring Future Reserves operation in the same transaction.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#begin-sponsoring-future-reserves",
    params: ["sponsored_id"],
    requiredParams: ["sponsored_id"],
  },
  end_sponsoring_future_reserves: {
    label: "End Sponsoring Future Reserves",
    description: "End a sponsorship.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#end-sponsoring-future-reserves",
    params: [],
    requiredParams: [],
  },
  clawback: {
    label: "Clawback",
    description: "Creates a clawback operation.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#clawback",
    params: ["asset", "from", "amount"],
    requiredParams: ["asset", "from", "amount"],
    custom: {
      asset: {
        includeNative: false,
      },
    },
  },
  revoke_sponsorship: {
    label: "Revoke Sponsorship",
    description: "Revoke sponsorship of a ledger entry.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#revoke-sponsorship",
    params: ["revokeSponsorship"],
    requiredParams: ["revokeSponsorship"],
  },
  clawback_claimable_balance: {
    label: "Clawback Claimable Balance",
    description: "Creates a clawback operation for a claimable balance.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#clawback-claimable-balance",
    params: ["balance_id"],
    requiredParams: ["balance_id"],
  },
  set_trust_line_flags: {
    label: "Set Trust Line Flags",
    description: "Creates a trustline flag configuring operation.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#set-trustline-flags",
    params: ["asset", "trustor", "set_flags", "clear_flags"],
    requiredParams: ["asset", "trustor"],
    custom: {
      asset: {
        includeNative: false,
      },
      set_flags: {
        options: OPERATION_TRUSTLINE_SET_FLAGS,
      },
      clear_flags: {
        options: OPERATION_TRUSTLINE_CLEAR_FLAGS,
      },
    },
  },
  liquidity_pool_deposit: {
    label: "Liquidity Pool Deposit",
    description: "Deposits assets into a liquidity pool.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#liquidity-pool-deposit",
    params: [
      "liquidity_pool_id",
      "max_amount_a",
      "max_amount_b",
      "min_price",
      "max_price",
    ],
    requiredParams: [
      "liquidity_pool_id",
      "max_amount_a",
      "max_amount_b",
      "min_price",
      "max_price",
    ],
    custom: {
      max_amount_a: {
        label: "Max Amount A",
      },
      max_amount_b: {
        label: "Max Amount B",
      },
      min_price: {
        label: "Min Price",
        note: "Minimum depositA/depositB price.",
      },
      max_price: {
        label: "Max Price",
        note: "Maximum depositA/depositB price.",
      },
    },
  },
  liquidity_pool_withdraw: {
    label: "Liquidity Pool Withdraw",
    description: "Withdraw assets from a liquidity pool.",
    docsUrl:
      "https://developers.stellar.org/docs/learn/fundamentals/list-of-operations#liquidity-pool-withdraw",
    params: ["liquidity_pool_id", "amount", "min_amount_a", "min_amount_b"],
    requiredParams: [
      "liquidity_pool_id",
      "amount",
      "min_amount_a",
      "min_amount_b",
    ],
    custom: {
      min_amount_a: {
        label: "Min Amount A",
      },
      min_amount_b: {
        label: "Min Amount B",
      },
    },
  },
};
