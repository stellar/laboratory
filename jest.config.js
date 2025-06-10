const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/unit/**/*.test.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
};
