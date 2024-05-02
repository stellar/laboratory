type TransactionOperation = {
  label: string;
  description: string;
  docsUrl: string;
  params: string[];
  requiredParams: string[];
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
};
