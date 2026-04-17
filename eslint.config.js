import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: ["node_modules", "dist"],
  },
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        global: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
