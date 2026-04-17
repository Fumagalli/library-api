# ✅ Pre-Commit Checklist

**Copy-paste this before every commit.**

---

## 🧪 Tests & Code Quality

- [ ] `npm test` - All tests passing?
- [ ] `npm run lint` - No lint errors?
- [ ] `npm run format:check` - Code formatted?

---

## 📝 Commit Message

- [ ] Clear and traceable message? (e.g., `feat(routes): add GET /livros`)
- [ ] Follows format: `type(scope): description`

---

## 🎯 Code Changes

- [ ] Each line edited traces back to requirement?
- [ ] No "while you were here" changes?
- [ ] No improved adjacent code?
- [ ] Only removed orphaned imports/functions?

---

## ⚛️ Atomic Commits

- [ ] Commit is ONE logical change? (~50 lines max)
- [ ] Can be reverted independently?
- [ ] Tests pass before AND after?

---

## 🔐 Security Check (for POST/PUT routes only)

- [ ] Input validation (Zod schema)?
- [ ] Data sanitization?
- [ ] Safe error handling (no details leaked)?
- [ ] Output protection (public fields only)?
- [ ] Test for injection/validation?

---

**Full details:** See `.specs/AGENTS-GUIDELINES.md` and `.specs/codebase/SECURITY.md`
