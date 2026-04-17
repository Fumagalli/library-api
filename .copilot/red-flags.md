# 🔴 Red Flags - Stop & Reconsider

**If you see these patterns, STOP before continuing.**

---

| Flag                                        | Action                                                        |
| ------------------------------------------- | ------------------------------------------------------------- |
| "I'll implement and explain later"          | 🛑 STOP → Read the spec first                                 |
| "This is similar to X, I'll reuse it"       | ❓ Ask: Do we need real reuse?                                |
| "I improved adjacent code too"              | 🛑 UNDO → Surgical changes only                               |
| "I found a bug while here"                  | 📝 Document in `.specs/project/STATE.md` → Don't touch it now |
| "I don't have tests, but I'm sure it works" | 🛑 STOP → Write tests first                                   |
| "I'll add this just for safety"             | ❓ Ask: Was it requested? If no, remove it                    |
| "I'll commit everything together"           | 🛑 STOP → Atomic commits! Break into 3+ commits               |
| "This commit has 200 lines changed"         | 🛑 STOP → Too big. Break into smaller commits                 |

---

## 💡 What This Means

Each red flag indicates **scope creep**, **assumed requirements**, or **non-atomic changes**.

**The test:**

- Can someone understand this commit by looking at git log + diff?
- Can you revert it safely without breaking other features?
- Does every line trace to a requirement?

If answer is "no" → Revisit your approach.

---

**Full context:** See `.specs/AGENTS-GUIDELINES.md`
