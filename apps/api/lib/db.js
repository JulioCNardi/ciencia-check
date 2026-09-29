const mysql = require("mysql2/promise");
const { CHALLENGES } = require("@ciencia-check/shared");

let pool = null;
let ready = null;

function getConfig() {
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "ciencia_check",
    waitForConnections: true,
    connectionLimit: 10,
  };
}

async function ensureDatabase() {
  const cfg = getConfig();
  const connection = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: true,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();
}

async function ensureSchema(p) {
  await p.query(`
    CREATE TABLE IF NOT EXISTS classes (
      code VARCHAR(32) PRIMARY KEY,
      name VARCHAR(120) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nickname VARCHAR(64) NOT NULL,
      class_code VARCHAR(32) NOT NULL,
      xp INT NOT NULL DEFAULT 0,
      streak INT NOT NULL DEFAULT 0,
      last_play_date DATE NULL,
      badges JSON NOT NULL DEFAULT (JSON_ARRAY()),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_nickname_class (nickname, class_code),
      CONSTRAINT fk_student_class FOREIGN KEY (class_code) REFERENCES classes(code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS challenges (
      id VARCHAR(32) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      theme VARCHAR(64) NOT NULL,
      difficulty INT NOT NULL,
      text TEXT NOT NULL,
      correct_classification VARCHAR(32) NOT NULL,
      correct_flags JSON NOT NULL,
      scientific_method JSON NOT NULL,
      explanation TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      challenge_id VARCHAR(32) NOT NULL,
      classification VARCHAR(32) NOT NULL,
      selected_flags JSON NOT NULL,
      score INT NOT NULL,
      xp_earned INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_student_challenge (student_id, challenge_id),
      CONSTRAINT fk_sub_student FOREIGN KEY (student_id) REFERENCES students(id),
      CONSTRAINT fk_sub_challenge FOREIGN KEY (challenge_id) REFERENCES challenges(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

function parseJsonField(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function seedIfEmpty(p) {
  const [classRows] = await p.query("SELECT COUNT(*) AS c FROM classes");
  if (classRows[0].c === 0) {
    await p.query("INSERT INTO classes (code, name) VALUES (?, ?)", [
      "DEMO2026",
      "Turma Demo APEX 2026",
    ]);
  }

  const [challengeRows] = await p.query("SELECT COUNT(*) AS c FROM challenges");
  if (challengeRows[0].c === 0) {
    const insertSql = `
      INSERT INTO challenges (
        id, title, theme, difficulty, text,
        correct_classification, correct_flags, scientific_method, explanation
      ) VALUES (?, ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), ?)
    `;
    for (const ch of CHALLENGES) {
      await p.query(insertSql, [
        ch.id,
        ch.title,
        ch.theme,
        ch.difficulty,
        ch.text,
        ch.correctClassification,
        JSON.stringify(ch.correctFlags),
        JSON.stringify(ch.scientificMethod),
        ch.explanation,
      ]);
    }
  }
}

async function initDb() {
  if (ready) return ready;
  ready = (async () => {
    await ensureDatabase();
    const cfg = getConfig();
    pool = mysql.createPool(cfg);
    await ensureSchema(pool);
    await seedIfEmpty(pool);
    return pool;
  })();
  return ready;
}

async function getPool() {
  return initDb();
}

async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.query(sql, params);
  return rows;
}

async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

function mapChallengeRow(row, { includeAnswer = false } = {}) {
  if (!row) return null;
  const base = {
    id: row.id,
    title: row.title,
    theme: row.theme,
    difficulty: row.difficulty,
    text: row.text,
  };
  if (includeAnswer) {
    base.correctClassification = row.correct_classification;
    base.correctFlags = parseJsonField(row.correct_flags, []);
    base.scientificMethod = parseJsonField(row.scientific_method, []);
    base.explanation = row.explanation;
  }
  return base;
}

function mapStudentRow(row) {
  if (!row) return null;
  let lastPlayDate = row.last_play_date;
  if (lastPlayDate instanceof Date) {
    lastPlayDate = lastPlayDate.toISOString().slice(0, 10);
  }
  return {
    id: row.id,
    nickname: row.nickname,
    classCode: row.class_code,
    xp: row.xp,
    streak: row.streak,
    lastPlayDate,
    badges: parseJsonField(row.badges, []),
    createdAt: row.created_at,
  };
}

module.exports = {
  initDb,
  getPool,
  query,
  queryOne,
  mapChallengeRow,
  mapStudentRow,
  getConfig,
};
