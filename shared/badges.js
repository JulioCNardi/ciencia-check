/** Catálogo de badges do Ciencia Check */
const BADGES = [
  {
    id: "detetive_iniciante",
    name: "Detetive Iniciante",
    description: "Complete seu primeiro desafio.",
    icon: "🔍",
  },
  {
    id: "cacador_clickbait",
    name: "Caçador de Clickbait",
    description: "Identifique 5 red flags de clickbait.",
    icon: "🎯",
  },
  {
    id: "metodo_cientifico",
    name: "Método Científico",
    description: "Acerte 3 desafios sobre evidências e fontes.",
    icon: "🧪",
  },
  {
    id: "streak_3",
    name: "Consistência",
    description: "Mantenha um streak de 3 dias.",
    icon: "🔥",
  },
  {
    id: "nivel_5",
    name: "Investigador",
    description: "Alcance o nível 5.",
    icon: "⭐",
  },
  {
    id: "turma_top",
    name: "Referência da Turma",
    description: "Fique no top 3 do ranking da turma.",
    icon: "🏆",
  },
];

function xpToLevel(xp) {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

function xpProgressInLevel(xp) {
  const inLevel = xp % 100;
  return { current: inLevel, needed: 100, level: xpToLevel(xp) };
}

module.exports = { BADGES, xpToLevel, xpProgressInLevel };
