const {
  analyzeText,
  xpToLevel,
  BADGES,
} = require("@ciencia-check/shared");

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Compara resposta do aluno com gabarito + heurísticas do texto.
 */
function scoreSubmission({ challenge, classification, selectedFlags, text }) {
  const correctFlags = new Set(challenge.correctFlags);
  const selected = new Set(selectedFlags || []);

  let flagHits = 0;
  let flagMisses = 0;
  for (const f of selected) {
    if (correctFlags.has(f)) flagHits += 1;
    else flagMisses += 1;
  }
  const flagMissed = [...correctFlags].filter((f) => !selected.has(f)).length;

  const classCorrect = classification === challenge.correctClassification;
  const heuristics = analyzeText(text);

  let score = 0;
  if (classCorrect) score += 60;
  score += Math.max(0, flagHits * 10 - flagMisses * 3 - flagMissed * 2);
  score = Math.min(100, Math.max(0, score));

  let xpEarned = Math.round(score * 0.8);
  if (classCorrect) xpEarned += 20;
  xpEarned += flagHits * 5;

  return {
    score,
    xpEarned,
    classCorrect,
    flagHits,
    flagMisses,
    flagMissed,
    correctClassification: challenge.correctClassification,
    correctFlags: challenge.correctFlags,
    heuristics,
    scientificMethod: challenge.scientificMethod,
    explanation: challenge.explanation,
  };
}

function computeStreak(student) {
  const today = todayISO();
  const yesterday = yesterdayISO();
  if (student.lastPlayDate === today) {
    return { streak: student.streak, lastPlayDate: today, streakBonus: 0 };
  }
  if (student.lastPlayDate === yesterday) {
    const streak = (student.streak || 0) + 1;
    const streakBonus = streak >= 3 ? 15 : streak >= 2 ? 10 : 5;
    return { streak, lastPlayDate: today, streakBonus };
  }
  return { streak: 1, lastPlayDate: today, streakBonus: 0 };
}

function evaluateBadges({ student, newXp, newStreak, totalSubmissions, clickbaitFlags, scienceHits, rank }) {
  const owned = new Set(student.badges || []);
  const unlocked = [];

  function unlock(id) {
    if (!owned.has(id)) {
      owned.add(id);
      unlocked.push(BADGES.find((b) => b.id === id));
    }
  }

  if (totalSubmissions >= 1) unlock("detetive_iniciante");
  if (clickbaitFlags >= 5) unlock("cacador_clickbait");
  if (scienceHits >= 3) unlock("metodo_cientifico");
  if (newStreak >= 3) unlock("streak_3");
  if (xpToLevel(newXp) >= 5) unlock("nivel_5");
  if (rank != null && rank <= 3) unlock("turma_top");

  return {
    badges: [...owned],
    unlocked: unlocked.filter(Boolean),
  };
}

module.exports = {
  scoreSubmission,
  computeStreak,
  evaluateBadges,
  todayISO,
};
