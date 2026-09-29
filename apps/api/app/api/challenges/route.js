require("../../../lib/env");
const { query, mapChallengeRow } = require("../../../lib/db");
const { json, options } = require("../../../lib/cors");
const { RED_FLAG_OPTIONS } = require("@ciencia-check/shared");

async function OPTIONS() {
  return options();
}

async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = Number(searchParams.get("studentId"));
    const rows = await query("SELECT * FROM challenges ORDER BY difficulty, id");

    let completedIds = new Set();
    if (studentId) {
      const done = await query(
        "SELECT challenge_id FROM submissions WHERE student_id = ?",
        [studentId]
      );
      completedIds = new Set(done.map((d) => d.challenge_id));
    }

    return json({
      challenges: rows.map((r) => ({
        ...mapChallengeRow(r),
        completed: completedIds.has(r.id),
      })),
      redFlagOptions: RED_FLAG_OPTIONS,
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Falha ao listar desafios." }, 500);
  }
}

module.exports = { OPTIONS, GET };
