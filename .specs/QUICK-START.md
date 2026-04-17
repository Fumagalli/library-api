# 🚀 Quick Start for Agents - Library API

**Leia isso em 3 minutos antes de começar qualquer tarefa.**

---

## 🎯 Essential Context

| Chave       | Valor                                       |
| ----------- | ------------------------------------------- |
| **Stack**   | Node.js + Express + Vitest                  |
| **Phase**   | 2 (REST CRUD Livros)                        |
| **Pattern** | Karpathy + TLC Spec-Driven + Atomic Commits |
| **Tests**   | `npm test` (ANTES de cada commit)           |
| **Lint**    | `npm run lint && npm run format:check`      |

---

## 📚 First Read (in order - 3 docs)

1. **Este arquivo** (2 min) ← You are here
2. **[AGENTS-GUIDELINES.md](AGENTS-GUIDELINES.md)** → Red flags + security checklist (3 min)
3. **[.specs/codebase/SECURITY.md](codebase/SECURITY.md)** → Checklist copy-paste (2 min)

**Não leia mais que isso.** Outros docs são referência conforme necessário.

---

## 🔑 4 Core Principles (Karpathy Guidelines)

### 1️⃣ Think Before Coding

- Leia o spec primeiro
- Identifique a fase TLC (Specify? Design? Tasks? Execute?)
- Pergunte se tiver dúvida

### 2️⃣ Simplicity First

- Código mínimo que resolve o problema
- Sem abstrações que ninguém pediu
- Sem "flexibilidade para o futuro"

### 3️⃣ Surgical Changes

- Toque APENAS o necessário
- Não refatore código adjacente
- Cada linha editada rastreia ao requisito

### 4️⃣ Goal-Driven Execution

- Defina sucesso com testes
- Verifique antes de terminar
- Red flags → PARE

---

## 🔐 Security Checklist (copiar para POST/PUT)

```markdown
- [ ] Validação de entrada (Zod schema)?
- [ ] Sanitização de dados (sem injection)?
- [ ] Error handling seguro (sem expor detalhes)?
- [ ] Output protection (retorna apenas public fields)?
- [ ] Teste para injeção/validação?
```

**Referência completa:** `.specs/codebase/SECURITY.md`

---

## 🔴 Red Flags (PARE se ver uma dessas)

| Flag                                 | Ação                      |
| ------------------------------------ | ------------------------- |
| "Vou implementar e explicar depois"  | 🛑 Leia spec primeiro     |
| "Melhorei código adjacente também"   | 🛑 Cirurgical changes     |
| "Este commit tem 200 linhas"         | 🛑 Muito grande → quebrar |
| "Não tenho teste, mas tenho certeza" | 🛑 Escrever testes        |
| "Vou commitar tudo junto"            | 🛑 Atomic commits!        |

**Detalhes:** Ver tabela em [AGENTS-GUIDELINES.md](AGENTS-GUIDELINES.md#-red-flags-pare-se-ver)

---

## 📁 Where to Find Things

```
src/
├── routes/        # Rotas (GET, POST, PUT, DELETE)
├── controllers/   # Lógica
├── models/        # Schemas MongoDB
├── middleware/    # Express middlewares
└── utils/         # Helpers

tests/
├── unit/          # Testes unitários
├── integration/   # Testes HTTP (vitest)
└── fixtures/      # Mock data

.specs/
├── project/       # Visão, roadmap, state
├── codebase/      # Padrões, segurança, testes
└── features/      # Specs de features
```

---

## ✅ Before Every Commit

```bash
# 1. Run tests
npm test

# 2. Run lint + format
npm run lint && npm run format:check

# 3. Verify gates pass (all should be ✅)

# 4. Commit (atomic = 1 logical change)
git commit -m "feat(scope): description"

# 5. Push
git push
```

---

## 📖 Conventional Commits (padrão deste projeto)

```
type(scope): description
```

**Tipos:**

- `feat:` nova feature
- `fix:` bug fix
- `test:` testes
- `docs:` documentação
- `refactor:` refatoração

**Exemplos:**

```
feat(routes): add GET /livros endpoint
test(routes): add tests for GET /livros
fix(server): handle 404 correctly
```

**Regra de ouro:** Cada commit = 1 mudança lógica (~50 linhas max)

---

## 🎯 TLC Spec-Driven Development

### Adapt by scope:

| Escopo       | Pipeline                           | Exemplo                   |
| ------------ | ---------------------------------- | ------------------------- |
| **Pequeno**  | EXECUTE                            | Typo fix, config update   |
| **Médio**    | SPECIFY → EXECUTE                  | 1 rota + testes           |
| **Grande**   | SPECIFY → DESIGN → TASKS → EXECUTE | Feature completa          |
| **Complexo** | Tudo + perguntas                   | Ambiguidade, novo domínio |

**Sempre verifique testes passam ao final de cada fase.**

---

## 📚 Related Documentation

Full references when you need details:

- `.specs/AGENTS-GUIDELINES.md` - Completo: 4 guidelines + red flags + templates
- `.specs/codebase/CONVENTIONS.md` - Code patterns + atomic commits exemplos
- `.specs/codebase/SECURITY.md` - Vulnerabilidades críticas + padrões
- `.specs/codebase/TESTING.md` - Estratégia de testes com exemplos
- `.specs/project/PROJECT.md` - Visão, goals, roadmap
- `.specs/project/ROADMAP.md` - Phases e milestones
- `.specs/project/STATE.md` - Decisões, bloqueadores, aprendizados

---

## 🚀 Next Steps

**You're ready!**

1. Pick a task from `.specs/project/ROADMAP.md`
2. Read the feature spec in `.specs/features/[feature-name]/spec.md`
3. Apply the 4 Karpathy principles + TLC
4. Write tests → make pass → commit atomically
5. Run gates before pushing

---

**Last updated:** 2026-04-17
**Version:** 1.0 (Agents-optimized)
