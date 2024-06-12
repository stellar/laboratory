export const LOCAL_STORAGE_SAVED_NETWORK = "stellar_lab_network";

export const OPERATION_SET_FLAGS = [
  {
    id: "set-auth-required",
    label: "Authorization required",
    value: 1,
  },
  {
    id: "set-auth-revocable",
    label: "Authorization revocable",
    value: 2,
  },
  {
    id: "set-auth-immutable",
    label: "Authorization immutable",
    value: 4,
  },
  {
    id: "set-auth-clawback",
    label: "Authorization clawback enabled",
    value: 8,
  },
];

export const OPERATION_CLEAR_FLAGS = [
  {
    id: "clear-auth-required",
    label: "Authorization required",
    value: 1,
  },
  {
    id: "clear-auth-revocable",
    label: "Authorization revocable",
    value: 2,
  },
  {
    id: "clear-auth-clawback",
    label: "Authorization clawback enabled",
    value: 8,
  },
];

export const OPERATION_TRUSTLINE_SET_FLAGS = [
  {
    id: "trustline-set-authorized",
    label: "Authorized",
    value: 1,
  },
  {
    id: "trustline-set-liabilites",
    label: "Authorized to maintain liabilites",
    value: 2,
  },
];

export const OPERATION_TRUSTLINE_CLEAR_FLAGS = [
  {
    id: "trustline-clear-authorized",
    label: "Authorized",
    value: 1,
  },
  {
    id: "trustline-clear-liabilites",
    label: "Authorized to maintain liabilites",
    value: 2,
  },
  {
    id: "trustline-clear-clawback",
    label: "Clawback enabled",
    value: 4,
  },
];
