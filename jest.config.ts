const config: import("jest").Config = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testRegex: "((\\.|/)(test|spec))\\.ts?$",
  globalSetup: "./__tests__/setup.ts",
};

export default config;
