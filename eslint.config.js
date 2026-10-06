import { config as baseConfig } from "@nguyenthanhduyofficial/eslint-config/base";
import { nextJsConfig } from "@nguyenthanhduyofficial/eslint-config/next-js";
import { libraryConfig } from "@nguyenthanhduyofficial/eslint-config/library";

export default [
  ...baseConfig,
  ...nextJsConfig.map((config) => ({
    ...config,
    files: ["packages/{web,admin}/**/*.{js,ts,tsx}"],
  })),
  ...libraryConfig.map((config) => ({
    ...config,
    files: ["packages/{shared,utils}/**/*.{js,ts,tsx}"],
  })),
];
