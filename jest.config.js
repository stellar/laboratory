module.exports = {
  preset: "ts-jest",
  roots: ["./src"],
  collectCoverageFrom: ["src/**/*.ts"],
  testEnvironment: "node",
  transform: { "\\.[jt]sx?$": ["ts-jest", { useESM: true }] },
  extensionsToTreatAsEsm: [".ts"],
  modulePathIgnorePatterns: ["tests/e2e"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};
