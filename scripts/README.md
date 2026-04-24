# 📋 Scripts Úteis

## `npm run pr:comments`

Extrai e exibe todos os comentários da última revisão do Copilot em um PR.

### Uso

```bash
# Extrair comentários do PR #1 (padrão)
npm run pr:comments

# Extrair comentários de um PR específico
node scripts/extract-copilot-comments.js 2
```

### Output

Mostra:

- Número do comentário (ex: 1/6)
- Arquivo e linha afetados
- Corpo completo do comentário
- ID do comentário (para referência)

### Quando usar

- Após o Copilot completar uma revisão de PR
- Para revisar rapidamente todos os comentários sem clicar em cada arquivo
- Para análise rápida do que foi solicitado

---

## Tecnologia

- **Script:** Node.js (ES modules)
- **Fonte:** GitHub API (`gh api repos/.../pulls/1/comments`)
- **Ordenação:** Agrupa por `review_id` e mostra a review mais recente

Ver também: [Como extrair comentários (detailed guide)](../../memory/reference_copilot_review_comments.md)
