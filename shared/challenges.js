/**
 * Desafios pedagógicos (gabarito incluso).
 * classification: confiavel | duvidoso | falso
 */
const CHALLENGES = [
  {
    id: "ch01",
    title: "Cura milagrosa revelada!!!",
    theme: "saude",
    difficulty: 1,
    text: "Cientistas descobriram a CURA DEFINITIVA para todas as doenças! Um chá caseiro PROVA que a medicina oficial esconde a verdade. Compartilhe agora mesmo antes que seja banido!!!",
    correctClassification: "falso",
    correctFlags: ["absolutista", "emocional", "clickbait", "sem_fonte", "medo_urgencia"],
    scientificMethod: [
      "Pergunta: existe mesmo uma cura universal citada?",
      "Evidência: nenhum estudo, autor ou periódico foi nomeado.",
      "Conclusão: linguagem absolutista + urgência = alto risco de desinformação.",
    ],
    explanation:
      "Promessas de cura total sem fonte e com pressão para compartilhar são clássicos de fake news em saúde.",
  },
  {
    id: "ch02",
    title: "Vacinas e dados oficiais",
    theme: "saude",
    difficulty: 1,
    text: "Segundo o Ministério da Saúde e a Organização Mundial da Saúde, vacinas passam por fases de testes clínicos (segurança e eficácia) antes da aprovação. Efeitos adversos graves são monitorados por sistemas de farmacovigilância.",
    correctClassification: "confiavel",
    correctFlags: ["fonte_confiavel", "dados_claros"],
    scientificMethod: [
      "Pergunta: quem publica e com que base?",
      "Evidência: instituições oficiais e processo de testes clínicos.",
      "Conclusão: afirmação alinhada a consenso científico documentado.",
    ],
    explanation:
      "Citar instituições reconhecidas e descrever o processo (testes, monitoramento) aumenta a confiabilidade.",
  },
  {
    id: "ch03",
    title: "Estudo mostra que sorvete causa afogamento",
    theme: "metodo",
    difficulty: 2,
    text: "Um gráfico viral prova: nos meses em que mais se vende sorvete, aumentam os afogamentos. Portanto o sorvete CAUSA afogamentos. Especialistas exigem banir sorvete nas praias!",
    correctClassification: "falso",
    correctFlags: ["correlacao_causalidade", "emocional", "sem_fonte"],
    scientificMethod: [
      "Pergunta: correlação no tempo prova causa?",
      "Análise: verão aumenta sorvete E banhos no mar.",
      "Conclusão: terceira variável (calor/verão) explica ambos — não é causalidade.",
    ],
    explanation:
      "Dois eventos subirem juntos não prova que um causa o outro. Isso é confusão entre correlação e causalidade.",
  },
  {
    id: "ch04",
    title: "Aquecimento e consenso científico",
    theme: "clima",
    difficulty: 1,
    text: "Relatórios do IPCC (painel científico da ONU) sintetizam milhares de estudos revisados por pares e concluem que a atividade humana é a principal causa do aquecimento global observado desde meados do século XX.",
    correctClassification: "confiavel",
    correctFlags: ["fonte_confiavel", "dados_claros"],
    scientificMethod: [
      "Pergunta: a fonte é uma síntese revisada?",
      "Evidência: IPCC agrega literatura científica com revisão por pares.",
      "Conclusão: alto grau de confiança institucional e metodológica.",
    ],
    explanation:
      "Sínteses de painéis científicos com revisão por pares são uma boa âncora para checagem climática.",
  },
  {
    id: "ch05",
    title: "O que a mídia esconde sobre o clima",
    theme: "clima",
    difficulty: 2,
    text: "URGENTE: o aquecimento global é uma mentira! Sempre existiram mudanças climáticas. Cientistas descobriram que tudo é conspiração. Compartilhe antes que apaguem!!!",
    correctClassification: "falso",
    correctFlags: ["clickbait", "sem_fonte", "medo_urgencia", "absolutista", "emocional"],
    scientificMethod: [
      "Pergunta: 'sempre existiu mudança' anula o aquecimento atual?",
      "Evidência: o ritmo e a causa antropogênica são o ponto científico — não a existência de mudanças no passado.",
      "Conclusão: título conspiratório sem fonte não substitui evidência.",
    ],
    explanation:
      "Misturar fato verdadeiro (clima sempre mudou) com conclusão falsa (logo não há aquecimento antropogênico) é uma falácia comum.",
  },
  {
    id: "ch06",
    title: "Suplemento viral sem paper",
    theme: "saude",
    difficulty: 2,
    text: "Estudos mostram que este suplemento aumenta a inteligência em 200%. Especialistas garantem resultados em 7 dias. Compre agora mesmo!",
    correctClassification: "duvidoso",
    correctFlags: ["sem_fonte", "absolutista", "emocional", "medo_urgencia"],
    scientificMethod: [
      "Pergunta: quais estudos? em qual periódico?",
      "Evidência: nenhum DOI, amostra ou método foi apresentado.",
      "Conclusão: afirmação extraordinária exige evidência extraordinária — aqui falta tudo.",
    ],
    explanation:
      "Percentuais impressionantes sem estudo rastreável devem ser tratados como duvidosos até prova.",
  },
  {
    id: "ch07",
    title: "Artigo com método descrito",
    theme: "metodo",
    difficulty: 2,
    text: "Pesquisadores da Universidade Federal de Minas Gerais publicaram em periódico revisado por pares um ensaio clínico randomizado (n=312) sobre um tratamento. O artigo descreve critérios de inclusão, grupo controle e limitações. O efeito médio foi moderado, não milagroso.",
    correctClassification: "confiavel",
    correctFlags: ["fonte_confiavel", "dados_claros"],
    scientificMethod: [
      "Pergunta: há instituição, desenho de estudo e limitações?",
      "Evidência: ECR, amostra informada, peer review e tom cauteloso.",
      "Conclusão: sinais de comunicação científica responsável.",
    ],
    explanation:
      "Boas práticas: instituição, tipo de estudo, amostra, revisão por pares e admissão de limitações.",
  },
  {
    id: "ch08",
    title: "5G e sintomas instantâneos",
    theme: "tecnologia",
    difficulty: 2,
    text: "Chocante: o 5G provoca dor de cabeça IMEDIATA em todos. Foi comprovado. Eles não querem que você saiba. Proibido falar sobre isso!",
    correctClassification: "falso",
    correctFlags: ["emocional", "absolutista", "sem_fonte", "correlacao_causalidade", "medo_urgencia"],
    scientificMethod: [
      "Pergunta: há medição controlada ligando 5G a sintomas?",
      "Evidência: texto usa medo e generalização ('todos') sem dados.",
      "Conclusão: alegação causal forte sem evidência = desinformação.",
    ],
    explanation:
      "Alegações de dano universal sem dados mensuráveis e com tom de conspiração são um padrão clássico de fake news.",
  },
  {
    id: "ch09",
    title: "Terra plana 'revelada'",
    theme: "ciencia",
    difficulty: 1,
    text: "Segredo revelado: a Terra é plana e a NASA mente. Um vídeo caseiro PROVA 100%. Compartilhe com seus amigos agora!!!",
    correctClassification: "falso",
    correctFlags: ["clickbait", "absolutista", "sem_fonte", "emocional"],
    scientificMethod: [
      "Pergunta: o que previsões científicas exigem (eclipses, GPS, fusos)?",
      "Evidência: múltiplas linhas independentes sustentam a Terra esférica.",
      "Conclusão: um vídeo anedótico não derruba um corpo enorme de evidências.",
    ],
    explanation:
      "Anedota viral não supera evidências convergentes (navegação, astronomia, geodésia).",
  },
  {
    id: "ch10",
    title: "Notícia cautelosa sobre vírus",
    theme: "saude",
    difficulty: 2,
    text: "Autoridades de saúde alertam para aumento de casos de uma doença respiratória em algumas regiões. Recomendam higiene das mãos e buscar atendimento se houver falta de ar. Dados ainda são preliminares e serão atualizados.",
    correctClassification: "confiavel",
    correctFlags: ["fonte_confiavel", "dados_claros"],
    scientificMethod: [
      "Pergunta: o tom admite incerteza?",
      "Evidência: recomendações práticas + dados preliminares declarados.",
      "Conclusão: comunicação de risco responsável costuma ser provisória e específica.",
    ],
    explanation:
      "Admitir que dados são preliminares e dar orientações verificáveis é sinal de boa comunicação científica.",
  },
  {
    id: "ch11",
    title: "Chocolate melhora notas — será?",
    theme: "metodo",
    difficulty: 3,
    text: "Pesquisa com 12 alunos de uma escola mostrou que quem comeu chocolate tirou notas melhores. Portanto chocolate provoca inteligência. Escolas devem distribuir chocolate todo dia!",
    correctClassification: "duvidoso",
    correctFlags: ["correlacao_causalidade", "sem_fonte"],
    scientificMethod: [
      "Pergunta: amostra de 12 é suficiente? havia grupo controle?",
      "Análise: efeito pode ser coincidência, motivação ou outros fatores.",
      "Conclusão: generalizar política escolar a partir disso é precipitado.",
    ],
    explanation:
      "Amostra pequena + salto causal + recomendação ampla = estudo frágil ou mal interpretado.",
  },
  {
    id: "ch12",
    title: "Microplásticos — síntese cautelosa",
    theme: "clima",
    difficulty: 2,
    text: "Revisões científicas recentes indicam que microplásticos estão amplamente presentes no ambiente. Ainda há incerteza sobre doses e efeitos em humanos; pesquisadores pedem mais estudos e redução de poluição plástica com base no princípio da precaução.",
    correctClassification: "confiavel",
    correctFlags: ["fonte_confiavel", "dados_claros"],
    scientificMethod: [
      "Pergunta: o texto separa o que se sabe do que ainda é incerto?",
      "Evidência: reconhece lacunas e evita absolutismos.",
      "Conclusão: incerteza declarada é virtude científica, não fraqueza.",
    ],
    explanation:
      "Bom sinal: distingue evidência consolidada de incertezas e evita alarmismo absolutista.",
  },
];

module.exports = { CHALLENGES };
