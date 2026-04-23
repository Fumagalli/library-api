# 🧠 Agent Memory - Library API

**Contexto consolidado para agentes. Leia antes de trabalhar no projeto.**

---

## 🎯 O Projeto em 30 Segundos

- **Tipo:** API REST de biblioteca digital (course project + best practices)
- **Stack:** Node.js + Express + Vitest + MongoDB (em breve)
- **Fase:** Learning (seguindo curso Alura, aplicando Karpathy + TLC + Atomic Commits)
- **Foco:** Código limpo, testes, segurança desde o dia 1

**Curso:** [Node.js: API REST com Express e MongoDB](https://cursos.alura.com.br/course/node-js-api-rest-express-mongodb)

---

## 📋 Padrões Recorrentes

### Resposta JSON (Obrigatório)

```javascript
// Sucesso
{ success: true, data: { ... }, message?: "optional" }

// Erro
{ success: false, error: "specific message", statusCode: 400 }
```

### Validação com Zod (POST/PUT)

```javascript
const schema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  year: z.number().int().min(1000).max(new Date().getFullYear()),
});
const data = schema.parse(req.body);
```

### Testes (Padrão AAA)

```javascript
describe("GET /livros/:id", () => {
  it("should return book when found", () => {
    // Arrange
    const bookId = "123";
    // Act
    const response = request.get(`/livros/${bookId}`);
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### Estrutura de Pastas

```
src/
├── routes/        # Endpoints da API
├── controllers/   # Lógica de cada rota
├── models/        # Schemas MongoDB
├── middleware/    # Express middlewares
└── utils/         # Helpers

tests/
├── unit/          # Testes unitários
├── integration/   # Testes HTTP
└── fixtures/      # Mock data
```

---

## 🔴 Red Flags & Armadilhas

| Flag                                    | Ação                                           |
| --------------------------------------- | ---------------------------------------------- |
| "Vou implementar sem ler o spec"        | 🛑 Leia `.specs/AGENTS-GUIDELINES.md` antes    |
| "Este commit tem 200 linhas"            | 🛑 Quebrar em múltiplos atomic commits (~50)   |
| "Não tenho teste, mas tenho certeza"    | 🛑 Escrever teste que reproduz o requisito     |
| "Melhorei código adjacente também"      | 🛑 Surgical changes only - toque necessário    |
| "Vou fazer flexível pro futuro"         | ❌ Não! Simplicity first - apenas o pedido     |
| "NoSQL injection? Não vai acontecer"    | 🛑 SEMPRE usar ObjectId.isValid() + Zod        |
| "Testes ainda não passam, mas commitei" | 🛑 Testes ANTES de considerar pronto           |
| "Esqueci de validação de entrada"       | 🔐 Security by default - checklist obrigatório |

---

## 🔐 Security Checklist (Copiar para POST/PUT)

**TODA rota POST/PUT DEVE ter isto:**

```markdown
- [ ] Input validation com Zod schema?
- [ ] ObjectId.isValid() para IDs MongoDB?
- [ ] Error handling seguro (sem expor detalhes)?
- [ ] Output protection (apenas campos públicos)?
- [ ] Teste de segurança (injection, bad data)?
```

### Vulnerabilidades Críticas

1. **NoSQL Injection**

   ```javascript
   // ❌ INSEGURO
   db.findOne({ _id: req.params.id }); // Pode ser { $gt: "" }

   // ✅ SEGURO
   const id = z.string().refine(ObjectId.isValid).parse(req.params.id);
   db.findOne({ _id: new ObjectId(id) });
   ```

2. **Validação de Entrada**
   ```javascript
   // ✅ Sempre usar schema Zod
   const data = schema.parse(req.body); // Throws se inválido
   ```

---

---

## 📌 Última Atualização

- **Data:** 2026-04-23
- **Versão:** 1.0 (Agent-focused)
- **Próximo Review:** Quando houver decisão arquitetural nova
