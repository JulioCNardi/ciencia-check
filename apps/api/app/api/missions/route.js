require("../../../lib/env");
const { queryOne, mapChallengeRow, mapStudentRow } = require("../../../lib/db");
const { json, options } = require("../../../lib/cors");
const { xpToLevel, xpProgressInLevel } = require("@ciencia-check/shared");

async function OPTIONS() {
  return options();
}

async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = Number(searchParams.get("studentId"));
    if (!studentId) return json({ error: "studentId obrigatório." }, 400);

    const studentRow = await queryOne("SELECT * FROM students WHERE id = ?", [
      studentId,
    ]);
    if (!studentRow) return json({ error: "Aluno não encontrado." }, 404);
    const student = mapStudentRow(studentRow);

    const pending = await queryOne(
      `
        SELECT c.* FROM challenges c
        WHERE c.id NOT IN (
          SELECT challenge_id FROM submissions WHERE student_id = ?
        )
        ORDER BY c.difficulty ASC, c.id ASC
        LIMIT 1
      `,
      [studentId]
    );

    const completed = await queryOne(
      "SELECT COUNT(*) AS c FROM submissions WHERE student_id = ?",
      [studentId]
    );
    const total = await queryOne("SELECT COUNT(*) AS c FROM challenges");

    return json({
      student: {
        ...student,
        level: xpToLevel(student.xp),
        xpProgress: xpProgressInLevel(student.xp),
      },
      mission: mapChallengeRow(pending),
      progress: { completed: completed.c, total: total.c },
      message: pending
        ? "Missão do dia: analise a notícia e marque os sinais de risco."
        : "Você concluiu todos os desafios! Revise o ranking e os badges.",
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Falha ao carregar missões." }, 500);
  }
}

module.exports = { OPTIONS, GET };
