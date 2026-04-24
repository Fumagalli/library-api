import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

/**
 * ESLint flat config with project conventions from CLAUDE.md
 * Enforces: atomic commits, security, code style, test requirements
 */
export default [
  js.configs.recommended,
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

      // CLAUDE.md code style rules
      "max-lines": [
        "warn",
        {
          max: 500,
          skipComments: true,
          skipBlankLines: true,
        },
      ],
      "max-depth": ["warn", 2], // Prefer early returns, max 2 levels nesting
      "max-nested-callbacks": ["warn", 2],
      complexity: ["warn", 10], // Avoid complex functions

      // Security: catch common patterns
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
    },
  },
  {
    files: ["**/*.test.js"],
    rules: {
      "import/named": "off",
      "import/no-unresolved": "off",
      "no-console": "off",
      "max-lines": "off", // Test files can be longer
      "max-depth": "off",
      "max-nested-callbacks": "off",
      complexity: "off",
    },
  },
  {
    files: ["vitest.config.js"],
    rules: {
      "import/no-unresolved": "off",
    },
  },
  {
    files: ["src/utils/logger.js", "src/app.js", "server.js"],
    rules: {
      "no-console": "off",
    },
  },
  prettier,
];
