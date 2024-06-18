import { functions } from "lodash";
import { xdr } from "@stellar/stellar-sdk";

export const ALL_XDR_TYPES = functions(xdr).sort();
