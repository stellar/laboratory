import { useQuery } from "@tanstack/react-query";
import {
  CONTRACT_STORAGE_MAX_ENTRIES,
  STELLAR_EXPERT_API,
} from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { ContractStorageResponseItem, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract’s storage data
 */
export const useSEContractStorage = ({
  isActive,
  networkId,
  contractId,
  totalEntriesCount,
}: {
  isActive: boolean;
  networkId: NetworkType;
  contractId: string;
  totalEntriesCount: number | undefined;
}) => {
  const query = useQuery<ContractStorageResponseItem[] | null>({
    queryKey: ["useSEContractStorage", networkId, contractId],
    queryFn: async () => {
      // No entries
      if (!totalEntriesCount) {
        return null;
      }

      const network = getStellarExpertNetwork(networkId);

      if (!network) {
        return null;
      }

      let allRecords: ContractStorageResponseItem[] = [];
      let hasMoreRecords = true;

      const fetchData = async (cursor?: string) => {
        const searchParams = new URLSearchParams();

        searchParams.append("order", "desc");
        searchParams.append("limit", "200");

        if (cursor) {
          searchParams.append("cursor", cursor);
        }

        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/contract-data/${contractId}?${searchParams.toString()}`,
        );

        const responseJson = await response.json();

        if (responseJson.error) {
          throw responseJson.error;
        }

        const newRecords = responseJson?._embedded?.records || [];

        allRecords = [...allRecords, ...newRecords];

        if (newRecords.length === 0) {
          hasMoreRecords = false;
        }
      };

      try {
        // Fetch the last entries limited by CONTRACT_STORAGE_MAX_ENTRIES
        while (
          allRecords.length <
            Math.min(totalEntriesCount, CONTRACT_STORAGE_MAX_ENTRIES) &&
          hasMoreRecords
        ) {
          const lastRecord = allRecords.slice(-1)[0];
          await fetchData(lastRecord?.paging_token);
        }

        return [
          {
            durability: "instance",
            key: "AAAAFA==",
            ttl: 55739737,
            updated: 1714683631,
            value:
              "AAAAEwAAAACKvCiRMDXAdBHtXRNOa/6rRyPZfd1NGiKgYF01yU0aNgAAAAEAAAADAAAADwAAAAhNRVRBREFUQQAAABEAAAABAAAAAwAAAA8AAAAHZGVjaW1hbAAAAAADAAAABwAAAA8AAAAEbmFtZQAAAA4AAAAQQ29tZXQgUG9vbCBUb2tlbgAAAA8AAAAGc3ltYm9sAAAAAAAOAAAABENQQUwAAAAQAAAAAQAAAAEAAAAPAAAACkNvbnRyb2xsZXIAAAAAABIAAAAAAAAAAAMJ8G6bkjiyHqIIfyNprgPCb2rPxnXxZpo+96d+DkkIAAAAEAAAAAEAAAABAAAADwAAAAdTd2FwRmVlAAAAAAoAAAAAAAAAAAAAAAAAAHUw",
            paging_token: "QAACRszAoxHcKs/DCG/SjmBkN5QFxbVnrgVwzfHOYsfj9zFT",
          },
          {
            durability: "persistent",
            expired: true,
            key: "AAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAAAAAAAADUHzWSNzGg5GttrOzM+KOt5ibc4bAPIDc+vrDLlXlTx",
            ttl: 55968506,
            updated: 1728659844,
            value: "AAAACgAAAAAAAAAAAAAAAAGHXCI=",
            paging_token: "QAACRgATsjM+Uz3SEwjOBECC492dskracGox30wTehca3Q0g",
          },
          {
            durability: "temporary",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAlBbGxvd2FuY2UAAAAAAAARAAAAAQAAAAIAAAAPAAAABGZyb20AAAASAAAAAAAAAAARP+aVst5Yi29zg/8dl0PREDjea5k3wN6LOkobCPQ1ewAAAA8AAAAHc3BlbmRlcgAAAAASAAAAASWyr9NeVDMaSJDDYxn3ntsY8HieR/w4ezsw7y5ppU0a",
            ttl: 53635226,
            updated: 1727041046,
            value:
              "AAAAEQAAAAEAAAACAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAABFsaXZlX3VudGlsX2xlZGdlcgAAAAAAAAMDM2Wg",
            paging_token: "QAACRQC7djIElPlcohxj49v+213f6RpSK3QsbepJJBJ4lAgq",
            expired: true,
          },
          {
            durability: "instance",
            key: "AAAAFA==",
            ttl: 57339385,
            updated: 1734691878,
            value:
              "AAAAEwAAAAD6gAn8jG3DCsiDphtTiNlEf2Qn+nWr29XNSoF4Nd/WGQAAAAEAAAABAAAADwAAAAVBRE1JTgAAAAAAABIAAAAAAAAAAOnatvNUT3UzhD2pfbCDPEWfdKqTIZAk8MKg34PZnxsM",
            paging_token: "QAAFc6K12RmOyffzdIsRlq9ZNY0S/4o9ZtjS79ELnqCpWOJy",
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAABdnTlblPKwDRVhIgfbB1p2Kg5wH2rf0cT2Ef7USAywuM=",
            ttl: 53573513,
            updated: 1714685793,
            value:
              "AAAAEQAAAAEAAAADAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAADaR1q/AAAAAADwAAAAphdXRob3JpemVkAAAAAAAAAAAAAQAAAA8AAAAIY2xhd2JhY2sAAAAAAAAAAA==",
            paging_token: "QAACRQnYduBygJfW9itE+Tx8njb6TUbyFoaHODoDWCu7rgcj",
            expired: true,
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAAAAAAAACGu5cncXhnlcakOe9fkNSAhil3HzXoOyc5usXm9Rumy",
            ttl: 53774298,
            updated: 1720314121,
            value: "AAAACgAAAAAAAAAAAAAAAAAAAAA=",
            paging_token: "QAACRgA7Mmbe6LPvIHNl5SAay/ihUQ9ywr4PYrgjMAXTd/qR",
            expired: true,
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAdSZXNEYXRhAAAAABIAAAABNQ6lmcqcuo9u5zwX7QWniIz16onAnWpe+ucauxVZ1t0=",
            ttl: 56195548,
            updated: 1729956103,
            value:
              "AAAAEQAAAAEAAAAHAAAADwAAAAZiX3JhdGUAAAAAAAoAAAAAAAAAAAAAAAA7msoAAAAADwAAAAhiX3N1cHBseQAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAAA9iYWNrc3RvcF9jcmVkaXQAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAABmRfcmF0ZQAAAAAACgAAAAAAAAAAAAAAADuaygAAAAAPAAAACGRfc3VwcGx5AAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAABmlyX21vZAAAAAAACgAAAAAAAAAAAAAAADuaygAAAAAPAAAACWxhc3RfdGltZQAAAAAAAAUAAAAAZx0JBw==",
            paging_token: "QAAHwgQmcGiCMFWsCsb7P9vtFhFFLkNqcltVFrGcJGsvNDKA",
          },
          {
            durability: "instance",
            key: "AAAAFA==",
            ttl: 56195544,
            updated: 1730269711,
            value:
              "AAAAEwAAAAC6+XjxDv282FdHhovviDKEXqaAn3ZDtnpKwM1mkyf8LAAAAAEAAAAGAAAADwAAAAVBZG1pbgAAAAAAABIAAAAAAAAAADUHzWSNzGg5GttrOzM+KOt5ibc4bAPIDc+vrDLlXlTxAAAADwAAAAdCTE5EVGtuAAAAABIAAAAB9dY2s8jXzG7hE8SbmuCde2oc7rMwUvMBIanSieZmJ1MAAAAPAAAACEJhY2tzdG9wAAAAEgAAAAEdsBgMzWLDomvfiJ1XMLKxF9mQA8cB9wRxdmQX8+cpxAAAAA8AAAAGQ29uZmlnAAAAAAARAAAAAQAAAAQAAAAPAAAACmJzdG9wX3JhdGUAAAAAAAMAFuNgAAAADwAAAA1tYXhfcG9zaXRpb25zAAAAAAAAAwAAAAQAAAAPAAAABm9yYWNsZQAAAAAAEgAAAAGBROIk5o8OP7CvTEN6VQIFwqJpl7OTihJzGVp4vfWzywAAAA8AAAAGc3RhdHVzAAAAAAADAAAAAwAAAA8AAAAGSXNJbml0AAAAAAAAAAAAAQAAAA8AAAAETmFtZQAAAA4AAAAWQ2xpY2tQZXNhIERlYnRGdW5kIFNNRQAA",
            paging_token: "QAAHwj1alUag8YvXU0pkHV75Z20GH7GdpjCrk8ewTeZHBqRM",
          },
          {
            durability: "persistent",
            key: "AAAADwAAAAdSZXNMaXN0AA==",
            ttl: 56195548,
            updated: 1729956122,
            value:
              "AAAAEAAAAAEAAAACAAAAEgAAAAE1DqWZypy6j27nPBftBaeIjPXqicCdal765xq7FVnW3QAAABIAAAABre/OWa7lKWj3YGHUlMJSW3Vln6QpamX0me8p5WR35JY=",
            paging_token: "QAAHwlhp6xa8DX7yB9ZUdQuOPQGNBI9XI0X1no53/ONEjI8q",
          },
          {
            durability: "temporary",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAdSZXNJbml0AAAAABIAAAABre/OWa7lKWj3YGHUlMJSW3Vln6QpamX0me8p5WR35JY=",
            ttl: 54139229,
            updated: 1729956122,
            value:
              "AAAAEQAAAAEAAAACAAAADwAAAApuZXdfY29uZmlnAAAAAAARAAAAAQAAAAsAAAAPAAAACGNfZmFjdG9yAAAAAwAAAAAAAAAPAAAACGRlY2ltYWxzAAAAAwAAAAcAAAAPAAAABWluZGV4AAAAAAAAAwAAAAEAAAAPAAAACGxfZmFjdG9yAAAAAwCViUAAAAAPAAAACG1heF91dGlsAAAAAwCYloAAAAAPAAAABnJfYmFzZQAAAAAAAwAST4AAAAAPAAAABXJfb25lAAAAAAAAAwAAAAAAAAAPAAAAB3JfdGhyZWUAAAAAAwAAAAAAAAAPAAAABXJfdHdvAAAAAAAAAwAAAAAAAAAPAAAACnJlYWN0aXZpdHkAAAAAAAMAAAAAAAAADwAAAAR1dGlsAAAAAwCQ9WAAAAAPAAAAC3VubG9ja190aW1lAAAAAAUAAAAAZx0JDQ==",
            paging_token: "QAAHwoCD9pbtdwm7bpbBZDfUALGn7xh/RjxGhvLF3yfioPfm",
            expired: true,
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAlSZXNDb25maWcAAAAAAAASAAAAATUOpZnKnLqPbuc8F+0Fp4iM9eqJwJ1qXvrnGrsVWdbd",
            ttl: 56195548,
            updated: 1729956103,
            value:
              "AAAAEQAAAAEAAAALAAAADwAAAAhjX2ZhY3RvcgAAAAMAlYlAAAAADwAAAAhkZWNpbWFscwAAAAMAAAAHAAAADwAAAAVpbmRleAAAAAAAAAMAAAAAAAAADwAAAAhsX2ZhY3RvcgAAAAMAAAAAAAAADwAAAAhtYXhfdXRpbAAAAAMAAw1AAAAADwAAAAZyX2Jhc2UAAAAAAAMAAYagAAAADwAAAAVyX29uZQAAAAAAAAMAB6EgAAAADwAAAAdyX3RocmVlAAAAAAMAmJaAAAAADwAAAAVyX3R3bwAAAAAAAAMATEtAAAAADwAAAApyZWFjdGl2aXR5AAAAAAADAAAAAAAAAA8AAAAEdXRpbAAAAAMAAYag",
            paging_token: "QAAHwq7aUk71VIcqx0cmJSP/eGkH3VpyR55WTqlumLe0RJXi",
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAlQb3NpdGlvbnMAAAAAAAASAAAAAAAAAAC/p1Wg5tcDzAljTT6zlW+ZXIyxpi3LyLayPhNxiMUElw==",
            ttl: 56249164,
            updated: 1731051851,
            value:
              "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAEAAAADAAAAAQAAAAoAAAAAAAAAAAAAAAAAehIAAAAADwAAAAtsaWFiaWxpdGllcwAAAAARAAAAAQAAAAAAAAAPAAAABnN1cHBseQAAAAAAEQAAAAEAAAAA",
            paging_token: "QAAHwv8g3HwEknGjJYM0H9bOlW3BX47WD0aUrERm02XrNWWL",
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAlDb250cmFjdHMAAAAAAAASAAAAAdPobBptFbA2xTXEegXwTdQLhO2lULNMjpyIfTR5FwqP",
            ttl: 56163850,
            updated: 1729771422,
            value: "AAAAAAAAAAE=",
            paging_token: "QAACQwhUaiYj1qjag3DAFUXcI7U/KZe5GJ7Upg5sY4XXEKPt",
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAlVRW1pc0RhdGEAAAAAAAARAAAAAQAAAAIAAAAPAAAABHBvb2wAAAASAAAAAesKqdjWJXlpAvqb5jQSkd4Hfo3VI6c3jkakphUtqBg7AAAADwAAAAR1c2VyAAAAEgAAAAAAAAAAyO62g0UM0culGHQ6NzIAeOH5N2JZxtUvREanXp53/Wg=",
            ttl: 53631809,
            updated: 1721418297,
            value:
              "AAAAEQAAAAEAAAACAAAADwAAAAdhY2NydWVkAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAVpbmRleAAAAAAAAAoAAAAAAAAAAAAAAAAFfxbV",
            paging_token: "QAACRAAsMmLJZQnChGJdK6wIoJ3EoynVEkrsvLinLWrbUQpF",
            expired: true,
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAtVc2VyQmFsYW5jZQAAAAARAAAAAQAAAAIAAAAPAAAABHBvb2wAAAASAAAAAV/2u8X5YjPJxYBnpeqWwjOn0/5KqxwCEzbVmUF4A5SCAAAADwAAAAR1c2VyAAAAEgAAAAAAAAAAiYAik2F83T9w3mhoO9cunM/Y7AV8ZrAVhFCZNavrwyo=",
            ttl: 54604788,
            updated: 1736524320,
            value:
              "AAAAEQAAAAEAAAACAAAADwAAAANxNHcAAAAAEAAAAAEAAAAAAAAADwAAAAZzaGFyZXMAAAAAAAoAAAAAAAAAAAAAAHc4EmAc",
            paging_token: "QAACRAQ5NPalBoPj0wh8KKeMLh7HGxrJ7WdG7eCQ/gbOzb+1",
            expired: true,
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAtVc2VyQmFsYW5jZQAAAAARAAAAAQAAAAIAAAAPAAAABHBvb2wAAAASAAAAAV/2u8X5YjPJxYBnpeqWwjOn0/5KqxwCEzbVmUF4A5SCAAAADwAAAAR1c2VyAAAAEgAAAAAAAAAA97G8MWrJJvBwEMcyyZbyKUkvsnbeiv20HYJ+bnaYo/s=",
            ttl: 54798595,
            updated: 1730206371,
            value:
              "AAAAEQAAAAEAAAACAAAADwAAAANxNHcAAAAAEAAAAAEAAAABAAAAEQAAAAEAAAACAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAAAAK+3RmFAAAADwAAAANleHAAAAAABQAAAABnPIojAAAADwAAAAZzaGFyZXMAAAAAAAoAAAAAAAAAAAAAAAAAAAAA",
            paging_token: "QAACRAmF1QMol81Pv+RzZTSgxaNozWWXQUtDkPRL0mxCGIYF",
            expired: true,
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAlQb3NpdGlvbnMAAAAAAAASAAAAAAAAAAAC016ld1b5DTGfGjCuWun9OibvZYfWP2aTs/lrUgfTYg==",
            ttl: 56628332,
            updated: 1734101469,
            value:
              "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAAAAAAPAAAAC2xpYWJpbGl0aWVzAAAAABEAAAABAAAAAAAAAA8AAAAGc3VwcGx5AAAAAAARAAAAAQAAAAA=",
            paging_token: "QAAJ/gCbt/wBKG2EJHZ3qdugAIKOCqTwEDwFBwduZ/Wug5sw",
          },
          {
            durability: "persistent",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAlQb3NpdGlvbnMAAAAAAAASAAAAAAAAAACxWPky8NcQFLo5BeW36fH8mWqsJEUzV9yJJTyBLHHD2A==",
            ttl: 57020541,
            updated: 1734041170,
            value:
              "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAIAAAADAAAAAQAAAAoAAAAAAAAAAAAAABWfIWAVAAAAAwAAAAMAAAAKAAAAAAAAAAAAAAAyLhomSAAAAA8AAAALbGlhYmlsaXRpZXMAAAAAEQAAAAEAAAABAAAAAwAAAAMAAAAKAAAAAAAAAAAAAAAa5FRJJAAAAA8AAAAGc3VwcGx5AAAAAAARAAAAAQAAAAA=",
            paging_token: "QAAJ/gc5gvTV9g9fjSjS/bbVHZw5AvjuDJeq3++kG/z1gT3z",
          },
          {
            durability: "temporary",
            key: "AAAAFTVJvsNI7koq",
            ttl: 57026546,
            updated: 1746894827,
            value: "AAAAAQ==",
            paging_token: "QAAcWP/sY7Cz9Qo5q5YPKY4xW1qK4AIvH4ArUdWCPn/E3CnY",
            expired: true,
          },
          {
            durability: "temporary",
            key: "AAAAEAAAAAEAAAACAAAADwAAAAdFZDI1NTE5AAAAAA0AAAAgHOVn7bCRSEJIuLXVQtwUik4QDi/j2ptPA4qnAWcS8Wk=",
            ttl: 56984617,
            updated: 1746656362,
            value:
              "AAAAEAAAAAEAAAADAAAADwAAAAdFZDI1NTE5AAAAABAAAAABAAAAAQAAAAEAAAAQAAAAAQAAAAEAAAARAAAAAQAAAAIAAAASAAAAAXW7RHCxpP9h7McpXouOt0QZ3Vhu7kBM31JJkV2JDgh3AAAAAQAAABIAAAAB1/5EvQrxHWArEJHy9KH03yEtRE0DIeoyrbPMHLurCgQAAAAB",
            paging_token: "QAAcWOf7uIkYJatra82fXPRN63TgdxgkoCpX0uwGhAfSfDm6",
            expired: true,
          },
        ];

        return allRecords;
      } catch (e: any) {
        throw `Something went wrong. ${e}`;
      }
    },
    enabled: Boolean(isActive && networkId && contractId),
    // Keep data for 30 seconds
    staleTime: 1000 * 30,
  });

  return query;
};
