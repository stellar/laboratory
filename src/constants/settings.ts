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
