import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths({ root: __dirname })],
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    fileParallelism: false,
    passWithNoTests: true,
  },
});
