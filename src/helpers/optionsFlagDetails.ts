import { OptionFlag } from "@/types/types";

export const optionsFlagDetails = (options: OptionFlag[], selected: string[]) =>
  selected.reduce(
    (res, cur: string) => {
      const opt = options.find((o) => o.id === cur);

      if (opt?.value) {
        return {
          total: res.total + Number(opt.value),
          selections: [...res.selections, `${opt.label} (${opt.value})`],
        };
      }

      return res;
    },
    { total: 0, selections: [] } as { total: number; selections: string[] },
  );
