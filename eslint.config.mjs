import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = [
  js.configs.recommended,
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...pluginQuery.configs["flat/recommended"],
  prettier,
  {
    rules: {
      // eslint-config-next/typescript downgrades these to warnings; keep them
      // as errors to match @typescript-eslint/recommended
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      // @TODO: ideally, these should be removed
      "@typescript-eslint/no-explicit-any": "off",
      "import/named": "off",
      // React Compiler rules added in eslint-plugin-react-hooks v7 (pulled in
      // by eslint-config-next 16). Existing code has many violations;
      // @TODO: enable and fix these in a follow-up.
      "react-hooks/error-boundaries": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
  {
    // eslint-config-next already ignores build/, .next/, out/ and next-env.d.ts
    ignores: ["playwright-report/**", "test-results/**"],
  },
];

export default eslintConfig;
