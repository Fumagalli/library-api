import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    hookTimeout: 30000,
    env: {
      NODE_ENV: "test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
      include: ["src/**/*.js", "server.js"],
      exclude: ["node_modules/", "tests/", ".specs/"],
      lines: 80,
      functions: 100,
      branches: 100,
      statements: 80,
    },
  },
});
