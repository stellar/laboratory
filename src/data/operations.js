import _ from 'lodash';

export function getOperation(opId) {
  return _.find(operationsMap, { id: opId });
}

// Operations map documentation:
// [ // In an array because we really want this to be ordered correctly (whereas for params, it is not as important)
//   {
//     id: 'createAccount', // Corresponds to the operation key in js-stellar-base.Operation
//     label: 'Create Account', // Human friendly name for the operation
//     params: { // In array format so that it can be ordered
//       'destination': { // Corresponds to js-stellar-base.Operation[type] keys
//         label: 'Destination', // Shows up in the operation form
//         pickerType: 'PubKey', // Name of the React Picker component (minus "Picker")
//       },
//     },
//   },
// ]

export const operationsMap = [
  {
    id: 'createAccount',
    label: 'Create Account',
    params: {
      'destination': {
        label: 'Destination',
        pickerType: 'PubKey',
      },
      'asset': {
        label: 'Asset',
        pickerType: 'Asset',
      },
      'amount': {
        label: 'Amount',
        pickerType: 'Amount',
      },
    },
  },
  {
    id: 'payment',
    label: 'Payment',
    params: {

    },
  },
  {
    id: 'pathPayment',
    label: 'Path Payment',
    params: {

    },
  },
  {
    id: 'manageOffer',
    label: 'Manage Offer',
    params: {

    },
  },
  {
    id: 'createPassiveOffer',
    label: 'Create Passive Offer',
    params: {

    },
  },
  {
    id: 'setOptions',
    label: 'Set Options',
    params: {

    },
  },
  {
    id: 'changeTrust',
    label: 'Change Trust',
    params: {

    },
  },
  {
    id: 'allowTrust',
    label: 'Allow Trust',
    params: {

    },
  },
  {
    id: 'accountMerge',
    label: 'Account Merge',
    params: {

    },
  },
  {
    id: 'inflation',
    label: 'Inflation',
    params: {

    },
  },
]
