require("../../../../lib/env");
const { queryOne, mapStudentRow } = require("../../../../lib/db");
const { json, options } = require("../../../../lib/cors");
const { xpToLevel, xpProgressInLevel, BADGES } = require("@ciencia-check/shared");

async function OPTIONS() {
  return options();
}

async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = Number(searchParams.get("studentId"));
    if (!studentId) return json({ error: "studentId obrigatório." }, 400);

    const row = await queryOne("SELECT * FROM students WHERE id = ?", [studentId]);
    if (!row) return json({ error: "Aluno não encontrado." }, 404);

    const student = mapStudentRow(row);
    const completedRow = await queryOne(
      "SELECT COUNT(*) AS c FROM submissions WHERE student_id = ?",
      [studentId]
    );

    const badgeDetails = BADGES.map((b) => ({
      ...b,
      unlocked: student.badges.includes(b.id),
    }));

    return json({
      student: {
        ...student,
        level: xpToLevel(student.xp),
        xpProgress: xpProgressInLevel(student.xp),
        completedChallenges: completedRow.c,
      },
      badges: badgeDetails,
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Falha ao carregar perfil." }, 500);
  }
}

module.exports = { OPTIONS, GET };
