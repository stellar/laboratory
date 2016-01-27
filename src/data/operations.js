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
  {
    name: 'pathPayment',
    label: 'Path Payment',
    operationPane: require('../components/OperationPanes/PathPayment'),
  },
  {
    name: 'changeTrust',
    label: 'Change Trust',
    operationPane: require('../components/OperationPanes/ChangeTrust'),
  },
  {
    name: 'allowTrust',
    label: 'Allow Trust',
    operationPane: require('../components/OperationPanes/AllowTrust'),
  },
  {
    name: 'accountMerge',
    label: 'Account Merge',
    operationPane: require('../components/OperationPanes/AccountMerge'),
  },
  {
    name: 'manageOffer',
    label: 'Manage Offer',
    operationPane: require('../components/OperationPanes/ManageOffer'),
  },
  {
    name: 'createPassiveOffer',
    label: 'Create Passive Offer',
    operationPane: require('../components/OperationPanes/GenericOffer'),
  },
  {
    name: 'inflation',
    label: 'Inflation',
    operationPane: () => [], // empty operation pane
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
  //   name: 'setOptions',
  //   label: 'Set Options',
  //   params: {
  //   },
  // },
]
