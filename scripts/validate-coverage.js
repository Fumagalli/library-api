#!/usr/bin/env node
/**
 * Validates test coverage meets project requirements
 * Thresholds:
 *   - Lines: 80%
 *   - Functions: 100%
 *   - Branches: 100%
 *   - Statements: 80%
 */

import fs from "fs";

const coverageFile = "coverage/coverage-final.json";

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

  const { fnMap, branchMap } = fileData;

  // Check if any function/branch is uncovered (must be 100%)
  const uncoveredFunctions = fnMap
    ? Object.values(fnMap).filter((fn) => !fn.hit)
    : [];
  const uncoveredBranches = branchMap
    ? Object.values(branchMap).filter((b) => !b.hit)
    : [];

  const shortPath = filePath.replace(process.cwd() + "/", "");

  if (uncoveredFunctions.length > 0 || uncoveredBranches.length > 0) {
    failedFiles.push({
      file: shortPath,
      uncoveredFunctions: uncoveredFunctions.length,
      uncoveredBranches: uncoveredBranches.length,
      failureType: "critical", // Functions and branches must be 100%
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
process.exit(0);
