import _ from 'lodash';
import AccountMerge from '../components/OperationPanes/AccountMerge'
import AllowTrust from '../components/OperationPanes/AllowTrust'
import BumpSequence from '../components/OperationPanes/BumpSequence'
import ChangeTrust from '../components/OperationPanes/ChangeTrust'
import CreateAccount from '../components/OperationPanes/CreateAccount'
import GenericOffer from '../components/OperationPanes/GenericOffer'
import ManageBuyOffer from '../components/OperationPanes/ManageBuyOffer'
import ManageData from '../components/OperationPanes/ManageData'
import ManageSellOffer from '../components/OperationPanes/ManageSellOffer'
import PathPaymentStrictReceive from '../components/OperationPanes/PathPaymentStrictReceive'
import PathPaymentStrictSend from '../components/OperationPanes/PathPaymentStrictSend'
import Payment from '../components/OperationPanes/Payment'
import SetOptions from '../components/OperationPanes/SetOptions'

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
    operationPane: CreateAccount,
    helpNote: 'Creates and funds a new account with the specified starting balance.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#create-account',
  },
  {
    name: 'payment',
    label: 'Payment',
    operationPane: Payment,
    helpNote: 'Sends an amount in a specific asset to a destination account.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#payment',
  },
  {
    name: 'pathPaymentStrictSend',
    label: 'Path Payment Strict Send',
    operationPane: PathPaymentStrictSend,
    helpNote: 'Sends an amount in a specific asset to a destination account through a path of offers. This allows the asset sent (e.g., 450 XLM) to be different from the asset received (e.g, 6 BTC). A Path Payment Strict Send allows a user to specify the amount of the asset to send. The amount received will vary based on offers in the order books',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#path-payment-strict-send',
  },
  {
    name: 'pathPaymentStrictReceive',
    label: 'Path Payment Strict Receive',
    operationPane: PathPaymentStrictReceive,
    helpNote: 'Sends an amount in a specific asset to a destination account through a path of offers. This allows the asset sent (e.g., 450 XLM) to be different from the asset received (e.g, 6 BTC). A Path Payment Strict Receive allows a user to specify the amount of the asset received. The amount sent varies based on offers in the order books.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#path-payment-strict-receive',
  },
  {
    name: 'manageSellOffer',
    label: 'Manage Sell Offer',
    operationPane: ManageSellOffer,
    helpNote: 'Creates, updates, or deletes an offer.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#manage-offer',
  },
  {
    name: 'manageBuyOffer',
    label: 'Manage Buy Offer',
    operationPane: ManageBuyOffer,
    helpNote: 'Creates, updates, or deletes an offer.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#manage-offer',
  },
  {
    name: 'createPassiveSellOffer',
    label: 'Create Passive Sell Offer',
    operationPane: GenericOffer,
    helpNote: 'Creates an offer that does not take another offer of equal price when created.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#create-passive-offer',
  },
  {
    name: 'setOptions',
    label: 'Set Options',
    operationPane: SetOptions,
    helpNote: 'Sets various configuration options for an account.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#set-options',
  },
  {
    name: 'changeTrust',
    label: 'Change Trust',
    operationPane: ChangeTrust,
    helpNote: 'Creates, updates, or deletes a trustline.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#change-trust',
  },
  {
    name: 'allowTrust',
    label: 'Allow Trust',
    operationPane: AllowTrust,
    helpNote: 'Updates the authorized flag of an existing trustline.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#allow-trust',
  },
  {
    name: 'accountMerge',
    label: 'Account Merge',
    operationPane: AccountMerge,
    helpNote: 'Transfers the native balance (the amount of XLM an account holds) to another account and removes the source account from the ledger.',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#account-merge',
  },
  {
    name: 'manageData',
    label: 'Manage Data',
    operationPane: ManageData,
    helpNote: 'Sets, modifies, or deletes a Data Entry (name/value pair).',
    docsUrl: 'https://www.stellar.org/developers/learn/concepts/list-of-operations.html#manage-data',
  },
  {
    name: 'bumpSequence',
    label: 'Bump Sequence',
    operationPane: BumpSequence,
    helpNote: 'Bumps sequence number.',
    docsUrl: 'https://www.stellar.org/developers/guides/concepts/list-of-operations.html#bump-sequence',
  },
]
