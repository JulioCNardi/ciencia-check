const path = require("path");
const fs = require("fs");

// Carrega .env simples (sem dependência extra)
function loadEnv() {
  const candidates = [
    path.join(__dirname, "..", ".env"),
    path.join(__dirname, "..", "..", "..", ".env"),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

loadEnv();

const { initDb, getConfig, queryOne } = require("../lib/db");

async function main() {
  const cfg = getConfig();
  await initDb();
  const classes = await queryOne("SELECT COUNT(*) AS c FROM classes");
  const challenges = await queryOne("SELECT COUNT(*) AS c FROM challenges");
  console.log(
    `Seed OK → MySQL ${cfg.host}:${cfg.port}/${cfg.database}`
  );
  console.log(`Turmas: ${classes.c} | Desafios: ${challenges.c}`);
  console.log("Turma demo: DEMO2026");
  process.exit(0);
}

main().catch((err) => {
  console.error("Falha no seed MySQL:", err.message);
  console.error(
    "Confira MYSQL_HOST/USER/PASSWORD/DATABASE em apps/api/.env (veja .env.example)."
  );
  process.exit(1);
});
