# 📚 Project: Library API

**Status:** 🚀 Em desenvolvimento (seguindo curso Alura)

---

## 🎯 Objetivo

Criar uma **API REST robusta e escalável** para gerenciamento de biblioteca digital, seguindo boas práticas de Node.js, Express e MongoDB.

**Baseado em:** [Curso Alura - Node.js: API REST com Express e MongoDB](https://cursos.alura.com.br/course/node-js-api-rest-express-mongodb)

---

## 🎓 O Que Será Aprendido

- [x] Entender como requisições HTTP funcionam
- [ ] Criar uma API do zero seguindo estilo arquitetural REST
- [ ] Conhecer o framework Express
- [ ] Conectar API com banco de dados MongoDB
- [ ] Criar buscas por campos específicos

---

## 🏗️ Escopo

### MVP (Mínimo Viável)

1. **Roteamento básico**
   - GET `/` - health check
   - GET `/livros` - listar livros
   - GET `/autores` - listar autores

2. **Estrutura REST**
   - GET `/livros/:id` - buscar livro por ID
   - POST `/livros` - criar livro
   - PUT `/livros/:id` - atualizar livro
   - DELETE `/livros/:id` - deletar livro
   - (Idem para autores)

3. **Banco de dados**
   - Conectar MongoDB
   - Criar esquema de Livro
   - Criar esquema de Autor

4. **Buscas avançadas**
   - Buscar livros por título, autor, ano
   - Paginação
   - Ordenação

---

## 📋 Requisitos Não-Funcionais

- Seguir **Karpathy Guidelines** em todo código
- Todos os requisitos com **testes automatizados**
- Código limpo com **ESLint + Prettier**
- Testes rodando antes de cada commit

---

## 👥 Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Banco:** MongoDB
- **Testing:** Vitest
- **Linting:** ESLint + Prettier

---

## 📊 Roadmap

| Fase | Feature                   | Status       |
| ---- | ------------------------- | ------------ |
| 1️⃣   | Setup + Roteamento básico | ✅ Concluído |
| 2️⃣   | Estrutura REST de Livros  | 🟡 Próximo   |
| 3️⃣   | Estrutura REST de Autores | ⭕ Planejado |
| 4️⃣   | MongoDB + Persistência    | ⭕ Planejado |
| 5️⃣   | Buscas avançadas          | ⭕ Planejado |
| 6️⃣   | Validação e erros         | ⭕ Planejado |

---

## 🔗 Relacionados

- `ROADMAP.md` - Detalhamento das fases
- `STATE.md` - Decisões, bloqueadores, aprendizados
- `../.` - Voltar ao guia de agentes

---

**Criado:** 2026-04-17  
**Última atualização:** 2026-04-17
