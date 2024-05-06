export const amount = {
  toStroops: (value: string) => BigInt(value) * BigInt(10000000),
  fromStroops: (value: string) => BigInt(value) / BigInt(10000000),
};
