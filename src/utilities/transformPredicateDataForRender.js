import {flatten, isEmpty} from "lodash";

const isArray = (val) => Array.isArray(val);
export const addPathDelimiter = (a, b) => (a ? `${a}.${b}` : b);

export function transformPredicateDataForRender(data) {
  function loop(items, parentPath = "") {
    return Object.entries(items).map((item) => {
      const [key, value] = item;

      if (isArray(value)) {
        return {
          parentPath,
          type: key,
          value: flatten(
            value.map((v, i) => {
              return isEmpty(v)
                ? [{
                  parentPath: addPathDelimiter(parentPath, `${key}.${i}`),
                  type: "",
                  value: []
                }]
                : loop(v, addPathDelimiter(parentPath, `${key}.${i}`));
            })
          ),
        };
      } else {
        const isTimeValue = key === "absolute" || key === "relative";
        const isValueString = typeof value === "string";

        return {
          parentPath,
          type: key,
          value: isEmpty(value) || isValueString
            ? [{
              parentPath: addPathDelimiter(parentPath, key),
              type: "",
              value: isTimeValue ? (isValueString ? value : "") : []
            }]
            : loop(value, addPathDelimiter(parentPath, key)),
        };
      }
    });
  }

  return loop(data);
}
