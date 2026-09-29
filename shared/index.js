const { BADGES, xpToLevel, xpProgressInLevel } = require("./badges");
const { analyzeText, RED_FLAG_OPTIONS, RULES } = require("./textHeuristics");
const { LEARN_CARDS } = require("./learnCards");
const { CHALLENGES } = require("./challenges");

module.exports = {
  BADGES,
  xpToLevel,
  xpProgressInLevel,
  analyzeText,
  RED_FLAG_OPTIONS,
  RULES,
  LEARN_CARDS,
  CHALLENGES,
};
