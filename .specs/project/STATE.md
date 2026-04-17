# 📝 State - Library API

Memória do projeto. Decisões, bloqueadores, aprendizados, ideias deferidas.

---

## ✅ Decisões Confirmadas

| Decisão                                     | Contexto                        | Status        |
| ------------------------------------------- | ------------------------------- | ------------- |
| **Testing Framework: Vitest**               | Leve, rápido, moderno           | ✅ Confirmado |
| **Port: 3000 (fixo inicialmente)**          | MVP não precisa porta dinâmica  | ✅ Confirmado |
| **Karpathy + TLC + Verificação com testes** | Qualidade de código             | ✅ Confirmado |
| **Atomic Commits**                          | Commits pequenos, independentes | ✅ Confirmado |
| **Security Best Practices**                 | Obrigatório em toda rota        | ✅ Confirmado |

---

## 🚫 Bloqueadores

Nenhum no momento.

---

## 💡 Aprendizados

- Estrutura `.specs/` estabelecida para rastreabilidade
- Agentes devem sempre referenciar AGENTS-GUIDELINES.md
- Testes como verificação de qualidade — escrever conforme necessário, não fluxo obrigatório
- Karpathy #4 (Goal-Driven): defina sucesso e verifique antes de terminar
- JSON estruturado com `{ success: boolean, data: any, error?: string }` padronizado
- **Atomic commits** (pequenos, independentes) garantem histórico limpo e reverts seguros
- **Segurança desde o início**: validação + sanitização + error handling (não deixar para depois)

---

## 📋 TODO (Rastreado em Tarefas)

- [x] Implementar testes Vitest
- [x] Rotas retornam JSON estruturado (não texto)
- [x] Tratamento de erros 404
- [x] ESLint + Prettier configurado
- [ ] TODO resolvido: porta dinâmica será adicionada após MongoDB

---

## 🔄 Ideias Deferidas

| Ideia                     | Por quê adiar                   |
| ------------------------- | ------------------------------- |
| Suporte para multi-idioma | Não solicitado no curso         |
| Autenticação JWT          | Fase futura (depois de MongoDB) |
| Rate limiting             | Avançado demais para MVP        |
| Websockets                | Fora de escopo                  |

---

## 📌 Próximas Ações

1. **Imediato:** Seguir curso Alura (Express foundations)
2. **Próximo:** Estrutura REST de Livros (CRUD + testes)
3. **Depois:** Estrutura REST de Autores (CRUD + testes)
4. **Próximo grande:** Integrar MongoDB
5. **Após tudo:** Refatorar conforme Karpathy Guidelines

---

**Última atualização:** 2026-04-17
