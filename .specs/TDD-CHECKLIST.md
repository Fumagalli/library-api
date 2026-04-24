# Test-Driven Development (TDD) Checklist

**Objetivo:** Implementar com testes ANTES do código para evitar bugs de lógica.

**Por quê?** Se você escreve testes que falham primeiro, você:

- Enxerga o comportamento esperado ANTES de codificar
- Descobre edge cases naturalmente
- Garante que o código funciona para os casos reais

---

## 🔴 Fase 1: Write Tests (ANTES de implementar)

Para cada requisito do spec, escreva testes que **falham primeiro**:

### Template teste básico:

```javascript
import { createBook } from "../src/controllers/bookController.js";
import { describe, it, expect } from "vitest";

describe("createBook", () => {
  // Happy path
  it("should create book with valid data", () => {
    const result = createBook({ title: "1984", isbn: "978-0451524935" });
    expect(result).toHaveProperty("_id");
  });

  // Input validation
  it("should reject book without title", () => {
    expect(() => createBook({ isbn: "123" })).toThrow("Title required");
  });

  it("should reject invalid ISBN format", () => {
    expect(() => createBook({ title: "X", isbn: "not-isbn" })).toThrow(
      "Invalid ISBN"
    );
  });

  // Edge cases
  it("should reject duplicate ISBN", () => {
    createBook({ title: "Book 1", isbn: "123" });
    expect(() => createBook({ title: "Book 2", isbn: "123" })).toThrow(
      "ISBN already exists"
    );
  });

  it("should trim whitespace from title", () => {
    const result = createBook({ title: "  Clean Title  ", isbn: "123" });
    expect(result.title).toBe("Clean Title");
  });
});
```

### Checklist: Edge cases a sempre testar

- [ ] Happy path (dados válidos)
- [ ] Input nulo/undefined
- [ ] Input vazio (string "", array [])
- [ ] Input inválido (tipo errado)
- [ ] Dados duplicados (se aplicável)
- [ ] Boundary values (min, max)
- [ ] Whitespace/trim issues
- [ ] Ordem de operações (se stateful)

---

## 🟢 Fase 2: Implement (fazer testes passarem)

Agora **escreva APENAS o código** necessário para os testes passarem:

```javascript
import { validateISBN, validateTitle } from "../validators.js";

export async function createBook(bookData) {
  // Validação
  validateTitle(bookData.title);
  validateISBN(bookData.isbn);

  // Check duplicates
  const existing = await Book.findOne({ isbn: bookData.isbn });
  if (existing) throw new Error("ISBN already exists");

  // Clean & insert
  const book = {
    title: bookData.title.trim(),
    isbn: bookData.isbn,
  };

  return await Book.insertOne(book);
}
```

### Règle TDD: Não faça nada que não seja para passar testes

- ❌ Não adicione campos extra que ninguém pediu
- ❌ Não refatore código adjacente
- ❌ Não implemente features futuras
- ✅ Apenas o mínimo para passar

---

## 🔵 Fase 3: Refactor (com testes cobrindo)

Agora que os testes passam, você **pode refactor com segurança**:

```javascript
// Antes: Código que funciona mas não é ideal
export async function createBook(bookData) {
  if (!bookData.title) throw new Error("Title required");
  if (bookData.title.length < 1) throw new Error("Title required");
  if (!bookData.isbn) throw new Error("ISBN required");
  if (bookData.isbn.length !== 13) throw new Error("Invalid ISBN");
  // ... mais validações repetidas
}

// Depois: Refatorado (testes continuam passando!)
export async function createBook(bookData) {
  const validated = BookCreateSchema.parse(bookData); // Zod
  const existing = await findBookByISBN(validated.isbn);
  if (existing) throw new Error("ISBN already exists");
  return await Book.insertOne(validated);
}
```

---

## 📋 Checklist PRÉ-COMMIT (antes de `git commit`)

```markdown
### ✅ TDD Checklist

- [ ] **Spec lido e entendido?** (`.specs/` relevante)
- [ ] **Testes escritos ANTES da implementação?**
- [ ] **Testes cobrem happy path + 2+ edge cases?**
- [ ] **Todos os testes falham ANTES do código?**
- [ ] **Implementei apenas o mínimo para passar?**
- [ ] **Não refatorei código adjacente?**
- [ ] **Adicionei JSDoc em funções públicas?**
- [ ] **npm test passa 100%?**
- [ ] **npm run lint passa?**
- [ ] **npm run check-names passou?** (sem nomes genéricos)
```

---

## 🎯 Exemplos: Teste Primeiro vs. Depois

### ❌ ERRADO: Implementar sem testes

```javascript
// Você escreve código esperando estar certo
export function validateEmail(email) {
  return email.includes("@");
}
// "Acho que funciona..."
```

### ✅ CERTO: Testes primeiro

```javascript
describe("validateEmail", () => {
  it("should accept valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  it("should reject email without @", () => {
    expect(() => validateEmail("invalid")).toThrow("Invalid email");
  });

  it("should reject email without domain", () => {
    expect(() => validateEmail("user@")).toThrow("Invalid email");
  });
});

// Agora você SABE exatamente o que implementar:
export function validateEmail(email) {
  if (!email.includes("@")) throw new Error("Invalid email");
  const [local, domain] = email.split("@");
  if (!local || !domain) throw new Error("Invalid email");
  return true;
}
```

---

## 🔗 Integração com Workflow

1. **Leia spec** → entenda o requisito
2. **Escreva testes** → defina comportamento esperado
3. **Rode testes** → veja falhar ❌
4. **Implemente mínimo** → faça testes passar ✅
5. **Commit atômico** → uma mudança lógica
6. **Próximo requisito** → volta ao passo 1

---

## 📚 Referências

- [Test-Driven Development (Martin Fowler)](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Writing Testable Code](https://github.com/google/styleguide/blob/gh-pages/cpp/index.md)
- [Vitest Documentation](https://vitest.dev/)

---

## 🚀 TL;DR

**TDD em 3 passos:**

1. ✍️ **Escreva teste que falha** (vê vermelho)
2. 🔧 **Implemente o mínimo** (fica verde)
3. 🔄 **Refactor com segurança** (continua verde)

**Nunca:** código sem testes. Sempre: testes antes de código.
