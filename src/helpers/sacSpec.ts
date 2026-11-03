import { contract } from "@stellar/stellar-sdk";
import { STELLAR_ASSET_CONTRACT_SPEC } from "@/constants/stellarAssetContractSpec";

export const SAC_SPEC = new contract.Spec(STELLAR_ASSET_CONTRACT_SPEC);
