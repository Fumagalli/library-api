# 🤖 Copilot Instructions - Library API

You are working on the **Library API** project.

---

## 🔴 Start Here: Read CLAUDE.md First

**Before doing anything else, read `CLAUDE.md` in the root of the project.**

It contains:

- 6 Sacred Rules (inviolable)
- Development preferences (4 priorities)
- Project constraints
- Security checklist (copy-paste for POST/PUT)
- Code style guidelines
- Workflow standard

**This is your source of truth for rules that never change.**

---

## ⏱️ Quick Start (3 min)

**For your first task:** Read `.specs/QUICK-START.md` - it has everything you need in 3 minutes.

**For larger tasks:** Continue with full guidelines below.

---

## ✅ Before Any Action

Read `.specs/AGENTS-GUIDELINES.md` - it contains:

- 4 Karpathy Guidelines (Think, Simplify, Surgical, Goal-Driven)
- TLC Spec-Driven Development (Specify → Design → Tasks → Execute)
- Project structure & conventions
- Security requirements (copy-paste checklist included)
- Atomic commit standards with examples
- Red flags to watch out for

## 🚀 Quick Reference

- **Stack:** Node.js + Express + Vitest + MongoDB (soon)
- **Tests must pass:** `npm test`
- **Lint must pass:** `npm run lint`
- **Format must pass:** `npm run format:check`
- **Each commit = 1 logical change** (atomic commits)

## 📚 Related Specs

- `.specs/QUICK-START.md` - **START HERE** (agents-optimized, 3 min read)
- `.specs/AGENTS-GUIDELINES.md` - Full guidelines with red flags + security checklist
- `.specs/project/PROJECT.md` - Vision & roadmap
- `.specs/codebase/CONVENTIONS.md` - Code patterns with atomic commit examples
- `.specs/codebase/SECURITY.md` - Security best practices & vulnerabilities
- `.specs/codebase/TESTING.md` - Test strategy

---

## ⏭️ When to Skip (Small Changes)

**For simple tasks, skip deep reading:**

| Task             | Read               | Skip                          |
| ---------------- | ------------------ | ----------------------------- |
| Typo/config fix  | —                  | `.specs/AGENTS-GUIDELINES.md` |
| Running tests    | Quick-Start only   | Full guidelines               |
| Simple debugging | Quick-Start only   | Design patterns               |
| Small feature    | Quick-Start + spec | TLC design phase              |

**⚠️ Always run:** `npm test` before every commit (no exceptions)

---

## 🎨 Available Skills

This project integrates these global skills for enhanced development:

### 🏗️ Core Development

- **karpathy-guidelines** - 4 principles: Think, Simplify, Surgical, Goal-Driven
  - Use: Before implementing any feature or fix
  - Reference: `.specs/AGENTS-GUIDELINES.md`

- **tlc-spec-driven** - Adaptive phases: Specify → Design → Tasks → Execute
  - Use: Planning features, implementation with verification
  - Reference: `.specs/AGENTS-GUIDELINES.md` + `.specs/project/ROADMAP.md`

- **coding-guidelines** - Best practices to reduce LLM coding mistakes
  - Use: When writing or modifying code
  - Focus: Code quality, patterns, avoiding common pitfalls

### 🔐 Quality & Safety

- **security-best-practices** - Language and framework-specific security
  - Use: When implementing POST/PUT routes
  - Reference: `.specs/codebase/SECURITY.md`
  - Checklist: Copy-paste from `.specs/AGENTS-GUIDELINES.md`

- **testing** - Vitest test execution and validation
  - Use: Running tests, coverage analysis, validation
  - Command: `npm test` (always before commit)

### 📐 Architecture & Design

- **technical-design-doc-creator** - TDD creation with discovery process
  - Use: For complex features requiring design documentation
  - Output: Structured design docs with mandatory + optional sections

### 🔍 Exploration

- **codenavi** - Codebase navigation and investigation
  - Use: When fixing bugs, implementing features in unfamiliar code
  - Approach: Investigates with precision, maintains `.notebook/` knowledge base

---

**💡 Tip:** Skills are always available. Call them explicitly when needed via chat requests like:

- "Apply karpathy-guidelines to this code"
- "Run security-best-practices review on my POST endpoint"
- "Use testing skill to validate changes"

---

**Always verify success criteria with tests before considering a task complete.**
