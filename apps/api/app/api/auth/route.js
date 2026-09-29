require("../../../lib/env");
const { queryOne, mapStudentRow } = require("../../../lib/db");
const { json, options } = require("../../../lib/cors");
const { xpToLevel, xpProgressInLevel } = require("@ciencia-check/shared");

async function OPTIONS() {
  return options();
}

async function POST(request) {
  try {
    const body = await request.json();
    const nickname = String(body.nickname || "").trim();
    const classCode = String(body.classCode || "").trim().toUpperCase();

    if (!nickname || nickname.length < 2) {
      return json({ error: "Informe um apelido com pelo menos 2 caracteres." }, 400);
    }
    if (!classCode) {
      return json({ error: "Informe o código da turma." }, 400);
    }

    const klass = await queryOne("SELECT code, name FROM classes WHERE code = ?", [
      classCode,
    ]);
    if (!klass) {
      return json({ error: "Turma não encontrada. Use DEMO2026 no protótipo." }, 404);
    }

    let row = await queryOne(
      "SELECT * FROM students WHERE nickname = ? AND class_code = ?",
      [nickname, classCode]
    );

    if (!row) {
      const { getPool } = require("../../../lib/db");
      const pool = await getPool();
      const [result] = await pool.query(
        "INSERT INTO students (nickname, class_code, badges) VALUES (?, ?, CAST(? AS JSON))",
        [nickname, classCode, "[]"]
      );
      row = await queryOne("SELECT * FROM students WHERE id = ?", [result.insertId]);
    }

    const student = mapStudentRow(row);
    return json({
      student: {
        ...student,
        level: xpToLevel(student.xp),
        xpProgress: xpProgressInLevel(student.xp),
      },
      className: klass.name,
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Falha na autenticação." }, 500);
  }
}

module.exports = { OPTIONS, POST };
