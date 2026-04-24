#!/usr/bin/env node
/**
 * Lint script: Detect generic variable/function/class names
 * Usage: node scripts/check-generic-names.js
 *
 * Helps enforce CLAUDE.md guideline:
 * "Names: Específicos e únicos. Evitar `data`, `handler`, `Manager`."
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

const GENERIC_PATTERNS = {
  // Variables (case-insensitive for declarations)
  "\\bdata\\b": {
    message: "Generic name 'data'. Use specific: books, user, payload, etc",
    severity: "error",
  },
  "\\btemp\\b": {
    message: "Use descriptive name instead of 'temp'",
    severity: "warn",
  },
  "\\btmp\\b": {
    message: "Use descriptive name instead of 'tmp'",
    severity: "warn",
  },
  "\\bobj\\b": {
    message: "Use specific name instead of 'obj' (book, user, config, etc)",
    severity: "error",
  },
  "\\butils\\b": {
    message: "Avoid generic 'utils'. Import specific functions",
    severity: "warn",
  },
  "\\butil\\b": {
    message: "Avoid generic 'util'. Import specific functions",
    severity: "warn",
  },
  "\\bhelper\\b": {
    message: "Avoid 'helper'. Use verb-based name (validate, format, parse)",
    severity: "warn",
  },
  "\\bHandler\\b": {
    message:
      "Generic suffix. Use specific (BookController, CreateBookHandler, etc)",
    severity: "error",
  },
  "\\bManager\\b": {
    message: "Generic suffix. Use specific (BookRepository, ConfigStore, etc)",
    severity: "error",
  },
  "\\bService[^a-z]": {
    message:
      "Generic suffix. Use Repository/Controller or specific name (BookStore)",
    severity: "warn",
  },
};

// Exclude patterns (don't flag in these contexts)
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /dist/,
  /.test.js$/,
  /.spec.js$/,
  /mock/i,
  /fixture/i,
];

function isExcluded(filePath) {
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(filePath));
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const issues = [];

  lines.forEach((line, lineNum) => {
    // Skip comment-only lines and strings
    if (line.trim().startsWith("//")) return;
    if (line.trim().startsWith("*")) return; // JSDoc/block comments
    if (line.trim().startsWith("/*")) return;

    // Remove inline comments for pattern matching
    let codeOnly = line.split("//")[0];

    // Skip if entire line is a string literal or in quotes
    if (codeOnly.includes('"') || codeOnly.includes("'")) {
      // Only check outside of string literals
      codeOnly = codeOnly.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    }

    Object.entries(GENERIC_PATTERNS).forEach(([pattern, rule]) => {
      const regex = new RegExp(pattern, "g");
      let match;

      while ((match = regex.exec(codeOnly)) !== null) {
        // Skip if it's inside a string/comment marker
        if (
          codeOnly[match.index - 1] === '"' ||
          codeOnly[match.index - 1] === "'"
        ) {
          return;
        }

        // Skip `.data` (property access from Zod validation results)
        if (
          rule.message.includes("Generic name 'data'") &&
          codeOnly[match.index - 1] === "."
        ) {
          return;
        }

        // Skip `{ data:` (destructuring from Zod validation)
        if (
          rule.message.includes("Generic name 'data'") &&
          codeOnly[match.index + 4] === ":"
        ) {
          return;
        }

        issues.push({
          file: filePath,
          line: lineNum + 1,
          column: match.index + 1,
          message: rule.message,
          severity: rule.severity,
          name: match[0],
        });
      }
    });
  });

  return issues;
}

function walkDir(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!isExcluded(fullPath)) {
        files.push(...walkDir(fullPath));
      }
    } else if (entry.name.endsWith(".js") && !isExcluded(fullPath)) {
      files.push(fullPath);
    }
  });

  return files;
}

function main() {
  console.log(
    "🔍 Checking for generic names (data, handler, Manager, etc)...\n"
  );

  const files = walkDir(projectRoot).filter(
    (f) => !f.includes("node_modules") && !f.includes(".git")
  );

  let totalIssues = 0;
  let errorCount = 0;
  let warnCount = 0;

  files.forEach((file) => {
    const issues = checkFile(file);
    if (issues.length === 0) return;

    const relPath = path.relative(projectRoot, file);
    console.log(`\n📄 ${relPath}`);

    issues.forEach((issue) => {
      const icon = issue.severity === "error" ? "❌" : "⚠️";
      console.log(
        `  ${icon} Line ${issue.line}: ${issue.message} (found: '${issue.name}')`
      );

      if (issue.severity === "error") errorCount++;
      else warnCount++;
    });

    totalIssues += issues.length;
  });

  console.log("\n" + "=".repeat(60));
  if (totalIssues === 0) {
    console.log("✅ No generic names found!");
    process.exit(0);
  }

  console.log(
    `Found ${totalIssues} issues: ${errorCount} errors, ${warnCount} warnings`
  );
  console.log("=".repeat(60));

  if (errorCount > 0) {
    process.exit(1);
  }
}

main();
