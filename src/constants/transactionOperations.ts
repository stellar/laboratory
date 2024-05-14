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
};
