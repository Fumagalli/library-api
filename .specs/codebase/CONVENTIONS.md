# 📏 Code Conventions - Library API

Padrões de código para manter consistência e qualidade.

---

## Estrutura de Pastas

```
library-api/
├── .specs/                 # Documentação e specs
├── src/
│   ├── routes/            # Rotas da API
│   ├── controllers/        # Lógica das requisições
│   ├── models/            # Schemas MongoDB
│   ├── middleware/        # Middlewares Express
│   ├── utils/             # Utilitários
│   └── index.js           # Entrada da app
├── tests/                 # Arquivos de teste
├── server.js              # Entry point
├── package.json
├── eslint.config.js
├── tsconfig.json
└── README.md
```

---

## Convenções de Código

### Imports

```javascript
// ✅ Agrupados e ordenados
import http from "http";
import path from "path";
import express from "express";
```

### Nomes

- **Variáveis/Funções:** `camelCase`
- **Classes:** `PascalCase`
- **Constantes:** `UPPER_SNAKE_CASE`
- **Arquivos:** `kebab-case.js` (ou `PascalCase.js` para classes)

```javascript
// ✅ Bom
const MAX_RETRIES = 3;
function getUserById(id) {}
class DatabaseConnection {}

// ❌ Ruim
const max_retries = 3;
function get_user_by_id(id) {}
class databaseConnection {}
```

### Funções

- Máximo 20 linhas por função (senão quebra em menores)
- Máximo 3 parâmetros (senão use objeto)
- Use arrow functions para callbacks

```javascript
// ✅ Bom - simples, focado
const handleRequest = (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  res.json(book || { error: "Not found" });
};

// ❌ Ruim - muito lógica, sem tratamento
const handleRequest = (req, res) => {
  // 50 linhas de lógica misturada
};
```

### Objetos

```javascript
// ✅ Usa objetos para múltiplos parâmetros
function createBook({ title, author, year }) {}

// ❌ Evita muitos parâmetros
function createBook(title, author, year, isbn, pages, language) {}
```

### Tratamento de Erros

```javascript
// ✅ Estruturado
try {
  // lógica
} catch (error) {
  console.error("Context:", error.message);
  res.status(500).json({ error: "Internal server error" });
}

// ❌ Silencioso
try {
  // lógica
} catch (e) {
  // nada?
}
```

---

## Simplicity-First Checklist

**Antes de implementar, verifique:**

- [ ] Há abstração que ninguém pediu?
- [ ] Há tratamento de erro para cenários impossíveis?
- [ ] Posso remover 50% do código mantendo funcionalidade?
- [ ] Usei design patterns que justificam sua complexidade?
- [ ] A função tem mais de 20 linhas? (quebrar em menores)
- [ ] Há mais de 3 parâmetros? (usar objeto)
- [ ] Posso simplificar lógica condicional?

**Teste mental:** "Um senior diria que isso é overcomplicated?" → Se sim, reescreva.

---

## Resposta JSON

```javascript
// ✅ Estrutura consistente
{
  "success": true,
  "data": { /* payload */ },
  "message": "Optional message"
}

// Erro
{
  "success": false,
  "error": "Specific error message",
  "statusCode": 400
}
```

---

## Testes

```javascript
// ✅ Padrão AAA (Arrange, Act, Assert)
describe("GET /livros/:id", () => {
  it("should return book when found", () => {
    // Arrange
    const bookId = 1;

    // Act
    const response = request.get(`/livros/${bookId}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});
```

---

## Eslint + Prettier

Rodará automaticamente antes de commits. Respeite:

```javascript
// ✅ Espaçamento
const obj = { a: 1, b: 2 };
const arr = [1, 2, 3];

// Linha máxima: 100 caracteres
// Semicolons: obrigatório
// Aspas: simples (')
```

**Rodando manual:**

```bash
npm run lint        # Verificar
npm run lint:fix    # Corrigir automático
npm run format      # Prettier
```

---

## Commits

### Padrão: Conventional Commits

```
type(scope): description

[optional body]
[optional footer]
```

**Tipos:**

- `feat:` nova feature
- `fix:` bug fix
- `test:` testes
- `docs:` documentação
- `refactor:` refatoração (sem mudança funcional)
- `chore:` setup, dependências

**Exemplos:**

```
feat(routes): add GET /livros/:id endpoint
fix(server): handle missing port gracefully
test(routes): add tests for book endpoints
docs(readme): update setup instructions
```

---

## Atomic Commits ⚛️

**Cada commit deve ser PEQUENO e INDEPENDENTE.**

Um commit atômico:

- ✅ Representa UMA mudança lógica completa
- ✅ Pode ser revertido sem quebrar outras features
- ✅ Tem testes passando antes e depois
- ✅ Cabe em uma tela (~50 linhas máximo)

### ❌ Commits Ruins

```
# Muito grande (múltiplas lógicas)
feat: add books CRUD and search and pagination and validation

# Incompleto (quebra tests)
feat(routes): add POST /livros (tests failing)

# Mistura responsabilidades
feat(routes): add GET /livros AND refactor server.js AND update docs
```

### ✅ Commits Bons

```
# Completo e focado
feat(routes): add GET /livros endpoint
test(routes): add tests for GET /livros
fix(server): handle 404 for undefined routes
docs(readme): update API endpoints documentation
```

### Workflow Atômico

1. **Implemente uma mudança pequena**

   ```javascript
   // Adicione APENAS a rota GET /livros
   app.get('/livros', (req, res) => { ... });
   ```

2. **Escreva testes para essa mudança**

   ```javascript
   test('GET /livros should return books', () => { ... });
   ```

3. **Verifique gates passam**

   ```bash
   npm test && npm run lint && npm run format
   ```

4. **Commite (atomicamente)**

   ```bash
   git add server.js server.test.js
   git commit -m "feat(routes): add GET /livros endpoint"
   ```

5. **Próxima mudança lógica = novo commit**
   ```bash
   # Agora: adicione POST /livros
   # (NOVO COMMIT - não misture com GET)
   git commit -m "feat(routes): add POST /livros endpoint"
   ```

### Checklist Antes de Commitar

- [ ] Mudança representa UM conceito lógico?
- [ ] Testes passam?
- [ ] Lint e format passam?
- [ ] Posso descrever em 1 frase?
- [ ] Se reverto, apenas essa feature é removida?
- [ ] Código < 50 linhas de mudança?

### Exemplo: Fase 2 (REST Livros)

❌ **Errado - 1 mega commit:**

```bash
git add . && git commit -m "feat(livros): add CRUD"
# Dentro: routes + controllers + models + tests + docs
```

✅ **Correto - 5 commits atômicos:**

```bash
# 1. Setup - testes que falham
git commit -m "test(livros): add tests for CRUD endpoints"

# 2. GET - implementar e passar
git commit -m "feat(livros): add GET /livros"

# 3. POST - implementar e passar
git commit -m "feat(livros): add POST /livros"

# 4. PUT - implementar e passar
git commit -m "feat(livros): add PUT /livros/:id"

# 5. DELETE - implementar e passar
git commit -m "feat(livros): add DELETE /livros/:id"
```

### Benefícios

| Benefício           | Por quê                           |
| ------------------- | --------------------------------- |
| **Fácil review**    | Cada PR é pequeno, focar é fácil  |
| **Fácil revert**    | Se erro, remove só aquela mudança |
| **Histórico limpo** | Git log é legível                 |
| **Bisect rápido**   | Localizar bug é mais fácil        |
| **Feature flags**   | Ativa/desativa por commit         |
| **Merge conflicts** | Menos conflitos                   |

---

**Última atualização:** 2026-04-17
