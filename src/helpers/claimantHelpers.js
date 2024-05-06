import * as Sdk from "@stellar/stellar-sdk";
import flatten from "lodash/flatten";
import flowRight from "lodash/flowRight";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

export function addPathDelimiter(a, b) {
  return a ? `${a}.${b}` : b;
}

// Claimant predicate store data is in the following format:
// {
//   conditional: {
//     and: [
//       {
//         conditional: {
//           or: [{...}, {...}],
//         },
//       },
//       {...},
//     ],
//   },
// }
//

// For rendering (transformPredicateDataForRender) we transform them in a more
// consistent format to make rendering and updates more clear.
// [
//   {
//     "parentPath": "",
//     "type": "conditional",
//     "value": [
//       {
//         "parentPath": "conditional",
//         "type": "and",
//         "value": [
//           {
//             "parentPath": "conditional.and.0",
//             "type": "conditional",
//             "value": [
//               {
//                 "parentPath": "conditional.and.0.conditional",
//                 "type": "or",
//                 "value": [{...},{...}]
//               }
//             ]
//           },
//           {
//             "parentPath": "conditional.and.1",
//             "type": "",
//             "value": []
//           }
//         ]
//       }
//     ]
//   }
// ]
export function transformPredicateDataForRender(data) {
  // parentPath is used to update item in ClaimantPicker using Lodash set()
  function loop(items, parentPath = "") {
    return Object.entries(items).map((item) => {
      const [key, value] = item;

      if (isArray(value)) {
        return {
          parentPath,
          type: key,
          // If value is array, we need to loop through all items.
          value: flatten(
            value.map((v, i) => {
              // If there is no value yet, return default.
              return isEmpty(v)
                ? [
                    {
                      parentPath: addPathDelimiter(parentPath, `${key}.${i}`),
                      type: "",
                      value: [],
                    },
                  ]
                : loop(v, addPathDelimiter(parentPath, `${key}.${i}`));
            }),
          ),
        };
      } else {
        const isTimeValue = key === "absolute" || key === "relative";
        const isValueString = typeof value === "string";

        return {
          parentPath,
          type: key,
          // If value is empty or type string (it means time value is set and
          // we need to stop), we return default or value.
          value:
            isEmpty(value) || isValueString
              ? [
                  {
                    parentPath: addPathDelimiter(parentPath, key),
                    type: "",
                    value: isTimeValue ? (isValueString ? value : "") : [],
                  },
                ]
              : loop(value, addPathDelimiter(parentPath, key)),
        };
      }
    });
  }

  // Return value is array of formatted items for rendering.
  return loop(data);
}

function getPredicateMethod(type) {
  switch (type) {
    case "unconditional":
      return Sdk.Claimant.predicateUnconditional;
    case "and":
      return Sdk.Claimant.predicateAnd;
    case "or":
      return Sdk.Claimant.predicateOr;
    case "not":
      return Sdk.Claimant.predicateNot;
    case "absolute":
      return Sdk.Claimant.predicateBeforeAbsoluteTime;
    case "relative":
      return Sdk.Claimant.predicateBeforeRelativeTime;
    default:
      throw new Error(`Predicate ${type.toUpperCase()} method not found.`);
  }
}

// We need to build predicate in the following format:
// Sdk.Claimant.predicateAnd(
//   Sdk.Claimant.predicateOr(
//     Sdk.Claimant.predicateNot(
//       Sdk.Claimant.predicateBeforeRelativeTime("111")
//     ),
//     Sdk.Claimant.predicateBeforeRelativeTime("222")
//   ),
//   Sdk.Claimant.predicateBeforeRelativeTime("333")
// );

// Lodash flowRight() allows us to make function calls from the last one (time),
// giving an array of parent functions.
export function createPredicate(data) {
  function loop(items, callbacksArray = []) {
    return flatten(
      Object.entries(items).map((item) => {
        const [key, value] = item;

        if (typeof value === "string") {
          const callback = flowRight([
            ...callbacksArray,
            getPredicateMethod(key),
          ]);
          return callback(value);
        } else {
          if (isArray(value)) {
            const predicates = flatten(value.map((v) => loop(v)));
            const callback = flowRight([
              ...callbacksArray,
              getPredicateMethod(key),
            ]);
            return callback(...predicates);
          } else {
            return loop(value, [...callbacksArray, getPredicateMethod(key)]);
          }
        }
      }),
    );
  }

  // Return value is an array, but we need to return an object.
  return loop(sanitizePredicateOpts(data))[0];
}

function validatePredicateValue(value, key, index) {
  if (isArray(value)) {
    value.forEach((v, i) => validatePredicateValue(v, key, i));
  }

  if (isEmpty(value)) {
    let message;

    if (key === "unconditional") {
      return;
    }

    switch (key) {
      case "conditional":
        message = "Conditional predicate is required.";
        break;
      case "and":
      case "or":
        message = `${key.toUpperCase()} requires predicate ${++index}.`;
        break;
      case "not":
        message = "NOT requires a predicate.";
        break;
      case "time":
        message = "Time predicate type is required.";
        break;
      case "absolute":
      case "relative":
        message = "Time predicate value is required.";
        break;
      default:
        message = `${key.toUpperCase()} is required.`;
    }

    throw new Error(message);
  }
}

// Predicate does not have "conditional" and "time" keys, so we need to remove
// them. Returned format:
// {
//   and: [
//     or: [{...}, {...}],
//     {...},
//   ],
// }
function sanitizePredicateOpts(opts) {
  const supportedKeys = [
    "unconditional",
    "and",
    "or",
    "not",
    "relative",
    "absolute",
  ];

  function getValue(value, key) {
    validatePredicateValue(value, key);
    return isArray(value) ? flatten(value.map((v) => loop(v))) : loop(value);
  }

  function loop(items) {
    return flatten(
      Object.entries(items).map((item) => {
        const [key, value] = item;

        if (typeof value === "string") {
          validatePredicateValue(value, key);
          return { [key]: value };
        } else {
          return supportedKeys.includes(key)
            ? {
                [key]: getValue(value, key),
              }
            : getValue(value, key);
        }
      }),
    );
  }

  // Return value is an array, but we need to return an object.
  return loop(opts)[0];
}
