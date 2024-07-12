import { FiltersObject } from "@/types/types";

import { arrayOfStrings } from "./arrayOfStrings";
import { contractId } from "./contractId";

export const getEventsFilters = (value: FiltersObject) => {
  const invalid = { contractId: false, topics: false };

  if (!value) {
    return true;
  }

  const is_contract_ids_empty = value.contract_ids.every(
    (id) => id.length === 0,
  );
  const is_topics_empty = value.contract_ids.every(
    (topic) => topic.length === 0,
  );

  if (is_contract_ids_empty) {
    invalid.contractId = true;
  }

  if (is_topics_empty) {
    invalid.topics = true;
  }

  value.contract_ids.forEach((val) => {
    if (val.length > 0) {
      const is_invalid = Boolean(contractId(val));
      invalid.contractId = is_invalid;
    }
  });

  value.topics.forEach((val) => {
    if (val.length > 0) {
      const is_invalid = Boolean(arrayOfStrings(val));
      invalid.topics = is_invalid;
    }
  });

  return invalid.contractId || invalid.topics;
};
