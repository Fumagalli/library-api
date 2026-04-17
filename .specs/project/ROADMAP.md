# 🗺️ Roadmap - Library API

Detalhamento das fases do projeto com milestones e deliverables.

---

## Fase 1️⃣: Setup + Roteamento Básico (ATUAL)

**Objetivo:** Ambiente funcionando, testes passando, estrutura estabelecida.

**Segurança:** Headers de segurança com Helmet, estrutura de validação pronta

### Milestones

- [x] Projeto criado
- [x] ESLint + Prettier configurados
- [x] **Testes básicos** (Vitest/Jest)
- [x] Servidor HTTP escutando em porta configurável
- [x] Rotas GET básicas (`/`, `/livros`, `/autores`)
- [x] Todos os testes passando
- [x] Lint e format passando
- [ ] **Security checklist documentado** (`.specs/codebase/SECURITY.md`)

---

## Fase 2️⃣: Estrutura REST de Livros

**Objetivo:** CRUD completo para livros com mocking inicial.

**Segurança:** Validação (Zod) + sanitização + error handling + testes de injeção

### Features

- [ ] Rota GET `/livros` - listar todos
- [ ] Rota GET `/livros/:id` - buscar por ID
- [ ] Rota POST `/livros` - criar novo **com validação**
- [ ] Rota PUT `/livros/:id` - atualizar **com validação**
- [ ] Rota DELETE `/livros/:id` - deletar
- [ ] **Input validation (Zod schema)**
- [ ] **Sanitização de dados**
- [ ] Resposta JSON estruturada **apenas campos públicos**
- [ ] **Error handling seguro** (sem expor detalhes)
- [ ] **Testes de segurança** (injeção, validation)

### Testes Esperados

- Retorna 200 para requisição válida
- Retorna 404 para livro não encontrado
- Retorna 400 para dados inválidos
- **Rejeita NoSQL injection**
- **Rejeita campos extras**
- **Não expõe campos internos**
- POST cria e retorna ID
- DELETE remove livro

### ✅ Definition of Done (Fase 2)

- [ ] Todas as 5 rotas CRUD implementadas
- [ ] 100% dos testes passam (`npm test`)
- [ ] Nenhuma mudança fora do escopo (Surgical changes)
- [ ] Validação de input com Zod
- [ ] Sanitização de dados
- [ ] Error handling sem expor detalhes internos
- [ ] Coverage ≥ 80%
- [ ] Lint passa (`npm run lint`)
- [ ] Format passa (`npm run format:check`)
- [ ] Commits são atômicos (~50 linhas cada)
- [ ] Cada linha editada rastreia ao requisito

---

## Fase 3️⃣: Estrutura REST de Autores

**Objetivo:** CRUD para autores, espelhando livros.

**Segurança:** Mesmos padrões da Fase 2

- [ ] Rotas CRUD de autores (GET, POST, PUT, DELETE)
- [ ] Validação com Zod (similar a livros)
- [ ] Testes paralelos aos de livros **incluindo segurança**

---

## Fase 4️⃣: MongoDB + Persistência + Design Doc

**Objetivo:** Dados saem do mock e vão para DB real.

**Skills:** `security-best-practices` + **`technical-design-doc-creator`** (novo)

**Segurança:** ObjectId para prevenir injeção, prepared queries

- [ ] Criar schema de Livro
- [ ] Criar schema de Autor
- [ ] Conectar ao MongoDB
- [ ] Migrar rotas para usar DB
- [ ] Testes apontam para BD de teste
- [ ] **Design doc criado** (`.specs/features/mongodb-integration/design.md`)

**Quando aplicar `technical-design-doc-creator`:**

1. Antes de implementar integração com MongoDB
2. Documente decisões:
   - Schema design (normalização vs embedded?)
   - Relacionamentos (referências vs dados duplicados?)
   - Índices (quais campos indexar?)
   - Validação no DB vs aplicação?
3. Use para rastreabilidade (por quê cada decisão foi feita?)

---

## Fase 5️⃣: Buscas Avançadas

**Objetivo:** Querying sofisticado.

- [ ] Buscar por título (texto)
- [ ] Buscar por autor
- [ ] Buscar por ano
- [ ] Filtros combinados
- [ ] Paginação (limit, skip)
- [ ] Ordenação (sort)

---

## Fase 6️⃣: Validação + Erros

**Objetivo:** Tratamento robusto.

- [ ] Validação com Joi ou Zod
- [ ] Middleware de erro global
- [ ] Mensagens de erro padronizadas
- [ ] HTTP status codes corretos
- [ ] Logging

---

## 📊 Status Atual

- **Fase:** 1️⃣ (Setup)
- **Progresso:** ~40% (ambiente setup, faltam testes)
- **Bloqueadores:** Nenhum
- **Próximo:** Implementar testes básicos

---

**Atualizado:** 2026-04-17
