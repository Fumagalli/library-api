# 🤖 CLAUDE.md - Library API

**Instruções duráveis para todas as conversas e agentes. Aplique sempre.**

---

## 🎯 Projeto em Uma Frase

API REST de biblioteca digital seguindo o curso Alura, com **Karpathy Guidelines + TLC Spec-Driven + Atomic Commits + Testes desde dia 1**.

**Curso:** [Node.js: API REST com Express e MongoDB](https://cursos.alura.com.br/course/node-js-api-rest-express-mongodb)

---

## 🔴 Regras Sagradas (INVIOLÁVEIS)

### 1️⃣ Testes Sempre

- **Antes de cada commit:** `npm test` DEVE passar
- Sem exceções. Zero.
- Se testes falham, não commita

### 2️⃣ Atomic Commits Obrigatório

- **Cada commit = 1 mudança lógica**
- Máximo ~50 linhas de mudança
- Se não cabe em uma tela, quebra em múltiplos commits
- Testes DEVEM passar para cada commit individual

### 3️⃣ Leia o Spec Primeiro

- **NUNCA** assuma requisitos vagos
- **SEMPRE** leia `.specs/` relevante antes de implementar
- Se ambíguo, pergunte → não chute

### 4️⃣ Security by Default

- **TODA rota POST/PUT** precisa de checklist de segurança
- Input validation com Zod é OBRIGATÓRIO
- NoSQL injection é crítico - use `ObjectId.isValid()`
- Sem exceções de segurança

### 5️⃣ Mudanças Cirúrgicas

- **Toque APENAS o necessário**
- Não refatore código adjacente
- Não "melhore" enquanto está aqui
- Cada linha editada rastreia ao requisito

### 6️⃣ Sem Skips de Qualidade

- **NUNCA** skipe hooks (--no-verify)
- **SEMPRE** rode lint + format: `npm run lint && npm run format:check`
- **SEMPRE** rode testes antes de push
- Sem shortcuts

---

## 🎯 Preferências de Desenvolvimento

### Prioridade 1: Simplicidade

- Código mínimo que resolve o problema
- **Sem** abstrações que ninguém pediu
- **Sem** "flexibilidade para o futuro"
- **Sem** tratamento de erro para cenários impossíveis

**Teste:** "Um senior diria que isso é overcomplicated?" → Se sim, reescreva.

### Prioridade 2: Testes como Verificação

- Escreva testes que reproduzem o requisito
- Testes falham ANTES de implementar
- Implementar = fazer testes passarem
- Testes são a prova de que funcionou

### Prioridade 3: Karpathy Guidelines

**Sempre aplicar:**

1. **Think** - Leia spec, identifique fase TLC
2. **Simplify** - Código mínimo, sem bloat
3. **Surgical** - Mudança cirúrgica, toque necessário
4. **Goal-Driven** - Defina sucesso, verifique antes de terminar

### Prioridade 4: TLC Spec-Driven

- **Pequeno** → EXECUTE (typo, config)
- **Médio** → SPECIFY → EXECUTE (1 rota + testes)
- **Grande** → SPECIFY → DESIGN → TASKS → EXECUTE (feature completa)

---

## 📌 Constraints do Projeto

### Fase Atual

**Learning Phase** - Seguindo curso Alura, aplicando best practices

### Stack (Definido)

- Node.js + Express.js
- Vitest (testing)
- MongoDB (database)
- Zod (validation)
- ESLint + Prettier (linting/formatting)

### Scope Atual

- [ ] Phase 1: Setup + Roteamento Básico (✅ Done)
- [ ] Phase 2: REST CRUD de Livros (🟡 Next)
- [ ] Phase 3: REST CRUD de Autores (⭕ Later)
- [ ] Phase 4: MongoDB + Persistência (⭕ Later)
- [ ] Phase 5: Buscas Avançadas + Paginação (⭕ Later)

### Fora de Escopo (Por Enquanto)

- ❌ Autenticação JWT
- ❌ Rate limiting
- ❌ Websockets
- ❌ Multi-idioma
- ❌ Docker

---

## 🚫 Nunca Faça Isto

| Situação                                  | Por quê                   | Ação                       |
| ----------------------------------------- | ------------------------- | -------------------------- |
| "Vou implementar e explicar depois"       | Spec incompleto = bugs    | Leia spec ANTES            |
| "Este commit tem 200 linhas"              | Difícil revisar/revert    | Quebra em 5+ commits       |
| "Não tenho teste, mas tenho certeza"      | Certeza mata              | Escreva teste PRIMEIRO     |
| "Melhorei código adjacente também"        | Scope creep               | Revert → mudança cirúrgica |
| "Vou fazer flexível pro futuro"           | YAGNI - você não vai usar | Código mínimo APENAS       |
| "NoSQL injection? Improvável"             | SEMPRE acontece           | ObjectId.isValid() + Zod   |
| "Testes ainda não passam, mas commitei"   | Quebra CI/CD              | Testes ANTES de commit     |
| "Vou skipar lint com --no-verify"         | Qualidade cai             | NUNCA skipe                |
| "Esqueci segurança, vou adicionar depois" | Não adiciona              | SEMPRE checklist           |
| "Preciso refatorar tudo isto"             | Refactor ≠ feature        | Apenas o pedido            |

---

## ✅ Antes de Cada Commit

**Checklist obrigatório:**

```bash
# 1. Testes passam?
npm test

# 2. Lint passa?
npm run lint

# 3. Formato passa?
npm run format:check

# 4. Se tudo ✅, então:
git commit -m "type(scope): description"
```

**Perguntas:**

- [ ] Mudança é UM conceito lógico?
- [ ] Testes passam com esta mudança?
- [ ] Posso descrever em 1 frase?
- [ ] Se reverto, apenas essa feature sai?
- [ ] Código < 50 linhas de mudança?
- [ ] Cada linha rastreia ao requisito?

---

## 🔐 Security Checklist (Copiar para POST/PUT)

**TODA rota POST/PUT:**

```markdown
- [ ] Input validation com Zod schema?
- [ ] ObjectId.isValid() para MongoDB IDs?
- [ ] Error handling seguro (sem expor stack)?
- [ ] Output protection (apenas campos públicos)?
- [ ] Teste para injection + validação?
```

---

## 🎨 Code Style Guidelines

### Code Style

- **Functions:** 4-20 linhas. Quebrar se maior.
- **Files:** Máximo 500 linhas. Dividir por responsabilidade.
- **One thing per function:** SRP (Single Responsibility Principle)
- **Names:** Específicos e únicos. Evitar `data`, `handler`, `Manager`.
  - Preferir nomes que retornam <5 grep hits no codebase
- **Types:** Explícitos. Sem `any`, sem `Dict`, sem funções sem type.
- **No code duplication:** Extrair lógica compartilhada em função/módulo
- **Early returns:** Preferir a nested ifs. Máximo 2 níveis de indentação.
- **Exception messages:** Incluir o valor recebido + formato esperado

### Comments

- **Manter comentários próprios:** Não remover em refactor — carregam intenção
- **WHY, não WHAT:** Skip `// incrementa counter` acima de `i++`
- **Docstrings em funções públicas:** Intenção + 1 exemplo de uso
- **Reference issues/commits:** Quando linha existe por bug ou constraint upstream

### Tests

- **Comando único:** `npm test` (sem variações)
- **Uma test por função nova:** Bug fixes ganham regression test
- **Mock external I/O:** API, DB, filesystem com fake classes nomeadas
- **F.I.R.S.T:** Fast, Independent, Repeatable, Self-validating, Timely

### Dependencies

- **Inject via constructor/parameter:** Não global ou import direto
- **Wrap third-party libs:** Atrás de interface owned by this project

### Structure

- **Seguir convenções do framework:** Express patterns + projeto standards
- **Prefer small focused modules:** Evitar god files
- **Predictable paths:** `src/routes`, `src/controllers`, `src/models`, etc.

### Formatting

- **Language default formatter:** `prettier` para JavaScript
- **Don't discuss style beyond that:** Prettier é lei

### Logging

- **JSON estruturado:** Para debugging/observability
- **Plain text:** Apenas para output CLI user-facing

---

## 🚀 Workflow Padrão

1. **Identifique escopo** → Pequeno? Médio? Grande? → Escolha fase TLC
2. **Leia spec** → `.specs/QUICK-START.md` se pequeno/médio, `AGENTS-GUIDELINES.md` se grande
3. **Escreva testes** → Testes que falham para o requisito
4. **Implemente** → Código mínimo que faz testes passarem
5. **Valide gates** → `npm test && npm run lint && npm run format:check`
6. **Commit atômico** → Uma mudança lógica, ~50 linhas
7. **Próxima mudança** → Novo commit (não misture)

---

## 🧪 Test-Driven Development (TDD)

**Obrigatório:** Testes ANTES de código, não depois.

### Pattern: Red → Green → Refactor

1. **🔴 Red** - Escreva teste que falha (o requisito não foi implementado)
2. **🟢 Green** - Implemente código mínimo para passar
3. **🔵 Refactor** - Melhore (testes cobrem, sem risco)

### Checklist por Feature

Antes de implementar, escreva testes para:

- [ ] Happy path (dados válidos)
- [ ] Input inválido (nulo, empty, tipo errado)
- [ ] Duplicatas (se aplicável)
- [ ] Boundary values (min, max)
- [ ] Whitespace/trim issues
- [ ] Order of operations (se stateful)

**Referência:** `.specs/TDD-CHECKLIST.md`

---

## 📝 Local PR Development Notes

### `.pr-notes/` Folder (Do Not Commit)

**Purpose:** Track review feedback, design decisions, and validation notes during PR development without cluttering the repository.

**What goes here:**

- `COPILOT_REVIEW_TRACKING.md` - Track Copilot/reviewer feedback and resolutions
- Development notes on design decisions
- Test plans and validation checklists
- Links to related issues or discussions

**Ignored by git:** Added to `.gitignore` - files here stay local.

**How to use:**

1. Create tracking file when PR gets review feedback
2. Update file as issues are resolved
3. Reference commit hashes for traceability
4. Before pushing: verify all items in tracking file are resolved
5. Delete or archive after merge

**Example workflow:**

```bash
# During review
cat .pr-notes/COPILOT_REVIEW_TRACKING.md

# Fix issues and update tracking file
git add .
git commit -m "fix(...): resolve item #3 from review"

# Before push - verify all resolved
cat .pr-notes/COPILOT_REVIEW_TRACKING.md
```

**Important:** These files are for development reference only. Use git history as the authoritative source.

---

## 📌 Última Atualização

- **Data:** 2026-04-24
- **Versão:** 1.1
- **Próximo Review:** Quando houver decisão arquitetural nova ou mudança de fase
- **Responsável:** Mantido pelo usuário
