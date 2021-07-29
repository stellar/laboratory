module.exports = {
  extends: ["@stellar/eslint-config"],
  rules: {
    "no-console": "off",
    "import/no-unresolved": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx", ".jsx"] }],
    "no-plusplus": "off",
    "jsdoc/check-indentation": "off",
  },
};
