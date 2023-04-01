const config: import("jest").Config = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testRegex: "./src/.*.spec.ts$",
};

export default config;
