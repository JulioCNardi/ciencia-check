# Ciencia Check

Plataforma gamificada de letramento digital e combate à desinformação científica (protótipo **APEX** — Eixo III Educação e Sociedade, com reforço em VII e I).

Stack: **Expo (React Native)** + **Next.js API** + **MySQL**, tudo em **JavaScript**.

## Estrutura

```
ciencia-check/
  apps/mobile   # App do estudante (Expo + expo-router)
  apps/api      # API Next.js (porta 3001)
  shared/       # Desafios, badges, heurísticas, cards
  docs/APEX.md  # Enquadramento acadêmico da APEX
```

## Pré-requisitos

- Node.js 18+
- npm 9+
- MySQL 8+ (local, XAMPP, WAMP ou Docker)

## Configurar MySQL

Opção rápida com Docker:

```bash
docker compose up -d
```

Depois use em `apps/api/.env`:

```
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ciencia_check
```

Ou use MySQL local/XAMPP/WAMP:

1. Garanta o serviço MySQL ativo.
2. Copie o exemplo de ambiente:

```bash
copy apps\api\.env.example apps\api\.env
```

3. Ajuste `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD` e `MYSQL_DATABASE`.

O seed cria o database `ciencia_check` (se não existir), as tabelas e a turma **DEMO2026**.

## Como rodar (Windows — clique e execute)

1. **Primeira vez:** duplo clique em `SETUP.bat` (instala deps, cria `.env`, faz seed).
2. **Todo dia:** duplo clique em `INICIAR.bat` (abre API + Expo em duas janelas).

MySQL precisa estar ligado (XAMPP/WAMP ou `docker compose up -d`).

### Ou via terminal

```bash
npm install
npm run seed
npm run api      # terminal 1 → http://localhost:3001
npm run mobile  # terminal 2 → Expo Go / web
```

Abra no Expo Go (mesmo Wi‑Fi) ou emulador. No emulador Android, a API usa `10.0.2.2:3001` automaticamente; no celular físico, o app usa o IP do PC na rede.

### Turma demo

- Código: **`DEMO2026`**
- Entre com qualquer apelido (mín. 2 caracteres)

## Fluxo do aluno

1. Login (apelido + turma)
2. Missão do dia com barra de XP / streak
3. Classificar notícia + marcar red flags
4. Ver feedback (método científico + heurísticas)
5. Ranking da turma e badges

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth` | Cria/recupera aluno |
| GET | `/api/missions?studentId=` | Missão do dia |
| GET | `/api/challenges` | Lista desafios |
| GET | `/api/challenges/[id]` | Detalhe do desafio |
| POST | `/api/challenges/submit` | Envia análise |
| GET | `/api/leaderboard?classCode=` | Top 10 da turma |
| GET | `/api/student/me?studentId=` | Perfil + badges |
| GET | `/api/learn` | Cards do método científico |

## Documentação APEX

Veja [docs/APEX.md](docs/APEX.md) para diagnóstico, eixos, requisitos e roteiro de validação social.
