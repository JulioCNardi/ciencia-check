require("../../../lib/env");
const { query, queryOne } = require("../../../lib/db");
const { json, options } = require("../../../lib/cors");
const { xpToLevel } = require("@ciencia-check/shared");

function parseBadges(value) {
  if (value == null) return [];
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

async function OPTIONS() {
  return options();
}

async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classCode = String(searchParams.get("classCode") || "")
      .trim()
      .toUpperCase();
    if (!classCode) return json({ error: "classCode obrigatório." }, 400);

    const klass = await queryOne("SELECT code, name FROM classes WHERE code = ?", [
      classCode,
    ]);
    if (!klass) return json({ error: "Turma não encontrada." }, 404);

    const rows = await query(
      `
        SELECT id, nickname, xp, streak, badges
        FROM students
        WHERE class_code = ?
        ORDER BY xp DESC, id ASC
        LIMIT 10
      `,
      [classCode]
    );

    return json({
      classCode: klass.code,
      className: klass.name,
      leaderboard: rows.map((r, index) => ({
        rank: index + 1,
        studentId: r.id,
        nickname: r.nickname,
        xp: r.xp,
        level: xpToLevel(r.xp),
        streak: r.streak,
        badgesCount: parseBadges(r.badges).length,
      })),
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Falha ao carregar ranking." }, 500);
  }
}

module.exports = { OPTIONS, GET };
