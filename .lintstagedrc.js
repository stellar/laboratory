const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

const ignoredFiles = ["./src/temp/stellar-xdr-web/**/*"];

const eslintPattern = `!(${ignoredFiles.join(",")})*.{js,ts,jsx,tsx}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
};
