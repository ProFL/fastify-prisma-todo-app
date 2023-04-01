import jestConfig from "./jest.config";

export default {
  ...jestConfig,
  testRegex: "./__tests__/.*.test.ts$",
  globalSetup: "./__tests__/setup.ts",
};
