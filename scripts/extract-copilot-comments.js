#!/usr/bin/env node

/**
 * Script para extrair e exibir comentários do Copilot de um PR
 * Uso: node scripts/extract-copilot-comments.js [PR_NUMBER]
 * Exemplo: node scripts/extract-copilot-comments.js 1
 */

import { execSync } from "child_process";

const pr = process.argv[2] || "1";
const repo = "Fumagalli/library-api";

try {
  // Buscar comentários via API GitHub
  console.log(`📡 Buscando comentários do PR #${pr}...\n`);
  const json = execSync(
    `gh api repos/${repo}/pulls/${pr}/comments --paginate`
  ).toString();
  const reviewComments = JSON.parse(json);

  if (!reviewComments || reviewComments.length === 0) {
    console.log("⚠️  Nenhum comentário encontrado");
    process.exit(0);
  }

  // Agrupar comentários por review_id para identificar a revisão mais recente
  const byReview = {};
  reviewComments.forEach((comment) => {
    if (!byReview[comment.pull_request_review_id]) {
      byReview[comment.pull_request_review_id] = [];
    }
    byReview[comment.pull_request_review_id].push(comment);
  });

  // Pegar a review mais recente (ordenar por data)
  const reviews = Object.values(byReview).sort((a, b) => {
    const dateA = new Date(a[0].created_at || "").getTime();
    const dateB = new Date(b[0].created_at || "").getTime();
    return dateB - dateA;
  });

  const latestReview = reviews[0];

  if (!latestReview) {
    console.log("⚠️  Nenhuma revisão encontrada");
    process.exit(0);
  }

  // Exibir comentários
  console.log(`${"=".repeat(80)}`);
  console.log(
    `📋 ÚLTIMA REVIEW DO COPILOT - ${latestReview.length} COMENTÁRIO(S)`
  );
  console.log(`${"=".repeat(80)}\n`);

  latestReview.forEach((comment, index) => {
    console.log(`${"─".repeat(80)}`);
    console.log(`📌 COMENTÁRIO ${index + 1}/${latestReview.length}`);
    console.log(`${"─".repeat(80)}`);
    console.log(`📄 Arquivo: ${comment.path}`);
    if (comment.line) {
      console.log(`📍 Linha: ${comment.line}`);
    }
    console.log(`🔗 ID: ${comment.id}`);
    console.log(`\n${comment.body}\n`);
  });

  console.log(`${"=".repeat(80)}`);
  console.log(`✅ Total: ${latestReview.length} comentário(s)\n`);
} catch (error) {
  console.error("❌ Erro ao buscar comentários:");
  console.error(error.message);
  process.exit(1);
}
