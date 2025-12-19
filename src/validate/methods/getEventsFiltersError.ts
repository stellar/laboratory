import { FiltersObject } from "@/types/types";

import { getArrayOfStringsError } from "./getArrayOfStringsError";
import { getContractIdError } from "./getContractIdError";

export const getEventsFiltersError = (value: FiltersObject) => {
  const invalid = { contractId: false, topics: false };

  if (!value) {
    return true;
  }

  const is_contract_ids_empty = value.contract_ids.every(
    (id) => id.length === 0,
  );
  const is_topics_empty = value.topics.every((topic) => topic.length === 0);

  if (is_contract_ids_empty) {
    invalid.contractId = true;
  }

  if (is_topics_empty) {
    invalid.topics = true;
  }

  invalid.contractId =
    invalid.contractId ||
    value.contract_ids.some(
      (val) => val.length > 0 && Boolean(getContractIdError(val)),
    );

  invalid.topics =
    invalid.topics ||
    value.topics.some(
      (val) => val.length > 0 && Boolean(getArrayOfStringsError(val)),
    );

  return invalid.contractId || invalid.topics;
};
