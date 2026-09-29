require("../../../lib/env");
const { json, options } = require("../../../lib/cors");
const { LEARN_CARDS } = require("@ciencia-check/shared");

async function OPTIONS() {
  return options();
}

async function GET() {
  return json({ cards: LEARN_CARDS });
}

module.exports = { OPTIONS, GET };
