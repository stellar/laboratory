module.exports = {
  preset: "ts-jest",
  roots: ["."],
  collectCoverageFrom: ["src/**/*.ts"],
  testEnvironment: "node",
  transform: {
    "\\.[jt]sx?$": [
      "ts-jest",
      // Preserve BigInt syntax used by JS Stellar SDK v16 dependencies during Jest transforms.
      { useESM: true, tsconfig: { target: "es2020" } },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  // The Stellar SDK and zustand-querystring (via lodash-es) pull in ESM-only
  // dependencies; pnpm stores scoped packages as @scope+name.
  transformIgnorePatterns: [
    "/node_modules/.pnpm/(?!(?:@stellar\\+stellar-sdk|@exodus\\+bytes|@noble\\+hashes|@noble\\+ed25519|uint8array-extras|lodash-es)@)",
  ],
  modulePathIgnorePatterns: ["tests/e2e"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    // Make sure @ imports work in Jest tests
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
