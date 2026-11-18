module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // First run downloads the in-memory mongod binary, which can be slow.
  testTimeout: 60000,
  // Measure coverage on application code only (not server bootstrap).
  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
  ],
};
