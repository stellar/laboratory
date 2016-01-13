import _ from 'lodash';

export function getOperation(opName) {
  return _.find(operationsMap, { name: opName });
}

// Operations map documentation:
// [ // In an array because we really want this to be ordered correctly (whereas for params, it is not as important)
//   {
//     name: 'createAccount', // Corresponds to the operation key in js-stellar-base.Operation
//     label: 'Create Account', // Human friendly name for the operation
//     operationPane: require('../components/OperationPanes/CreateAccount'), // React component that contains the multiple pickers for this operation
//   },
// ]

export const operationsMap = [
  {
    name: 'createAccount',
    label: 'Create Account',
    operationPane: require('../components/OperationPanes/CreateAccount'),
  },
  {
    name: 'payment',
    label: 'Payment',
    operationPane: require('../components/OperationPanes/Payment'),
  },
  // TODO: Other complex operations
  // {
  //   name: 'pathPayment',
  //   label: 'Path Payment',
  //   params: {
  //
  //   },
  // },
  // {
  //   name: 'manageOffer',
  //   label: 'Manage Offer',
  //   params: {
  //     'buying': {
  //       label: 'Buying Asset',
  //       pickerType: 'Asset',
  //     },
  //     'selling': {
  //       label: 'Selling Asset',
  //       pickerType: 'Asset',
  //     },
  //     'amount': {
  //       label: 'Amount',
  //       pickerType: 'Amount',
  //     },
  //     'price': {
  //       label: 'Price',
  //       pickerType: 'Amount',
  //     },
  //     'offerId': {
  //       label: 'Offer ID',
  //       pickerType: 'Offer',
  //       optional: true,
  //     }
  //   },
  // },
  // {
  //   name: 'createPassiveOffer',
  //   label: 'Create Passive Offer',
  //   params: {
  //     'buying': {
  //       label: 'Buying Asset',
  //       pickerType: 'Asset',
  //     },
  //     'selling': {
  //       label: 'Selling Asset',
  //       pickerType: 'Asset',
  //     },
  //     'amount': {
  //       label: 'Amount',
  //       pickerType: 'Amount',
  //     },
  //     'price': {
  //       label: 'Price',
  //       pickerType: 'Amount',
  //     },
  //   },
  // },
  // {
  //   name: 'setOptions',
  //   label: 'Set Options',
  //   params: {
  //   },
  // },
  // {
  //   name: 'changeTrust',
  //   label: 'Change Trust',
  //   params: {
  //     'asset': {
  //       label: 'Asset',
  //       pickerType: 'Asset',
  //     },
  //     'amount': {
  //       label: 'Trust Amount',
  //       pickerType: 'Amount',
  //     },
  //   },
  // },
  // {
  //   name: 'allowTrust',
  //   label: 'Allow Trust',
  //   params: {
  //     'destination': {
  //       label: 'Trustor',
  //       pickerType: 'PubKey',
  //     },
  //     'asset': {
  //       label: 'Asset',
  //       pickerType: 'Asset',
  //     },
  //   },
  // },
  // {
  //   name: 'accountMerge',
  //   label: 'Account Merge',
  //   params: {
  //
  //   },
  // },
  // {
  //   name: 'inflation',
  //   label: 'Inflation',
  //   params: {
  //
  //   },
  // },
]
