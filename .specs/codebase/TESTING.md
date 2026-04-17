# 🧪 Testing Strategy - Library API

Guia de testes para garantir qualidade.

---

## Framework

- **Framework:** Vitest
- **Padrão:** AAA (Arrange, Act, Assert)
- **Coverage mínimo:** 80%
- **Rodar antes de:** commits, push, merge

---

## Estrutura de Testes

```
tests/
├── unit/              # Testes unitários
│   └── routes.test.js
├── integration/       # Testes de integração
│   └── server.test.js
└── fixtures/         # Dados de teste
    └── books.json
```

---

## Tipos de Teste

### 1. Testes Unitários

Testam função/módulo isolado.

```javascript
// ✅ Bom
describe("Helpers", () => {
  it("should format book response", () => {
    const book = { id: 1, title: "Test" };
    const formatted = formatBook(book);
    expect(formatted.title).toBe("Test");
  });
});
```

### 2. Testes de Integração

Testam fluxo completo HTTP.

```javascript
// ✅ Bom
describe("GET /livros/:id", () => {
  it("should return book and 200 when found", async () => {
    const res = await request(app).get("/livros/1").expect(200);

    expect(res.body.success).toBe(true);
  });

  it("should return 404 when book not found", async () => {
    const res = await request(app).get("/livros/999").expect(404);

    expect(res.body.success).toBe(false);
  });
});
```

### 3. Testes de Segurança (Obrigatório em toda rota POST/PUT!)

Testam validação, injeção, e proteção de dados.

**Referência completa:** Veja `./SECURITY.md` para guia detalhado de segurança e padrões.

```javascript
// ✅ NoSQL Injection
describe("Security - NoSQL Injection", () => {
  it("should reject injection in GET /livros/:id", async () => {
    const maliciousId = JSON.stringify({ $gt: "" });
    const res = await request(app).get(`/livros/${maliciousId}`).expect(400);
  });
});

// ✅ Input Validation
describe("Security - Input Validation", () => {
  it("should reject POST without required field", async () => {
    const res = await request(app)
      .post("/livros")
      .send({ author: "Test" })
      .expect(400);
  });

  it("should reject extra fields", async () => {
    const res = await request(app)
      .post("/livros")
      .send({
        title: "Test",
        _internal: "hack",
      })
      .expect(400);
  });
});

// ✅ Output Protection
describe("Security - Output Protection", () => {
  it("should not expose internal fields", async () => {
    const res = await request(app).get("/livros/1").expect(200);

    expect(res.body.data).not.toHaveProperty("_internalId");
  });
});

// ✅ Error Handling
describe("Security - Error Handling", () => {
  it("should not expose stack trace", async () => {
    const res = await request(app).get("/invalid").expect(404);

    expect(res.body.error).not.toContain("stack");
  });
});
```

**Checklist de Segurança para cada rota POST/PUT:**

- [ ] Teste de validação (rejeita dados inválidos)?
- [ ] Teste de injeção (NoSQL, HTML)?
- [ ] Teste de campos extras (rejeita)?
- [ ] Teste de output (não expõe internals)?
- [ ] Teste de erro (mensagem genérica)?

---

## Padrão AAA

```javascript
describe("Feature", () => {
  it("should do something", () => {
    // ARRANGE - setup
    const input = { title: "My Book" };

    // ACT - executar
    const result = processBook(input);

    // ASSERT - verificar
    expect(result.title).toBe("My Book");
  });
});
```

---

## Checklist de Teste

Antes de terminar uma feature:

- [ ] Teste passa? `npm test`
- [ ] Coverage > 80%? `npm test -- --coverage`
- [ ] Edge cases cobertos? (null, undefined, empty)
- [ ] Erros cobertos? (404, 400, 500)
- [ ] Testes têm nome descritivo?
- [ ] Sem lógica complexa nos testes?

---

## Rodando Testes

```bash
# Tudo
npm test

# Modo watch (rerun ao salvar)
npm test -- --watch

# Coverage
npm test -- --coverage

# Arquivo específico
npm test routes.test.js

# Test específico
npm test -- --grep "should return book"
```

---

## Gates (Verificações)

Estes comandos DEVEM passar antes de commit:

```bash
npm test           # ✅ Todos os testes
npm run lint       # ✅ ESLint OK
npm run format     # ✅ Prettier OK
```

---

**Última atualização:** 2026-04-17
