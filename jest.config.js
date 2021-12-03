module.exports = {
  testPathIgnorePatterns: ["__mocks__"],
  moduleDirectories: ["node_modules", "src/"],
  setupFiles: ["./setupJest.js"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
