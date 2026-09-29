require("../../../../lib/env");
const {
  query,
  queryOne,
  getPool,
  mapChallengeRow,
  mapStudentRow,
} = require("../../../../lib/db");
const { json, options } = require("../../../../lib/cors");
const {
  scoreSubmission,
  computeStreak,
  evaluateBadges,
} = require("../../../../lib/gamification");
const { xpToLevel, xpProgressInLevel } = require("@ciencia-check/shared");

function parseFlags(value) {
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

async function POST(request) {
  try {
    const body = await request.json();
    const studentId = Number(body.studentId);
    const challengeId = String(body.challengeId || "");
    const classification = String(body.classification || "");
    const selectedFlags = Array.isArray(body.selectedFlags) ? body.selectedFlags : [];

    if (!studentId || !challengeId || !classification) {
      return json(
        { error: "studentId, challengeId e classification são obrigatórios." },
        400
      );
    }

    const studentRow = await queryOne("SELECT * FROM students WHERE id = ?", [
      studentId,
    ]);
    if (!studentRow) return json({ error: "Aluno não encontrado." }, 404);

    const challengeRow = await queryOne("SELECT * FROM challenges WHERE id = ?", [
      challengeId,
    ]);
    if (!challengeRow) return json({ error: "Desafio não encontrado." }, 404);

    const existing = await queryOne(
      "SELECT id FROM submissions WHERE student_id = ? AND challenge_id = ?",
      [studentId, challengeId]
    );
    if (existing) {
      return json({ error: "Você já respondeu este desafio." }, 409);
    }

    const challenge = mapChallengeRow(challengeRow, { includeAnswer: true });
    const student = mapStudentRow(studentRow);
    const result = scoreSubmission({
      challenge,
      classification,
      selectedFlags,
      text: challenge.text,
    });

    const streakInfo = computeStreak(student);
    const xpEarned = result.xpEarned + streakInfo.streakBonus;
    const newXp = student.xp + xpEarned;

    const totalBefore = await queryOne(
      "SELECT COUNT(*) AS c FROM submissions WHERE student_id = ?",
      [studentId]
    );
    const totalSubmissions = totalBefore.c + 1;

    const priorSubs = await query(
      "SELECT selected_flags FROM submissions WHERE student_id = ?",
      [studentId]
    );
    const clickbaitFlags =
      priorSubs.reduce((acc, row) => {
        const flags = parseFlags(row.selected_flags);
        return acc + (flags.includes("clickbait") ? 1 : 0);
      }, 0) + (selectedFlags.includes("clickbait") ? 1 : 0);

    const sciencePrior = await query(
      `
        SELECT s.challenge_id
        FROM submissions s
        JOIN challenges c ON c.id = s.challenge_id
        WHERE s.student_id = ? AND s.score >= 60 AND c.theme IN ('metodo', 'ciencia')
      `,
      [studentId]
    );
    const scienceHits =
      sciencePrior.length +
      (result.score >= 60 && ["metodo", "ciencia"].includes(challenge.theme) ? 1 : 0);

    const peers = await query(
      "SELECT id, xp FROM students WHERE class_code = ? ORDER BY xp DESC, id ASC",
      [student.classCode]
    );
    const ranked = peers
      .map((p) => (p.id === studentId ? { ...p, xp: newXp } : p))
      .sort((a, b) => b.xp - a.xp || a.id - b.id);
    const rank = ranked.findIndex((p) => p.id === studentId) + 1;

    const badgeResult = evaluateBadges({
      student,
      newXp,
      newStreak: streakInfo.streak,
      totalSubmissions,
      clickbaitFlags,
      scienceHits,
      rank,
    });

    const pool = await getPool();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        `
        INSERT INTO submissions (student_id, challenge_id, classification, selected_flags, score, xp_earned)
        VALUES (?, ?, ?, CAST(? AS JSON), ?, ?)
      `,
        [
          studentId,
          challengeId,
          classification,
          JSON.stringify(selectedFlags),
          result.score,
          xpEarned,
        ]
      );
      await conn.query(
        `
        UPDATE students
        SET xp = ?, streak = ?, last_play_date = ?, badges = CAST(? AS JSON)
        WHERE id = ?
      `,
        [
          newXp,
          streakInfo.streak,
          streakInfo.lastPlayDate,
          JSON.stringify(badgeResult.badges),
          studentId,
        ]
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    const updated = mapStudentRow(
      await queryOne("SELECT * FROM students WHERE id = ?", [studentId])
    );

    return json({
      result: {
        score: result.score,
        xpEarned,
        streakBonus: streakInfo.streakBonus,
        classCorrect: result.classCorrect,
        correctClassification: result.correctClassification,
        correctFlags: result.correctFlags,
        selectedFlags,
        heuristics: result.heuristics,
        scientificMethod: result.scientificMethod,
        explanation: result.explanation,
        unlockedBadges: badgeResult.unlocked,
      },
      student: {
        ...updated,
        level: xpToLevel(updated.xp),
        xpProgress: xpProgressInLevel(updated.xp),
      },
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Falha ao enviar resposta." }, 500);
  }
}

module.exports = { OPTIONS, POST };
