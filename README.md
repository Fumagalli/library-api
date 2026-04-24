# 📚 Library API

API REST para gerenciamento de biblioteca digital - Seguindo curso Alura de Node.js + Express + MongoDB.

## ✨ Status

**Fase 1 ✅ Concluída:** Setup + Roteamento básico com testes.

Todos os gates passando:

- ✅ Testes: 5/5 passando (Vitest)
- ✅ Lint: 0 errors, 0 warnings (ESLint)
- ✅ Format: Prettier OK

---

## 🚀 Quick Start

### Instalação

```bash
npm install
```

### Rodar Servidor

```bash
npm run dev
```

Servidor escutando em `http://localhost:3000`

### Rodar Testes

```bash
npm test              # Run once
npm test:watch        # Watch mode
npm test:coverage     # Coverage report
```

### Code Quality

```bash
npm run lint          # Check ESLint
npm run lint:fix      # Fix auto-fixable
npm run format        # Format with Prettier
npm run format:check  # Check formatting
```

---

## 📋 Rotas Atuais

| Método | Rota             | Status                              |
| ------ | ---------------- | ----------------------------------- |
| GET    | `/`              | ✅ Retorna welcome message          |
| GET    | `/livros`        | ✅ Retorna lista de livros (vazia)  |
| GET    | `/autores`       | ✅ Retorna lista de autores (vazia) |
| GET    | `/*` (undefined) | ✅ Retorna 404                      |

### Formato de Resposta

```json
{
  "success": true,
  "data": {
    "message": "...",
    "books": []
  }
}
```

Erro (404):

```json
{
  "success": false,
  "error": "Route not found"
}
```

---

## 🛠️ Desenvolvimento

### 📌 Diretrizes Obrigatórias

Todas as ações **DEVEM** seguir:

1. **Karpathy Guidelines** (4 princípios: Think, Simplify, Surgical, Goal-Driven)
   - Leia: `.specs/AGENTS-GUIDELINES.md`
2. **TLC Spec-Driven** (Specify → Design → Tasks → Execute)
   - Fases adaptativas com verificação contínua
3. **Code Conventions** (Style + anti-patterns)
   - Leia: `.specs/codebase/CONVENTIONS.md`
4. **Security by Default** (Validação, sanitização, proteção)
   - Leia: `.specs/codebase/SECURITY.md`
5. **Testing Strategy** (cobertura ≥80%)
   - Leia: `.specs/codebase/TESTING.md`

Consulte a seção **Diretrizes Obrigatórias** acima para links aos padrões específicos.

### Estrutura de Especificações

```
.specs/
├── AGENTS-GUIDELINES.md    # Como agentes devem agir neste projeto
├── project/
│   ├── PROJECT.md          # Visão & escopo
│   ├── ROADMAP.md          # Fases & milestones
│   └── STATE.md            # Decisões & aprendizados
├── codebase/
│   ├── CONVENTIONS.md      # Padrões de código
│   └── TESTING.md          # Estratégia de testes
└── features/               # Specs de cada feature
```

### Próximas Features

1. **Fase 2:** Estrutura REST de Livros (CRUD + testes)
2. **Fase 3:** Estrutura REST de Autores (CRUD + testes)
3. **Fase 4:** MongoDB + persistência
4. **Fase 5:** Buscas avançadas (filtros, paginação, sort)
5. **Fase 6:** Validação robusto + erros

---

## 🛠️ Development Stack

### Runtime & Framework

- **Node.js:** >= 20.19.0 (with ES modules)
- **Express.js:** 5.2.1 (REST API framework)

### Quality & Testing

- **Test Runner:** Vitest 4.1.4 with v8 coverage
- **Coverage Targets:** 100% functions/branches, 80% lines
- **Linter:** ESLint 9.0.0 (code quality)
- **Formatter:** Prettier 3.8.3 (code style)

### Git & CI/CD

- **Git Hooks:** Husky 9.1.7 + lint-staged
  - **Pre-commit:** ESLint + Prettier + Tests + Coverage
  - **Pre-push:** Coverage validation
  - **Commit-msg:** Commitlint message validation
- **CI Pipeline:** GitHub Actions (push/PR validation)
- **Commit Format:** `type(scope): description` (enforced)

### Data & Validation

- **Database:** MongoDB (via Mongoose 9.4.1)
- **Validation:** Zod 4.3.6 (schema validation)
- **Environment:** dotenv 17.4.2

### Development Tools

- **Dev Server:** Nodemon 3.1.14 (auto-reload)
- **Package Manager:** npm (with CI via `npm ci`)

---

## 📖 Baseado Em

[Curso Alura: Node.js - API REST com Express e MongoDB](https://cursos.alura.com.br/course/node-js-api-rest-express-mongodb)

**O que será aprendido:**

- Criar API do zero seguindo REST
- Como requisições HTTP funcionam
- Framework Express
- Conectar com MongoDB
- Buscas por campos específicos

---

## 🤖 Agent Instructions

Se você é um agente trabalhando neste projeto:

1. **Leia primeiro:** `.specs/AGENTS-GUIDELINES.md`
2. **Antes de agir:** Identifique a fase TLC
3. **Ao implementar:** Siga Karpathy Guidelines + Verifique com testes
4. **Ao terminar:** Todos os gates devem passar

```bash
npm test && npm run lint && npm run format:check
```

---

## 📝 Anotações

- Todas as mudanças DEVEM ter testes passando
- Lint e format DEVEM passar antes de commit
- Nenhuma mudança especulativa ou "enquanto você estava aqui"
- Cada linha de código deve rastrear direto ao requisito

---

**Última atualização:** 2026-04-17
