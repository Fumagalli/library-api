# ⚛️ Atomic Commits - Guia Rápido

**Um commit = UMA mudança lógica pequena e independente.**

---

## 🎯 Princípios

- ✅ **Pequeno**: Máximo 50 linhas de mudança
- ✅ **Independente**: Pode ser revertido sem quebrar outras features
- ✅ **Completo**: Testes passam antes E depois
- ✅ **Focado**: Representa apenas UMA mudança lógica

---

## ❌ Commits Ruins

```bash
# 1. Muito grande - múltiplas responsabilidades
git commit -m "feat: add CRUD for livros and autores and validation"

# 2. Incompleto - testes falhando
git commit -m "feat(routes): add GET /livros"
# (mas os testes dessa rota ainda não passam)

# 3. Misturado - código + documentação + refator
git commit -m "feat: add route AND update docs AND refactor server"

# 4. Vago - não descreve o que foi feito
git commit -m "update code"
```

---

## ✅ Commits Bons

```bash
# 1. Simples e focado
git commit -m "feat(routes): add GET /livros endpoint"

# 2. Testes como suporte
git commit -m "test(routes): add tests for GET /livros"

# 3. Cada feature separada
git commit -m "feat(routes): add POST /livros"
git commit -m "feat(routes): add PUT /livros/:id"
git commit -m "feat(routes): add DELETE /livros/:id"

# 4. Fix ou refator separado
git commit -m "fix(server): handle 404 responses correctly"
git commit -m "refactor(routes): simplify route handler"
```

---

## Exemplo Real: Fase 2 (CRUD de Livros)

### ❌ Errado: 1 mega commit

```bash
git add . && git commit -m "feat: add livros CRUD"
# Dentro: 10+ rotas + controllers + models + testes + validação
# Impossível revisar, difícil fazer bisect
```

### ✅ Correto: 5 commits atômicos

```bash
# 1. Setup - testes que falham
git commit -m "test(livros): add tests for CRUD"

# 2. GET /livros
git commit -m "feat(livros): implement GET /livros"

# 3. GET /livros/:id
git commit -m "feat(livros): implement GET /livros/:id"

# 4. POST /livros
git commit -m "feat(livros): implement POST /livros"

# 5. PUT /livros/:id
git commit -m "feat(livros): implement PUT /livros/:id"

# 6. DELETE /livros/:id
git commit -m "feat(livros): implement DELETE /livros/:id"

# 7. Validação separada
git commit -m "feat(livros): add input validation"

# 8. Tratamento de erro
git commit -m "fix(livros): handle not found errors"
```

**Cada um pode ser revisado, testado, ou revertido independentemente.**

---

## 🛠️ Ferramentas Úteis

### Ver commits

```bash
git log --oneline            # Resumido
git log --oneline -10        # Últimos 10
git log --graph --all        # Visual
git show <commit>            # Detalhe de 1 commit
```

### Editar commits (avançado)

```bash
git reset HEAD~1             # Desfaz último commit (mantém mudanças)
git rebase -i HEAD~5         # Edita últimos 5 commits
git commit --amend           # Edita último commit
```

### Reverter

```bash
git revert <commit>          # Desfaz um commit específico
git reset --soft HEAD~1      # Desfaz sem perder código
```

---

## 📏 Checklist

Antes de fazer `git commit`:

- [ ] Mudança representa UM conceito lógico?
- [ ] Testes passam? `npm test`
- [ ] Lint passa? `npm run lint`
- [ ] Format passa? `npm run format:check`
- [ ] Posso descrever em 1 frase clara?
- [ ] Se reverto, apenas essa feature é removida?
- [ ] Mudança < 50 linhas (máximo)?
- [ ] Commit message segue Conventional Commits?

---

## 💡 Por Quê Atomic Commits?

| Benefício           | Por quê                            |
| ------------------- | ---------------------------------- |
| **Review Fácil**    | PR pequeno = rápido entender       |
| **Revert Seguro**   | Remove apenas aquela mudança       |
| **Histórico Limpo** | `git log` é legível                |
| **Git Bisect**      | Localizar bugs rapidamente         |
| **Feature Flags**   | Ativa/desativa por commit          |
| **Merge Simples**   | Menos conflitos                    |
| **Git Blame**       | Entender por quê cada linha existe |

---

## 🚨 Red Flags

| Flag                             | Ação                            |
| -------------------------------- | ------------------------------- |
| "Vou commitar tudo junto"        | 🛑 Quebre em commits menores    |
| "Este commit tem 200 linhas"     | 🛑 Muito grande, divida         |
| "Misturei código e documentação" | 🛑 Commits separados            |
| "Testes ainda estão falhando"    | 🛑 Fix primeiro, depois commita |
| "Não lembro o que mudei"         | 🛑 Commit muito grande, quebre  |

---

## 📚 Recursos

- **Conventional Commits:** https://www.conventionalcommits.org/
- **Atomic Commits:** https://www.freshconsulting.com/insights/blog/atomic-commits/
- **Git Best Practices:** https://sethrobertson.github.io/GitBestPractices/

---

**Última atualização:** 2026-04-17

**Próximo:** Quando implementar Fase 2 (CRUD de Livros), use este guia para manter commits atômicos!
