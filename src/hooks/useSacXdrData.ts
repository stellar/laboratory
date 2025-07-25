import { parse, stringify } from "lossless-json";

import { useGitHubFile } from "@/query/useGitHubFile";

import * as StellarXdr from "@/helpers/StellarXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { STELLAR_ASSET_CONTRACT } from "@/constants/stellarAssetContractData";

import { AnyObject } from "@/types/types";

export const useSacXdrData = ({ isActive }: { isActive: boolean }) => {
  const {
    data: sacData,
    error: sacDataError,
    isFetching: isSacDataFetching,
    isLoading: isSacDataLoading,
  } = useGitHubFile({
    repo: STELLAR_ASSET_CONTRACT.contractSpecRepo,
    path: STELLAR_ASSET_CONTRACT.contractSpecPath,
    file: `${STELLAR_ASSET_CONTRACT.contractSpecFileName}.json`,
    isActive: Boolean(isActive),
  });

  const isXdrInit = useIsXdrInit();

  if (!sacData) {
    return {
      SacXdrData: "",
      sacDataError: null,
      isSacDataFetching: false,
      isSacDataLoading: false,
    };
  }

  const SacXdrData = (dataString: string | null | undefined): string[] => {
    if (!dataString) {
      return [""];
    }

    const jsonData = parse(dataString) as AnyObject[];

    return isXdrInit
      ? jsonData.map((d) =>
          StellarXdr.encode("ScSpecEntry", stringify(d) || ""),
        )
      : [""];
  };

  const sacXdrDataFormatted = SacXdrData(sacData);

  return {
    sacXdrData: sacXdrDataFormatted,
    sacDataError: sacDataError,
    isSacDataFetching: isSacDataFetching,
    isSacDataLoading: isSacDataLoading,
  };
};
