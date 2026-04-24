#!/usr/bin/env node
/**
 * Validates test coverage meets project requirements
 * Thresholds:
 *   - Functions: 100% (except bootstrap files)
 *   - Branches: 100% (except error handlers and middleware)
 */

import fs from "fs";
import path from "path";

const coverageFile = "coverage/coverage-final.json";

// Files excluded from 100% coverage requirement
// - Bootstrap files (can't be fully tested without complex mocking)
const COVERAGE_EXCLUSIONS = [
  "server.js", // Bootstrap - initializes the app, not testable via vitest
];

if (!fs.existsSync(coverageFile)) {
  console.error("❌ Coverage report not found. Run: npm run test:coverage");
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, "utf8"));

// Files that fail coverage thresholds
const failedFiles = [];

for (const [filePath, fileData] of Object.entries(coverage)) {
  // Skip node_modules and test files
  if (filePath.includes("node_modules") || filePath.includes(".test.js")) {
    continue;
  }

  // Check if file is in exclusion list
  const shortPath = filePath.replace(process.cwd() + path.sep, "");
  const isExcluded = COVERAGE_EXCLUSIONS.some((pattern) =>
    shortPath.endsWith(pattern)
  );

  if (isExcluded) {
    continue;
  }

  const { fnMap, branchMap, f, b } = fileData;

  // Check if any function/branch is uncovered (must be 100%)
  // v8 coverage format: f and b are objects where key is index and value is hit count
  const uncoveredFunctions =
    fnMap && f
      ? Object.entries(fnMap)
          .filter(([index]) => !f[index] || f[index] === 0)
          .map(([, fn]) => fn)
      : [];

  const uncoveredBranches =
    branchMap && b
      ? Object.entries(branchMap)
          .filter(([index]) => {
            const branchHits = b[index];
            if (!Array.isArray(branchHits)) return false;
            // A branch is uncovered if any location has 0 hits
            return branchHits.some((hits) => hits === 0);
          })
          .map(([, branch]) => branch)
      : [];

  if (uncoveredFunctions.length > 0 || uncoveredBranches.length > 0) {
    failedFiles.push({
      file: shortPath,
      uncoveredFunctions: uncoveredFunctions.length,
      uncoveredBranches: uncoveredBranches.length,
    });
  }
}

if (failedFiles.length > 0) {
  console.error("\n❌ COVERAGE VALIDATION FAILED\n");
  console.error(
    "The following files do NOT meet 100% function/branch coverage:\n"
  );

  failedFiles.forEach((item) => {
    console.error(`  📄 ${item.file}`);
    if (item.uncoveredFunctions > 0)
      console.error(
        `     - ${item.uncoveredFunctions} uncovered function(s) ⚠️`
      );
    if (item.uncoveredBranches > 0)
      console.error(`     - ${item.uncoveredBranches} uncovered branch(es) ⚠️`);
  });

  console.error("\n💡 TDD Reminder: Write tests BEFORE implementing code\n");
  console.error("   Functions & Branches: 100% (all paths must be tested)\n");
  console.error("   Lines & Statements: 80% (realistic threshold)\n");
  process.exit(1);
}

console.log("✅ All files meet coverage requirements!");
console.log("   ✓ 100% function coverage");
console.log("   ✓ 100% branch coverage");
console.log(`\n   Excluded from 100%: ${COVERAGE_EXCLUSIONS.join(", ")}`);
console.log("   (Bootstrap & middleware files - see script comments)\n");
process.exit(0);
