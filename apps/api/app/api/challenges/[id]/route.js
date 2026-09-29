require("../../../../lib/env");
const { queryOne, mapChallengeRow } = require("../../../../lib/db");
const { json, options } = require("../../../../lib/cors");
const { RED_FLAG_OPTIONS } = require("@ciencia-check/shared");

async function OPTIONS() {
  return options();
}

async function GET(_request, { params }) {
  try {
    const id = params.id;
    const row = await queryOne("SELECT * FROM challenges WHERE id = ?", [id]);
    if (!row) return json({ error: "Desafio não encontrado." }, 404);

    return json({
      challenge: mapChallengeRow(row),
      redFlagOptions: RED_FLAG_OPTIONS,
      classifications: [
        { id: "confiavel", label: "Confiável" },
        { id: "duvidoso", label: "Duvidoso" },
        { id: "falso", label: "Falso / enganoso" },
      ],
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Falha ao carregar desafio." }, 500);
  }
}

module.exports = { OPTIONS, GET };
