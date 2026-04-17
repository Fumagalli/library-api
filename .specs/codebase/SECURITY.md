# 🔐 Security Best Practices - Library API

**Padrões de segurança para Node.js + Express + MongoDB.**

Todas as mudanças DEVEM seguir estas diretrizes desde a Fase 1.

---

## 🎯 Princípios de Segurança

1. ✅ **Validar TUDO** - Entrada do usuário é maliciosa até prova contrária
2. ✅ **Sanitizar TUDO** - Remova/escape caracteres perigosos
3. ✅ **Falha Segura** - Não exponha detalhes de erro ao cliente
4. ✅ **Princípio do Mínimo Privilégio** - Só retorne dados necessários
5. ✅ **Logging Seguro** - Nunca logue secrets, senhas, tokens

---

## 🚫 Vulnerabilidades Críticas

### 1. NoSQL Injection

**O Problema:**

```javascript
// ❌ INSEGURO - Usuário pode injetar queries
app.get('/livros/:id', (req, res) => {
  const id = req.params.id; // Poderia ser { $gt: "" }
  db.findOne({ _id: id }, ...);
});

// Ataque: GET /livros/{ "$gt": "" }
// Query fica: { _id: { $gt: "" } } → retorna TODOS os livros!
```

**A Solução:**

```javascript
// ✅ SEGURO - Validar e converter tipo
import { ObjectId } from "mongodb";
import { z } from "zod";

const idSchema = z.string().refine((val) => ObjectId.isValid(val));

app.get("/livros/:id", (req, res) => {
  const id = idSchema.parse(req.params.id); // Lança erro se inválido
  const book = db.findOne({ _id: new ObjectId(id) });
  res.json(book);
});
```

### 2. Validação de Entrada

**O Problema:**

```javascript
// ❌ INSEGURO - Sem validação
app.post("/livros", (req, res) => {
  const livro = req.body; // Poderia ter 1000 campos!
  db.save(livro);
  res.json(livro); // Expõe TUDO?
});
```

**A Solução:**

```javascript
// ✅ SEGURO - Schema validado
import { z } from "zod";

const createLivroSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  year: z.number().int().min(1000).max(new Date().getFullYear()),
  isbn: z.string().optional(),
  // Apenas campos esperados - nada mais
});

app.post("/livros", (req, res) => {
  try {
    const dados = createLivroSchema.parse(req.body);
    const livro = db.save(dados);
    res.json({ success: true, id: livro._id });
  } catch (error) {
    res.status(400).json({ error: "Invalid input" });
  }
});
```

### 3. Error Handling Seguro

**O Problema:**

```javascript
// ❌ INSEGURO - Expõe stack trace e detalhes
try {
  // código
} catch (error) {
  res.status(500).json({ error: error.toString() }); // Expõe tudo!
}
```

**A Solução:**

```javascript
// ✅ SEGURO - Mensagem genérica ao cliente, log detalhado no servidor
try {
  // código
} catch (error) {
  // Log detalhado APENAS no servidor
  console.error("[ERROR]", {
    timestamp: new Date(),
    message: error.message,
    stack: error.stack,
    // NÃO inclua dados do usuário
  });

  // Resposta genérica ao cliente
  res.status(500).json({
    success: false,
    error: "Internal server error",
    // NÃO envie stack trace!
  });
}
```

### 4. Resource IDs

**O Problema:**

```javascript
// ❌ INSEGURO - IDs incrementais são previsíveis
// Livro 1, 2, 3... usuário sabe quantos livros existem
// Pode acessar livros de outras pessoas: /livros/1, /livros/2
```

**A Solução:**

```javascript
// ✅ SEGURO - Use MongoDB ObjectId (já é aleatório)
// ObjectId é de 24 caracteres hexadecimais
// Impossível adivinhar: 507f1f77bcf86cd799439011

// Ao criar:
const livro = {
  _id: new ObjectId(), // Aleatório
  title: "Meu Livro",
};

// Retorne APENAS o ID aleatório
res.json({ id: livro._id.toString() });
```

---

## 🛡️ Segurança por Camada

### 1. Input Validation (Primeira Linha de Defesa)

```javascript
import { z } from "zod";

const schemas = {
  createLivro: z.object({
    title: z.string().min(1).max(200),
    author: z.string().min(1).max(100),
    year: z.number().int().positive(),
    isbn: z
      .string()
      .regex(/^[0-9-]{10,17}$/)
      .optional(),
  }),

  updateLivro: z.object({
    title: z.string().min(1).max(200).optional(),
    author: z.string().min(1).max(100).optional(),
    year: z.number().int().positive().optional(),
  }),
};

// Middleware para validar
export const validateBody = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid input",
      details: error.errors, // Apenas em dev
    });
  }
};

// Uso
app.post("/livros", validateBody(schemas.createLivro), (req, res) => {
  const dados = req.validated; // Já validado e tipado!
  db.save(dados);
});
```

### 2. Sanitização (Segunda Linha)

```javascript
import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (data) => {
  if (typeof data === "string") {
    // Remove HTML/scripts perigosos
    return sanitizeHtml(data, {
      allowedTags: [], // Nenhuma tag HTML
      allowedAttributes: {},
    });
  }

  if (typeof data === "object") {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeInput(data[key]);
      return acc;
    }, {});
  }

  return data;
};

// Uso
const dados = sanitizeInput(req.validated);
db.save(dados);
```

### 3. Output Protection (Terceira Linha)

```javascript
// ✅ Nunca retorne tudo
export const formatLivro = (livro) => ({
  id: livro._id.toString(),
  title: livro.title,
  author: livro.author,
  year: livro.year,
  // NÃO inclua: senha, tokens, dados internos
});

app.get("/livros/:id", (req, res) => {
  const livro = db.findOne({ _id: new ObjectId(req.params.id) });
  res.json(formatLivro(livro)); // Apenas campos públicos
});
```

---

## 🔧 Dependências de Segurança

**Instale para ajudar:**

```bash
npm install zod           # Validação schema
npm install sanitize-html # Sanitização
npm install helmet        # Headers de segurança
npm install express-rate-limit # Rate limiting
```

**Use Helmet para headers:**

```javascript
import helmet from "helmet";

app.use(helmet()); // Adiciona headers de segurança automáticamente
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Content-Security-Policy: ...
```

---

## 📋 Checklist: Cada Rota POST/PUT

Antes de implementar, verifique:

- [ ] **Validação**: Input schema com Zod?
- [ ] **Sanitização**: HTML/caracteres perigosos removidos?
- [ ] **Tipagem**: Data tem o tipo correto?
- [ ] **Range**: Números estão no intervalo esperado?
- [ ] **Length**: Strings têm tamanho válido?
- [ ] **Output**: Retorna APENAS campos públicos?
- [ ] **Error**: Mensagem de erro é genérica? (Sem detalhes internos)
- [ ] **Logging**: Detalhes sensíveis não aparecem em logs públicos?

---

## 🚨 Red Flags: Security

| Flag                              | Ação                                          |
| --------------------------------- | --------------------------------------------- |
| "Vou fazer validação depois"      | 🛑 NÃO - Faça agora                           |
| "Este campo é só para admin"      | ❓ Validar no servidor (cliente não é seguro) |
| "Retorno tudo e o cliente filtra" | 🛑 NUNCA - Dados sensíveis podem vazar        |
| "Trato erro com `console.error`"  | ⚠️ Log em arquivo + resposta genérica         |
| `db.find({ _id: req.params.id })` | 🛑 Injeção! Converter para ObjectId           |
| "Não precisa de sanitização"      | ⚠️ Faça mesmo assim (defesa em profundidade)  |

---

## 📖 Fases e Segurança

| Fase | Feature      | Security Must-Have                |
| ---- | ------------ | --------------------------------- |
| 1️⃣   | Setup        | Headers com Helmet                |
| 2️⃣   | CRUD Livros  | Validação + Sanitização + Tipagem |
| 3️⃣   | CRUD Autores | Idem fase 2                       |
| 4️⃣   | MongoDB      | Prepared queries, ObjectId        |
| 5️⃣   | Buscas       | Rate limiting, paginação validada |
| 6️⃣   | Autenticação | JWT, bcrypt (quando adicionado)   |

---

## 🧪 Testes de Segurança

**Sempre adicione testes para segurança:**

```javascript
// ❌ Valida que injeção é bloqueada
test("should reject NoSQL injection", () => {
  const maliciousId = { $gt: "" };
  const response = request
    .get(`/livros/${JSON.stringify(maliciousId)}`)
    .expect(400);
});

// ❌ Valida que campos inválidos são rejeitados
test("should reject extra fields", () => {
  const response = request
    .post("/livros")
    .send({
      title: "Test",
      author: "Test",
      _password: "hack", // Campo inválido
    })
    .expect(400);
});

// ✅ Valida que campos sensíveis não são retornados
test("should not expose internal fields", () => {
  const response = request.get("/livros/123").expect(200);

  expect(response.body).not.toHaveProperty("_internalId");
  expect(response.body).not.toHaveProperty("adminNotes");
});
```

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Injection Prevention](https://www.mongodb.com/docs/drivers/node/current/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

---

## 🔄 Processo

**Para cada feature (Fase 2+):**

1. **Especificar** com segurança em mente
2. **Escrever testes** de segurança (injection, validation)
3. **Implementar** com validação + sanitização
4. **Revisar** contra checklist acima
5. **Commitar** (atomic commit)

---

**Última atualização:** 2026-04-17

**Próximo:** Aplicar em Fase 2 (CRUD de Livros)
