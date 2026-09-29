# Ciencia Check — Documentação APEX

## O que é este projeto

**Ciencia Check** é um protótipo de plataforma gamificada de letramento digital e combate à desinformação científica, voltado a estudantes de escolas públicas.

Narrativa APEX: *Tecnologia é a ferramenta; transformação social (letramento digital) é o objetivo.*

## Enquadramento nos eixos

| Papel | Eixo | Justificativa |
| --- | --- | --- |
| Principal | **III — Educação e Sociedade** | EdTech de letramento / ambiente de aprendizagem gamificado |
| Reforço | **VII — Ciência e Inovação** | Heurísticas de processamento de texto (IA leve e transparente) |
| Reforço | **I — Ética e Direitos Humanos** | Cidadania digital e combate à desinformação |
| Temático (conteúdo) | XII / IV | Desafios podem tratar saúde ou clima sem mudar o eixo principal |

## Diretrizes APEX atendidas

1. **Problema real/local** — circulação de fake news científicas e baixa checagem de fontes entre estudantes.
2. **Aplicação prática de linguagens/frameworks** — JavaScript, Expo/React Native, Next.js API, MySQL.
3. **Valor social, usabilidade e acessibilidade** — interface em português, contraste alto, textos curtos, fluxo linear de missão.
4. **Competências éticas e cidadãs** — método científico, pensamento crítico, responsabilidade ao compartilhar.

## Etapas de desenvolvimento

### 1. Diagnóstico do problema

- Comunidade-alvo: estudantes do ensino fundamental/médio em escolas públicas.
- Dor observada: dificuldade em distinguir clickbait, fontes vagas e confusão correlação×causalidade.
- Demanda: ferramenta interativa que ensine *como* checar, não um oráculo de “verdade absoluta”.

### 2. Modelagem e requisitos

- **Mobile:** Expo + expo-router (aluno).
- **API:** Next.js App Router em `apps/api` (porta 3001).
- **Persistência:** MySQL (`ciencia_check`) via `mysql2`.
- **Auth do protótipo:** apelido + código da turma (`DEMO2026`).
- **Requisitos funcionais:** missões, classificação de notícias, red flags, XP/badges/streak, ranking, cards de método científico.
- **Requisito ético:** feedback explicativo + heurísticas transparentes.

### 3. Implementação da solução

Monorepo `ciencia-check` com `apps/mobile`, `apps/api` e `shared/`.

Fluxo principal: login → missão do dia → análise → resultado pedagógico → ranking/badges.

### 4. Entrega e validação social (roteiro)

Sessão sugerida (40–50 min) com turma demo ou escola parceira:

1. Apresentar o problema da desinformação (5 min).
2. Alunos entram com apelido + `DEMO2026` (5 min).
3. Cada aluno completa 2–3 desafios (20 min).
4. Discussão em grupo sobre 1 caso (10 min).
5. Coleta de feedback (5–10 min).

**Métricas simples sugeridas**

- Número de desafios concluídos.
- Acerto médio de classificação.
- Badges desbloqueados / streak médio.
- Feedback qualitativo: “O que você passou a observar numa notícia?”

**Fora do escopo do protótipo:** parceria institucional formal, SSO escolar, publicação nas stores.

## Usabilidade e acessibilidade (MVP)

- Textos em português claro, com hierarquia tipográfica forte.
- Contraste verde-escuro / âmbar / fundo claro.
- Controles grandes (chips e botões) para toque em celular.
- Evitar depender só de cor: labels textuais em acerto/erro.
- Próximos passos: suporte a leitor de tela mais completo, modo alto contraste, tipografia dinâmica do SO.

## Posicionamento pedagógico

O sistema **não declara verdade absoluta**. Ele combina:

1. Gabarito pedagógico dos desafios.
2. Heurísticas de risco textual explicáveis (clickbait, fonte vaga, etc.).
3. Explicação passo a passo alinhada ao método científico.
