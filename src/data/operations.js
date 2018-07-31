import _ from 'lodash';

export function getOperation(opName) {
  return _.find(operationsMap, { name: opName });
}

// Operations map documentation:
// [ // In an array because we really want this to be ordered correctly (whereas for params, it is not as important)
//   {
//     name: 'createAccount', // Corresponds to the operation key in js-stellar-sdk.Operation
//     label: 'Create Account', // Human friendly name for the operation
//     operationPane: require('../components/OperationPanes/CreateAccount'), // React component that contains the multiple pickers for this operation
//   },
// ]

export const operationsMap = [
  {
    name: 'createAccount',
    label: 'Create Account',
    operationPane: require('../components/OperationPanes/CreateAccount'),
    helpNote: 'Creates and funds a new account with the specified starting balance.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#create-account',
  },
  {
    name: 'payment',
    label: 'Payment',
    operationPane: require('../components/OperationPanes/Payment'),
    helpNote: 'Sends an amount in a specific asset to a destination account.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#payment',
  },
  {
    name: 'pathPayment',
    label: 'Path Payment',
    operationPane: require('../components/OperationPanes/PathPayment'),
    helpNote: 'Sends an amount in a specific asset to a destination account through a path of offers. This allows the asset sent (e.g., 450 XLM) to be different from the asset received (e.g, 6 BTC).',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#path-payment',
  },
  {
    name: 'manageOffer',
    label: 'Manage Offer',
    operationPane: require('../components/OperationPanes/ManageOffer'),
    helpNote: 'Creates, updates, or deletes an offer.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#manage-offer',
  },
  {
    name: 'createPassiveOffer',
    label: 'Create Passive Offer',
    operationPane: require('../components/OperationPanes/GenericOffer'),
    helpNote: 'Creates an offer that does not take another offer of equal price when created.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#create-passive-offer',
  },
  {
    name: 'setOptions',
    label: 'Set Options',
    operationPane: require('../components/OperationPanes/SetOptions'),
    helpNote: 'Sets various configuration options for an account.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#set-options',
  },
  {
    name: 'changeTrust',
    label: 'Change Trust',
    operationPane: require('../components/OperationPanes/ChangeTrust'),
    helpNote: 'Creates, updates, or deletes a trustline.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#change-trust',
  },
  {
    name: 'allowTrust',
    label: 'Allow Trust',
    operationPane: require('../components/OperationPanes/AllowTrust'),
    helpNote: 'Updates the authorized flag of an existing trustline.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#allow-trust',
  },
  {
    name: 'accountMerge',
    label: 'Account Merge',
    operationPane: require('../components/OperationPanes/AccountMerge'),
    helpNote: 'Transfers the native balance (the amount of XLM an account holds) to another account and removes the source account from the ledger.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#account-merge',
  },
  {
    name: 'inflation',
    label: 'Inflation',
    operationPane: () => [], // empty operation pane
    helpNote: 'Runs the weekly inflation',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#inflation',
  },
  {
    name: 'manageData',
    label: 'Manage Data',
    operationPane: require('../components/OperationPanes/ManageData'),
    helpNote: 'Sets, modifies, or deletes a Data Entry (name/value pair).',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#manage-data',
  },
  {
    name: 'bumpSequence',
    label: 'Bump Sequence',
    operationPane: require('../components/OperationPanes/BumpSequence'),
    helpNote: 'Bumps sequence number.',
    docsUrl: 'https://www.stellar.org/developers/guides/concepts/list-of-operations.html#bump-sequence',
  },
]
