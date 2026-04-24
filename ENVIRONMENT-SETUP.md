# 🛠️ ENVIRONMENT-SETUP.md - Guia de Padrão de Desenvolvimento

**Instruções duráveis para configurar novos projetos com boas práticas de desenvolvimento, testes e qualidade.**

**Agnóstico de tecnologia:** Aplicável a qualquer linguagem/framework (Node.js, Python, Go, Java, etc).

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [🔴 Regras Sagradas](#-regras-sagradas-invioláveis)
3. [💡 Preferências de Desenvolvimento](#-preferências-de-desenvolvimento)
4. [Setup Essencial](#setup-essencial)
5. [Validações Obrigatórias](#validações-obrigatórias)
6. [Workflow Diário](#workflow-diário)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este documento define o **padrão universal de desenvolvimento, testes e qualidade** para todos os projetos, independente da linguagem ou framework.

### Garantias Deste Padrão

✅ **Code Quality** - Linter + Formatter obrigam padrão  
✅ **Test Coverage** - 100% funções/branches, 80% linhas  
✅ **Commit Atomicity** - Max 50 linhas, 1 conceito/commit  
✅ **Commit Semantics** - Formato `type(scope): description`  
✅ **Pre-Push Validation** - Testes + lint + format ANTES de push  
✅ **Reproducible** - Mesma qualidade em todos os commits  
✅ **Language-Agnostic** - Funciona em qualquer stack

---

## 🔴 Regras Sagradas (INVIOLÁVEIS)

**Estas regras NÃO são negociáveis. Sem exceções.**

### 1️⃣ Testes Sempre

- **Antes de cada commit:** `npm test` DEVE passar
- Sem exceções. Zero.
- Se testes falham, não commita

```bash
# ✅ Sempre fazer
npm test
git commit -m "feat(...): description"

# ❌ Nunca fazer
git commit -m "feat(...): description"
npm test  # Tarde demais!
```

---

### 2️⃣ Atomic Commits Obrigatório

- **Cada commit = 1 mudança lógica**
- Máximo ~50 linhas de mudança
- Se não cabe em uma tela, quebra em múltiplos commits
- Testes DEVEM passar para cada commit individual

```bash
# ✅ Correto (3 commits independentes)
git commit -m "test(auth): add login tests"           # ~30 linhas
git commit -m "feat(auth): implement login logic"     # ~40 linhas
git commit -m "refactor(auth): extract validator"     # ~25 linhas

# ❌ Errado (tudo junto = difícil revisar/revert)
git commit -m "feat: add auth system"  # ~200 linhas
```

---

### 3️⃣ Leia o Spec Primeiro

- **NUNCA** assuma requisitos vagos
- **SEMPRE** leia `.specs/` relevante antes de implementar
- Se ambíguo, pergunte → não chute

```bash
# ✅ Workflow correto
# 1. Ler spec
cat .specs/QUICK-START.md

# 2. Entender requisito
# 3. Escrever teste (RED)
npm test

# 4. Implementar (GREEN)
# 5. Refatorar (REFACTOR)

# ❌ Nunca fazer
# "Vou implementar e ler spec depois"
```

---

### 4️⃣ Security by Default

- **TODA rota POST/PUT** precisa de checklist de segurança
- Input validation é OBRIGATÓRIO (schema validation na sua linguagem)
- Injection prevention (SQL, NoSQL, command injection, etc)
- Sem exceções de segurança

**Checklist para rotas POST/PUT:**

```
- [ ] Input validation com schema da linguagem?
- [ ] Verificação de IDs/recursos (não manipulação de URL)?
- [ ] Error handling seguro (sem expor stack trace)?
- [ ] Output protection (apenas campos públicos)?
- [ ] Teste para injection + validação?
```

**Exemplos de validação (agnóstico):**

```
JavaScript:  z.object({ ... })
Python:      pydantic.BaseModel
Go:          struct + tags
Java:        @Valid + Bean Validation
```

---

### 5️⃣ Mudanças Cirúrgicas

- **Toque APENAS o necessário**
- Não refatore código adjacente
- Não "melhore" enquanto está aqui
- Cada linha editada rastreia ao requisito

```bash
# ✅ Correto (mudança cirúrgica)
git diff HEAD~1
# - Apenas 2 arquivos tocados
# - 35 linhas de mudança
# - Tudo relacionado ao requisito

# ❌ Errado (mudança grande demais)
git diff HEAD~1
# - 12 arquivos tocados
# - 400+ linhas
# - Mistura feature + refactor + cleanup
```

---

### 6️⃣ Sem Skips de Qualidade

- **NUNCA** skipe hooks (`--no-verify`)
- **SEMPRE** rode lint + format: `npm run lint && npm run format:check`
- **SEMPRE** rode testes antes de push
- Sem shortcuts

```bash
# ✅ Sempre fazer
npm run lint
npm run format:check
npm test
npm run test:coverage
git push

# ❌ Nunca fazer
git push --no-verify  # ❌ Pula hooks
git commit --no-gpg-sign  # ❌ Pula verificação

# Se hook falhou, FIX E TENTA DE NOVO
# Não skipe!
```

---

### ⚠️ O que Você Nunca Deve Fazer

| Situação                                  | Por quê                   | Ação                       |
| ----------------------------------------- | ------------------------- | -------------------------- |
| "Vou implementar e explicar depois"       | Spec incompleto = bugs    | Leia spec ANTES            |
| "Este commit tem 200 linhas"              | Difícil revisar/revert    | Quebra em 5+ commits       |
| "Não tenho teste, mas tenho certeza"      | Certeza mata              | Escreva teste PRIMEIRO     |
| "Melhorei código adjacente também"        | Scope creep               | Revert → mudança cirúrgica |
| "Vou fazer flexível pro futuro"           | YAGNI - você não vai usar | Código mínimo APENAS       |
| "NoSQL injection? Improvável"             | SEMPRE acontece           | ObjectId.isValid() + Zod   |
| "Testes ainda não passam, mas commitei"   | Quebra CI/CD              | Testes ANTES de commit     |
| "Vou skipar lint com --no-verify"         | Qualidade cai             | NUNCA skipe                |
| "Esqueci segurança, vou adicionar depois" | Não adiciona              | SEMPRE checklist           |

---

## 💡 Preferências de Desenvolvimento

**Estas não são regras rígidas, mas um mindset. Seguir essas preferências diferencia código mediocre de excelente.**

### Prioridade 1: Simplicidade

- **Código mínimo que resolve o problema**
- Sem abstrações que ninguém pediu
- Sem "flexibilidade para o futuro"
- Sem tratamento de erro para cenários impossíveis

**Teste de qualidade:** "Um senior diria que isso é overcomplicated?" → Se sim, reescreva.

**Exemplo (pseudocódigo):**

- ❌ Overcomplicated: Factory pattern + Builder + Strategy para validação
- ✅ Simples: Função pura que valida e retorna resultado

---

### Prioridade 2: Testes como Verificação

- **Escreva testes que reproduzem o requisito**
- Testes falham ANTES de implementar (RED phase)
- Implementar = fazer testes passarem (GREEN phase)
- Testes são a **prova** de que funcionou

```bash
# ✅ Workflow correto (TDD)
# 1. RED: teste falha
[seu-test-runner]  # ❌ FAIL

# 2. GREEN: implementar
[seu-test-runner]  # ✅ PASS

# 3. REFACTOR: melhorar (testes cobrem)
[seu-test-runner]  # ✅ PASS

# ❌ Nunca fazer
# Implementar primeiro, depois "pensar em testes"
```

**Conceito:** Testes são a especificação viva do que o código deve fazer.

- ❌ Errado: Código bom que depois a gente vê como testar
- ✅ Correto: Teste que define o comportamento esperado

---

### Prioridade 3: Karpathy Guidelines

Aplicar 4 princípios em cada implementação:

1. **Think** 🧠
   - Leia spec completa
   - Identifique fase TLC (pequeno/médio/grande)
   - Pergunte se ambíguo

2. **Simplify** 🔬
   - Código mínimo, sem bloat
   - Remova tudo que não é essencial
   - Se pode deletar uma linha, delete

3. **Surgical** 🔪
   - Toque APENAS o necessário
   - Não refatore adjacências
   - Cada linha rastreia ao requisito

4. **Goal-Driven** 🎯
   - Defina sucesso ANTES de implementar
   - Verifique antes de terminar
   - Não assuma que funcionou

```bash
# Exemplo: Adicionar validação de email

# 1. THINK
# - Spec: "autores devem ter email válido"
# - Fase: PEQUENO (1 validação)
# - Ação: EXECUTE apenas isso

# 2. SIMPLIFY
# - Usar Zod (já temos)
# - Não criar classe ValidatorFactory

# 3. SURGICAL
# - Tocar APENAS schema do Author
# - Não refatore outras validações

# 4. GOAL-DRIVEN
# - Sucesso = teste de email inválido falha
# - Verificar = npm test ✅
```

---

### Prioridade 4: TLC Spec-Driven

Tamanho da tarefa → Abordagem apropriada:

**🟢 PEQUENO** (< 30 min)

- Exemplos: typo, config fix, 1 função simples
- Abordagem: **EXECUTE**
- Passos: spec → código → teste → commit

```bash
# Exemplo: Adicionar console.log para debug
# EXECUTE direto - não precisa planning
npm test
git commit -m "chore: add debug logging"
```

**🟡 MÉDIO** (30 min - 2h)

- Exemplos: 1 rota + testes, 1 feature pequena
- Abordagem: **SPECIFY** → **EXECUTE**
- Passos: leia spec → escreva testes → implemente → commit

```bash
# Exemplo: Adicionar rota GET /authors
# 1. SPECIFY: ler spec de authors
cat .specs/authors.md

# 2. EXECUTE:
# - Teste (RED)
# - Implementação (GREEN)
# - Commit atômico
```

**🔴 GRANDE** (> 2h)

- Exemplos: feature completa, refactor major
- Abordagem: **SPECIFY** → **DESIGN** → **TASKS** → **EXECUTE**
- Passos: spec → plan → atomizar → implementar → múltiplos commits

```bash
# Exemplo: Implementar CRUD de autores
# 1. SPECIFY: entender requisito completo
# 2. DESIGN: arquitetura (controller, model, routes)
# 3. TASKS: quebrar em 5+ commits atômicos
# 4. EXECUTE: 1 commit por vez

# Resultado: 8-10 commits bem pequenos
git log --oneline
# feat(authors): add Author model
# test(authors): add model tests
# feat(authors): add AuthorController
# test(authors): add controller tests
# feat(authors): add routes
# ...
```

---

---

## ⚙️ Setup Essencial

**6 componentes obrigatórios para qualquer projeto, independente da linguagem.**

### 1️⃣ Linter (Code Style)

**Função:** Detecta problemas no código (variáveis não usadas, imports desnecessários, etc)

**Ferramentas por linguagem:**

- JavaScript/TypeScript: ESLint
- Python: pylint, flake8
- Go: golangci-lint
- Java: Checkstyle, SpotBugs
- Ruby: Rubocop

**Obrigatório:**

```bash
# Rodar antes de cada commit
[seu-linter] .
```

---

### 2️⃣ Formatter (Code Format)

**Função:** Padroniza formatação (espaçamento, quebras de linha, etc)

**Ferramentas por linguagem:**

- JavaScript/TypeScript: Prettier
- Python: Black, autopep8
- Go: gofmt
- Java: Google Java Format
- Ruby: RuboCop

**Obrigatório:**

```bash
# Rodar antes de cada commit
[seu-formatter] --check .
```

---

### 3️⃣ Test Runner com Coverage Validation

**Função:** Roda testes e valida cobertura (100% funções/branches, 80% linhas)

**Ferramentas por linguagem:**

- JavaScript/TypeScript: Vitest, Jest
- Python: pytest + coverage
- Go: testing + cover
- Java: JUnit + Jacoco
- Ruby: RSpec + SimpleCov

**Obrigatório:**

```bash
# Rodar antes de cada commit
[seu-test-runner] --coverage

# Validar thresholds
# - Functions: 100%
# - Branches: 100%
# - Lines: 80%
```

---

### 4️⃣ Git Hooks (Automatizar Validações)

**Função:** Roda validações automaticamente antes de commit/push

**Ferramentas por linguagem (agnósticas):**

- Husky (Node.js)
- Lefthook (qualquer linguagem)
- Pre-commit (Python)
- Git built-in hooks

**Obrigatório:**

```bash
# Pre-commit hook
- Rodar linter
- Rodar formatter
- Rodar testes

# Pre-push hook
- Validar cobertura
```

---

### 5️⃣ Commit Message Validation

**Função:** Garante que commits seguem padrão atômico

**Ferramentas por linguagem (agnósticas):**

- Commitlint (Node.js)
- Lefthook com script (qualquer linguagem)
- Custom hook (qualquer linguagem)

**Obrigatório:**

```bash
# Validar formato: type(scope): description
# Validar comprimento da mensagem (max 50 chars)
# Validar que mudança é atômica (max 50 linhas)
```

---

### 6️⃣ CI/CD (Validação Remota)

**Função:** Roda validações em servidor (não deixa subir código quebrado)

**Ferramentas por plataforma:**

- GitHub: GitHub Actions
- GitLab: GitLab CI
- Bitbucket: Bitbucket Pipelines
- Qualquer: Jenkins

**Obrigatório:**

```bash
# Pipeline deve rodar:
- Linter
- Formatter
- Testes + coverage
- (Opcional) Deploy automático
```

---

### Como Implementar

Para **novo projeto**, você precisa:

1. **Escolher ferramentas** para sua linguagem
2. **Instalar** dependências (seguir docs de cada ferramenta)
3. **Configurar** git hooks
4. **Testar** que tudo funciona: `[linter] && [formatter] && [tester]`
5. **Documentar** quais ferramentas você escolheu no README

**Exemplo para Node.js:**

```bash
# 1. Instalar
npm install --save-dev eslint prettier vitest husky lint-staged commitlint

# 2. Configurar (em .husky/pre-commit)
npm run lint && npm run format:check && npm test

# 3. Testar
git commit -m "feat: example"  # Hooks devem rodar automaticamente
```

**Exemplo para Python:**

```bash
# 1. Instalar
pip install pylint black pytest coverage pre-commit

# 2. Configurar (em .pre-commit-config.yaml)
repos:
  - repo: local
    hooks:
      - id: pylint
        name: pylint
        entry: pylint
        language: system
      - id: black
        name: black
        entry: black
        language: system

# 3. Testar
pre-commit run --all-files
```

---

## ✅ Validações Obrigatórias

### Antes de Cada Commit

```bash
# 1. Lint
[seu-linter]

# 2. Format
[seu-formatter] --check

# 3. Testes
[seu-test-runner]

# 4. Coverage validation
[seu-test-runner] --coverage

# 5. Se tudo ✅, commit atômico
git commit -m "type(scope): description"
```

### Antes de Push

```bash
# Seu sistema de git hooks vai rodar automaticamente:
# ✅ pre-commit: lint + format + testes
# ✅ pre-push: coverage validation

# Se algum falhar:
# - Fix o erro
# - Commit novo atômico
# - Push novamente
```

### Mensagens de Commit Obrigatórias

Formato: `type(scope): description`

**Types válidos:**

- `feat` - Nova feature
- `fix` - Bug fix
- `docs` - Documentação
- `style` - Formatação (não muda lógica)
- `refactor` - Refatoração
- `test` - Testes
- `chore` - Configuração/setup
- `perf` - Performance

**Exemplos:**

```bash
# ✅ Válido
git commit -m "feat(authors): add author creation endpoint"
git commit -m "fix(books): handle invalid ISBN validation"
git commit -m "test(auth): add login integration tests"
git commit -m "refactor(middleware): extract error handler"

# ❌ Inválido
git commit -m "Add feature"
git commit -m "FEAT(AUTHORS): ADD ENDPOINT"
git commit -m "Updated things"
```

---

## 📖 Workflow Diário

### 1. Começar Novo Feature

```bash
# 1. Criar branch
git checkout -b feat/my-feature

# 2. Criar teste (RED - deve falhar)
# [Usar padrão de testes da sua linguagem]

# 3. Rodar teste (deve falhar)
[seu-test-runner]
# ❌ FAIL
```

### 2. Implementar Feature

```bash
# 1. Escrever implementação
# [Usar convenções de código da sua linguagem]

# 2. Testar (deve passar)
[seu-test-runner]
# ✅ PASS

# 3. Validar cobertura
[seu-test-runner] --coverage
# ✅ 100% functions/branches

# 4. Lint + format
[seu-linter]
[seu-formatter]

# 5. Commit atômico
git commit -m "feat(scope): implement my feature"
```

### 3. Fazer Push

```bash
# Git hooks rodarão automaticamente:
# ✅ Pre-commit (lint + format + test)
# ✅ Pre-push (coverage)
# ✅ Se tudo passar, push sobe

git push origin feat/my-feature
```

### 4. Abrir PR

```bash
# No seu platform de versionamento (GitHub, GitLab, Bitbucket):
# - Título: Mesmo do último commit
# - Descrição: Resumo das mudanças + commits importantes
# - Link: Reference issues relevantes

[seu-comando-pr] create --title "feat(scope): implement my feature" --body "..."
```

---

## 🔧 Troubleshooting

### Problema: "Linter failed"

```bash
# Solução: Auto-fix
[seu-linter] --fix
[seu-formatter] --write

# Depois: commit novo
git add .
git commit -m "style: fix linting errors"
```

### Problema: "Coverage validation failed"

```bash
# Verificar qual arquivo/função não testada
[seu-test-runner] --coverage

# Adicionar testes para função/branch descoberta
# [Escrever testes no padrão da sua linguagem]

# Depois: commit novo
git commit -m "test: improve coverage for X function"
```

### Problema: "Commit message rejected"

```bash
# Verificar padrão exigido (tipo deve ser: feat/fix/docs/test/refactor/chore/perf)
# E assunto máximo 50 caracteres

# Opção 1: Amend commit com mensagem correta
git commit --amend -m "feat(scope): correct message"

# Opção 2: Fazer novo commit
git reset --soft HEAD~1
git commit -m "feat(scope): correct message"
```

### Problema: "Git hooks not running"

```bash
# Verificar se hooks estão instalados
ls -la .git/hooks/
# ou
ls -la .husky/
# ou verififcar o sistema que você usa (pre-commit, lefthook, etc)

# Reinstalar hooks (comando específico depende do seu sistema)
# Node.js: npx husky install
# Python: pre-commit install
# Genérico: [seu-hook-manager] install
```

### Problema: "node_modules é gigante"

```bash
# Adicionar ao .gitignore
echo "node_modules/" >> .gitignore
echo "package-lock.json" >> .gitignore
npm ci  # Use ci ao invés de install em CI/CD

git add .
git commit -m "chore: add proper .gitignore"
```

---

## 📊 Checklist: Pronto para Novo Projeto?

- [ ] Ambiente configurado (Node.js/Python/Go/etc na versão recomendada)
- [ ] Git inicializado e configurado (`git init`, `git config user.name`)
- [ ] Linter instalado e configurado
- [ ] Formatter instalado e configurado
- [ ] Test runner instalado com coverage
- [ ] Validação de coverage implementada (100% functions/branches, 80% lines)
- [ ] Git hooks instalados (pre-commit, pre-push)
- [ ] Commit message validation configurada
- [ ] `.gitignore` criado com padrões da sua linguagem
- [ ] Testes passando (`[seu-test-runner]`)
- [ ] Coverage validation passando (`[seu-test-runner] --coverage`)
- [ ] Primeiro commit feito (`feat: initial commit`)
- [ ] CI/CD configurado (GitHub Actions, GitLab CI, etc) - opcional

---

## 🚀 Próximos Passos

1. **Leia a documentação de regras do projeto**
   - Defina seus padrões (testes sempre, atomic commits, etc)

2. **Crie pasta de especificações** (ex: `.specs/`)
   - Documentar requisitos antes de implementar

3. **Implemente com TDD**
   - RED (teste falha) → GREEN (passa) → REFACTOR

4. **Mantenha cobertura alta**
   - Pre-push validation garante consistência

---

## 📝 Versão & Manutenção

- **Versão:** 1.1 (Agnóstico de Tecnologia)
- **Data de Atualização:** 2026-04-24
- **Reutilizável em:** Node.js, Python, Go, Java, Ruby, etc
- **Próximo Review:** Quando adicionar novo padrão/prática

---

## 🤔 FAQ

### P: Qual package manager devo usar (npm, yarn, poetry, etc)?

**R:** Escolha um e mantenha consistência. Recomendação: use o mais comum na comunidade da sua linguagem.

### P: Posso desabilitar commit message validation para commits rápidos?

**R:** NÃO. Validação de mensagem força qualidade. Se precisa quebrar padrão, tem problema no requisito.

### P: Preciso de 100% de cobertura?

**R:** Sim para functions/branches. 80% para lines é realista (padrão da indústria).

### P: Posso fazer push sem passar testes?

**R:** Não. Git hooks pré-commit bloqueiam. Se houver erro legítimo, você pode skippar com flag de emergência (mas marca no PR), mas não é recomendado.

### P: Como adiciono nova ferramenta?

**R:** Atualize este arquivo + documentação do projeto + commit com tipo `chore`.

### P: E se quiser usar outra linguagem/stack?

**R:** Este documento é agnóstico de tecnologia! Escolha as ferramentas da sua linguagem que implementam:

- Linter
- Formatter
- Test runner com coverage
- Git hooks
- Commit validation

E aplique os mesmos princípios (Regras Sagradas + Preferências).

---

**Construído com ❤️ para garantir qualidade em todos os commits, em qualquer stack.**
