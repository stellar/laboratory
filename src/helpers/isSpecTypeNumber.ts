import { xdr } from "@stellar/stellar-sdk";

export const isSpecTypeNumber = (specType: xdr.ScSpecType): boolean => {
  console.log("specType.name(): ", specType.name);
  console.log("specType.value: ", specType.value);
  switch (specType.name) {
    case xdr.ScSpecType.scSpecTypeU32().name:
    case xdr.ScSpecType.scSpecTypeI32().name:
    case xdr.ScSpecType.scSpecTypeU64().name:
    case xdr.ScSpecType.scSpecTypeI64().name:
    case xdr.ScSpecType.scSpecTypeU128().name:
    case xdr.ScSpecType.scSpecTypeI128().name:
    case xdr.ScSpecType.scSpecTypeU256().name:
    case xdr.ScSpecType.scSpecTypeI256().name:
      return true; // It's a valid number spec type
    default:
      return false; // Not a valid number spec type
  }
};
