# 🤖 Agent Guidelines - Library API

**Diretrizes consolidadas para qualquer agente (ou desenvolvedor) trabalhando neste projeto.**

Este documento garante que todas as ações sigam: **Karpathy Guidelines** + **TLC Spec-Driven Development** + **Testes como prática**.

---

## 📋 Antes de Qualquer Ação

### 1️⃣ Think Before Coding (Karpathy #1)

**Antes de implementar qualquer coisa:**

- [ ] **Leia o contexto**: Qual é o requisito? Está em `.specs/`?
- [ ] **Identifique a fase TLC**: Estamos em Specify? Design? Tasks? Execute?
- [ ] **Faça perguntas explícitas se houver confusão**:
  - "Interpretei assim... isso está correto?"
  - "Vi duas formas de fazer isso. Qual vocês querem?"
  - "Essa solução é mais simples? Devo simplificar?"

**❌ Nunca faça isso:**

- Assumir requisitos vagos
- Escolher a solução "fancier" em silêncio
- Implementar "flexibilidade" que ninguém pediu

---

## 🎯 Fluxo Spec-Driven Development (TLC)

```
SPECIFY → DESIGN → TASKS → EXECUTE
```

**Seu tamanho determina a profundidade:**

| Escopo       | Exemplo                   | Pipeline                           |
| ------------ | ------------------------- | ---------------------------------- |
| **Pequeno**  | Typo fix, config          | Skip direto → EXECUTE rápido       |
| **Médio**    | 1 rota, 1 teste           | SPECIFY (breve) → EXECUTE          |
| **Grande**   | Feature completa          | SPECIFY → DESIGN → TASKS → EXECUTE |
| **Complexo** | Ambiguidade, novo domínio | Tudo + discussão                   |

---

## 2️⃣ Simplicity First (Karpathy #2)

**Escreva o mínimo que resolve o problema:**

- ✅ Código que resolvea requisição
- ❌ Abstrações para caso que "pode vir"
- ❌ Configurações "flexíveis" que não foram pedidas
- ❌ Tratamento de erro para cenários impossíveis
- ❌ 200 linhas quando 50 são suficientes

**Teste mental:** "Um senior diria que isso é overcomplicated?" → Se sim, reescreva.

---

## 3️⃣ Surgical Changes (Karpathy #3)

**Quando editar código existente:**

- [ ] Toque APENAS o necessário
- [ ] Não melhore código adjacente
- [ ] Não refatore coisas que não estão quebradas
- [ ] Mantenha o estilo existente
- [ ] Remova APENAS imports/variáveis/funções que SUAS mudanças deixaram órfãs

**O teste:** Cada linha modificada rastreia direto ao requisito.

---

## 4️⃣ Goal-Driven Execution (Karpathy #4)

**Defina sucesso. Verifique antes de terminar.**

**Transforme requisitos em metas verificáveis com testes:**

- "Adicionar validação" → "Escrever teste para entrada inválida → fazer passar"
- "Corrigir bug" → "Escrever teste que reproduz → fazer passar"
- "Refatorar" → "Testes passam antes e depois"

**Padrão de plano para tasks multi-passo:**

```
1. [Ação] → verify: [Como verifico?]
2. [Ação] → verify: [Como verifico?]
3. [Ação] → verify: [Como verifico?]
```

---

## 📁 Estrutura de Especificações

```
.specs/
├── AGENTS-GUIDELINES.md      # ← Este arquivo
├── project/
│   ├── PROJECT.md            # Visão, objetivo, goals
│   ├── ROADMAP.md            # Features e milestones
│   └── STATE.md              # Decisões, bloqueadores, aprendizados
├── features/
│   └── [feature-name]/
│       ├── spec.md           # Requisitos (OBRIGATÓRIO)
│       ├── design.md         # Arquitetura (se grande/complexo)
│       ├── tasks.md          # Tasks atômicas (se grande/complexo)
│       └── context.md        # Decisões do usuário (se ambíguo)
└── codebase/
    ├── STACK.md              # Stack & dependências
    ├── CONVENTIONS.md        # Padrões de código
    ├── TESTING.md            # Estratégia de testes
    ├── SECURITY.md           # **Segurança (obrigatório em toda rota)**
    └── STRUCTURE.md          # Arquitetura atual
```

---

## 🔐 Security by Default (Obrigatório!)

**TODA rota POST/PUT DEVE seguir `.specs/codebase/SECURITY.md`**

**Checklist mínimo para cada rota:**

- [ ] Validação de entrada (Zod schema)?
- [ ] Sanitização de dados?
- [ ] Error handling seguro (sem expor detalhes)?
- [ ] Output protection (retorna apenas campos públicos)?
- [ ] Teste para injeção/validação?

**Referência rápida:** `.specs/codebase/SECURITY.md`

---

## ✅ Checklist Antes de Commitar

- [ ] Todos os testes passam? `npm test`
- [ ] Lint passa? `npm run lint`
- [ ] Code formatado? `npm run format:check`
- [ ] Commit message clara e rastreável?
- [ ] Cada linha editada traça ao requisito?
- [ ] Nenhuma mudança "enquanto você estava aqui"?
- [ ] **Commit é atômico?** (uma mudança lógica, ~50 linhas)

---

## ⚛️ Atomic Commits (Importante!)

**Cada commit = UMA mudança lógica pequena e independente.**

### ✅ Bom

```bash
git commit -m "feat(routes): add GET /livros endpoint"
# Dentro: apenas a rota GET + testes para GET
```

```bash
git commit -m "test(routes): add tests for GET /livros"
# Antes de implementar = testes que falham
```

### ❌ Ruim

```bash
git commit -m "feat: add CRUD for livros and autores and validation"
# Dentro: múltiplas responsabilidades = difícil de revisar/revert
```

```bash
git commit -m "feat(routes): add GET /livros"
# Mas: testes ainda não passam = commit incompleto
```

### Por Quê?

- 🔍 **Review fácil** - PR pequeno é fácil de revisar
- ⏮️ **Revert seguro** - Remove apenas uma mudança
- 📖 **Histórico limpo** - `git log` é legível
- 🐛 **Git bisect rápido** - Localiza bugs rapidamente
- 🚀 **Feature flags** - Controlar por commit

**Ver `.specs/codebase/CONVENTIONS.md` para exemplos completos de atomic commits.**

---

## 🔴 Red Flags (PARE se ver)

| Flag                                              | Ação                                              |
| ------------------------------------------------- | ------------------------------------------------- |
| "Vou implementar e explicar depois"               | 🛑 STOP → Leia o spec primeiro                    |
| "Isso é similar a X, vou reusar"                  | ❓ Pergunte: precisa de reuso real?               |
| "Melhorei o código adjacente também"              | 🛑 UNDO → Mudança cirúrgica                       |
| "Achei um bug enquanto estava aqui"               | 📝 Documente em STATE.md → não toque agora        |
| "Não tenho teste, mas tenho certeza que funciona" | 🛑 STOP → Escreva testes que façam sentido        |
| "Vou adicionar 'só por segurança'"                | ❓ Pergunta: foi pedido? Se não, remova           |
| "Vou commitar tudo junto"                         | 🛑 STOP → Atomic commits! Quebre em 3+ commits    |
| "Este commit tem 200 linhas de mudança"           | 🛑 STOP → Muito grande. Quebre em commits menores |

---

## 📌 Template Para Requisições de Mudança

**Quando solicitar uma feature/fix:**

```markdown
**Objetivo:** [O que precisa ser feito?]

**Contexto:** [Por quê? Qual é o problema?]

**Fase TLC:** [Specify? Design? Tasks? Execute?]

**Critério de sucesso:** [Como verifico que está pronto?]

**Constraints:** [Dependências, regras, limitações?]

**Escopo:** [Pequeno? Médio? Grande?]
```

---

## 🚀 Como Usar Este Guia

1. **Toda vez que receber uma solicitação**: Releia as 4 diretrizes Karpathy acima
2. **Antes de começar**: Identifique em qual fase TLC estamos
3. **Ao implementar**: Aplique "Simplicity First" e "Surgical Changes"
4. **Antes de terminar**: Rode testes, lint, format → Verifique checklist

---

## 📚 Documentos Relacionados

- `.specs/project/PROJECT.md` - Visão do projeto
- `.specs/project/ROADMAP.md` - Features planejadas
- `.specs/project/STATE.md` - Memória do projeto
- `.specs/codebase/CONVENTIONS.md` - Padrões de código
- `.specs/codebase/TESTING.md` - Estratégia de testes

---

**Última atualização:** 2026-04-17
**Responsável:** Agent Guidelines (auto-aplicado)
