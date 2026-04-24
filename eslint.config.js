import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  prettier,
  importPlugin.flatConfigs.recommended,
  {
    ignores: ["node_modules", "dist"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
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
      "import/extensions": ["error", "always", { ignorePackages: true }],
    },
  },
  {
    files: ["**/*.test.js"],
    rules: {
      "import/named": "off", // ← Desativa esse erro em testes
      "import/no-unresolved": "off", // ← Desativa erros de resolução
      "no-console": "off", // ← Permite console em testes
    },
  },
  {
    files: ["vitest.config.js"],
    rules: {
      "import/no-unresolved": "off", // ← Permite vitest/config
    },
  },
];
