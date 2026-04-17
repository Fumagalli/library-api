# 🗺️ Roadmap - Library API

**Status:** 🎓 Fase de Aprendizado (seguindo curso Alura)

**Contexto:** Este projeto segue o curso [Node.js: API REST com Express e MongoDB](https://cursos.alura.com.br/course/node-js-api-rest-express-mongodb). O roadmap será refinado conforme o curso evolui.

---

## Fase 1️⃣: Learning Phase (ATUAL)

**Objetivo:** Estabelecer estrutura, boas práticas e familiarização com Express + Node.js.

**Foco:** Aplicar **Karpathy Guidelines + TLC Spec-Driven + Testes + Atomic Commits**

### Subindo Nível: Boas Práticas

Enquanto segue o curso, aplicar desde o início:

- ✅ **Code Quality**
  - ESLint + Prettier configurados
  - Testes automatizados (Vitest)
  - Cobertura de testes ≥ 80%

- ✅ **Development Discipline**
  - Karpathy Guidelines (Think, Simplify, Surgical, Goal-Driven)
  - TLC Spec-Driven Development (Specify → Design → Tasks → Execute)
  - Atomic commits (~50 linhas cada, uma lógica por commit)
  - Testes verificam sucesso antes de considerar pronto

- ✅ **Security from Day 1**
  - Input validation (Zod schemas)
  - Sanitização de dados
  - Error handling seguro (sem expor detalhes)
  - Output protection (apenas campos públicos)
  - Testes de segurança (injeção, validation)

- ✅ **Documentation**
  - Specs em `.specs/` para rastreabilidade
  - STATE.md para decisões e aprendizados
  - Code conventions mantidas

### Checklist da Fase 1

- [x] Projeto e ambiente setup
- [x] Vitest + ESLint + Prettier
- [x] Estrutura `.specs/` criada
- [x] Diretrizes (AGENTS-GUIDELINES.md) documentadas
- [x] `.copilot/` comandos para agente
- [ ] Conclusão do curso Alura

---

## Fase 2️⃣: Post-Course Definition

**Objetivo:** Revisar aprendizados e definir features reais.

**Quando:** Após conclusão do curso Alura

### Atividades

- [ ] Review: O que foi aprendido?
- [ ] Definir features reais baseado no curso
- [ ] Criar roadmap refinado com fases específicas
- [ ] Começar implementação com boas práticas já internalizadas

**Referência:** Documentar decisões em `STATE.md` e criar features specs em `.specs/features/`

---

## 📊 Status Atual

- **Fase:** 1️⃣ Learning
- **Curso:** [Node.js: API REST com Express e MongoDB](https://cursos.alura.com.br/course/node-js-api-rest-express-mongodb) (em progresso)
- **Foco:** Boas práticas + fundações
- **Próximo:** Seguir aulas do curso + aplicar guidelines

---

**Última atualização:** 2026-04-17
