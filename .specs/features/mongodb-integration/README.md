# 📐 Technical Design Doc - MongoDB Integration (Fase 4)

**Placeholder para decisões arquiteturais da integração MongoDB.**

---

## 🎯 Quando Usar `technical-design-doc-creator`

**Na Fase 4, ANTES de implementar MongoDB, use este skill para:**

1. Documentar decisões de schema
2. Justificar normalização vs embedded documents
3. Planejar índices
4. Rastrear trade-offs

---

## 📋 Questões a Responder

### Schema Design

- [ ] Cada livro referencia autor por ID ou embeda dados?
- [ ] Campo de `createdAt` e `updatedAt` em ambas collections?
- [ ] Campos opcionais precisam de default?
- [ ] Como representar relacionamentos?

### Relacionamentos

| Opção          | Vantagem                            | Desvantagem                |
| -------------- | ----------------------------------- | -------------------------- |
| **Referência** | Dados centralizados, sem duplicação | Mais queries (performance) |
| **Embedded**   | Uma query só                        | Duplicação de dados        |

**Decisão esperada para Fase 4:**

```
Livro referencia Autor por _id (normalização)
- Cada livro: { title, authorId: ObjectId(...) }
- Cada autor: { name, email, ... }
- Query JOIN necessária
```

### Índices

- [ ] Indexar `title` (buscas por título)?
- [ ] Indexar `authorId` (filtragem)?
- [ ] Índice composto `(title, year)` para buscas avançadas?

### Validação

- [ ] Validar no Mongoose schema ou na aplicação?
- [ ] Ambos (defesa em profundidade)?

---

## 🚀 Quando chegar em Fase 4

**Use skill `technical-design-doc-creator` para gerar:**

```
.specs/features/mongodb-integration/design.md
```

**Com seções:**

1. **Overview** - O que está sendo integrado
2. **Schema Decisions** - Por quê cada escolha
3. **Data Relationships** - Como dados se conectam
4. **Indexing Strategy** - Quais índices e por quê
5. **Trade-offs** - O que perdemos/ganhamos
6. **Validation Approach** - Onde validar
7. **Testing Strategy** - Como testar DB

---

## 📌 Para Agentes (Fase 4)

Quando solicitar integração MongoDB:

```markdown
**Objetivo:** Integrar MongoDB (Fase 4)

**Contexto:** Livros + Autores com validação segura

**Use skill:** technical-design-doc-creator

**Gerar:** .specs/features/mongodb-integration/design.md

**Depois:** Implementar seguindo design doc
```

---

**Próximo:** Referencie este documento na Fase 4!
