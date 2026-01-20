import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    exclude: ["build", "dist", "node_modules"],
  },
  plugins: [tsconfigPaths()],
});
