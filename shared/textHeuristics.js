/**
 * Heurísticas transparentes de risco textual.
 * Não declara "verdade absoluta" — aponta sinais pedagógicos.
 */

const RULES = [
  {
    id: "absolutista",
    label: "Linguagem absolutista",
    weight: 2,
    why: "Palavras como 'sempre', 'nunca' ou 'cura definitiva' raramente cabem em ciência.",
    patterns: [
      /\bsempre\b/i,
      /\bnunca\b/i,
      /\bcura definitiv/i,
      /\bcomprovado 100%/i,
      /\bgarante(m)?\b/i,
      /\binfalível\b/i,
    ],
  },
  {
    id: "emocional",
    label: "Apelo emocional forte",
    weight: 2,
    why: "Medo e urgência emocionais desviam a atenção das evidências.",
    patterns: [
      /\bchocante\b/i,
      /\bassustador\b/i,
      /\burgente\b/i,
      /\bvocê precisa saber\b/i,
      /\bcompartilhe antes\b/i,
      /\beles não querem\b/i,
    ],
  },
  {
    id: "clickbait",
    label: "Clickbait / título sensacionalista",
    weight: 2,
    why: "Títulos exagerados costumam distorcer o que o estudo realmente mostrou.",
    patterns: [
      /\bmilagre\b/i,
      /\brevelado\b/i,
      /\bo que a mídia esconde\b/i,
      /\bsegredo\b/i,
      /!!!+/,
      /\bIMPOSSÍVEL\b/,
    ],
  },
  {
    id: "sem_fonte",
    label: "Fonte ausente ou vaga",
    weight: 3,
    why: "Sem autor, instituição ou estudo citável, a checagem fica impossível.",
    patterns: [
      /\bcientistas descobriram\b/i,
      /\bestudos mostram\b/i,
      /\bsegundo especialistas\b/i,
      /\bfoi comprovado\b/i,
    ],
  },
  {
    id: "medo_urgencia",
    label: "Urgência e medo",
    weight: 2,
    why: "Pressão para agir agora reduz o tempo de verificação.",
    patterns: [
      /\bagora mesmo\b/i,
      /\bantes que seja tarde\b/i,
      /\bproibido\b/i,
      /\bbanido\b/i,
      /\bperigo imediato\b/i,
    ],
  },
  {
    id: "correlacao_causalidade",
    label: "Confusão correlação × causalidade",
    weight: 3,
    why: "Duas coisas ocorrerem juntas não prova que uma causa a outra.",
    patterns: [
      /\bcausa(m)?\b/i,
      /\bprovoca(m)?\b/i,
      /\bresponsável por\b/i,
      /\bpor causa d[aeo]\b/i,
    ],
  },
];

/**
 * @param {string} text
 * @returns {{ alerts: Array<{id:string,label:string,weight:number,why:string,matches:string[]}>, riskScore: number }}
 */
function analyzeText(text) {
  const alerts = [];
  let riskScore = 0;

  for (const rule of RULES) {
    const matches = [];
    for (const pattern of rule.patterns) {
      const found = text.match(pattern);
      if (found) matches.push(found[0]);
    }
    if (matches.length > 0) {
      alerts.push({
        id: rule.id,
        label: rule.label,
        weight: rule.weight,
        why: rule.why,
        matches: [...new Set(matches)],
      });
      riskScore += rule.weight;
    }
  }

  return { alerts, riskScore };
}

/** Catálogo de red flags que o aluno pode marcar */
const RED_FLAG_OPTIONS = [
  { id: "absolutista", label: "Linguagem absolutista" },
  { id: "emocional", label: "Apelo emocional" },
  { id: "clickbait", label: "Clickbait" },
  { id: "sem_fonte", label: "Fonte ausente ou vaga" },
  { id: "medo_urgencia", label: "Urgência / medo" },
  { id: "correlacao_causalidade", label: "Correlação tratada como causa" },
  { id: "fonte_confiavel", label: "Fonte confiável citada" },
  { id: "dados_claros", label: "Dados e método descritos" },
];

module.exports = { RULES, analyzeText, RED_FLAG_OPTIONS };
