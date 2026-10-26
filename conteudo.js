// =====================================================================
//  CONTEÚDO DO APP — arquivo para a equipe revisar e editar
// ---------------------------------------------------------------------
//  Regras para editar sem quebrar nada:
//  - Mude só o texto que está entre aspas "assim".
//  - Cada item de lista termina com vírgula.
//  - Para acrescentar um tópico, copie uma linha inteira e mude o texto.
//  - Quando o texto estiver validado, troque  rascunho: true  por  rascunho: false
// =====================================================================

window.CONTEUDO = {
  rascunho: true,

  app: {
    nome: "Cuidar em Casa",
    subtitulo: "Orientações de alta em um só lugar",
  },

  areas: [
    {
      id: "nutricao",
      titulo: "Nutrição",
      icone: "🍲",
      fazer: [
        "Ofereça pequenas porções várias vezes ao dia (6 a 8 vezes), sem forçar.",
        "Respeite o apetite e as preferências da pessoa. Comer também é conforto.",
        "Deixe água, sucos ou chás sempre por perto e ofereça aos goles.",
        "Se for difícil mastigar ou engolir, prefira alimentos macios, amassados ou pastosos.",
        "Com a boca seca ou com feridas, evite comida ácida, apimentada ou muito quente.",
      ],
      procurar: [
        "Não consegue comer nem beber há mais de 1 dia.",
        "Engasga ou tosse sempre que engole.",
        "Vômitos que não param.",
      ],
    },
    {
      id: "enfermagem",
      titulo: "Enfermagem",
      icone: "🩺",
      fazer: [
        "Dê os remédios nos horários marcados. O remédio de dor é no horário, mesmo sem dor.",
        "Se a pessoa fica muito na cama, mude a posição a cada 2 horas.",
        "Mantenha a pele limpa e hidratada. Olhe todo dia calcanhares, quadril e final das costas.",
        "Faça o curativo ou o cuidado com a sonda do jeito que a equipe ensinou.",
        "Lave as mãos antes e depois de cada cuidado.",
      ],
      procurar: [
        "Dor que não melhora com o remédio.",
        "Febre (37,8 °C ou mais).",
        "Ferida nova, ou ferida que piora, com cheiro ou secreção.",
        "Não urina há 12 horas ou está sem evacuar há 3 dias.",
      ],
    },
    {
      id: "odonto",
      titulo: "Saúde da boca",
      icone: "🦷",
      fazer: [
        "Limpe a boca 2 vezes ao dia e depois das refeições, com escova macia ou gaze molhada.",
        "Prótese (dentadura): tire à noite, lave com escova e guarde num copo com água.",
        "Passe hidratante nos lábios várias vezes ao dia.",
        "Boca seca: ofereça goles de água com frequência.",
        "Não use enxaguante bucal com álcool.",
      ],
      procurar: [
        "Feridas na boca que doem e atrapalham comer.",
        "Placas brancas na língua ou na bochecha (sapinho).",
        "Sangramento na gengiva que não para.",
        "Prótese machucando, dor de dente ou rosto inchado.",
      ],
    },
  ],

  alertas: [
    {
      id: "samu",
      titulo: "Ligue para o SAMU 192",
      cor: "perigo",
      itens: [
        "Falta de ar forte ou que começou de repente.",
        "Desmaio, não acorda ou ficou confuso de repente.",
        "Sangramento grande.",
        "Convulsão (crise de tremores).",
        "Dor forte no peito.",
      ],
      nota: "Se a equipe já combinou com a família um plano de cuidados para essas situações, siga o plano e ligue para a equipe.",
    },
    {
      id: "equipe",
      titulo: "Ligue para a equipe de cuidados",
      cor: "atencao",
      itens: [
        "Dor que não passa com o remédio.",
        "Vômitos que não param.",
        "Febre.",
        "Não come nem bebe há mais de 1 dia.",
        "Agitação ou confusão que não tinha antes.",
      ],
    },
    {
      id: "ubs",
      titulo: "Procure a UBS",
      cor: "info",
      itens: [
        "Renovar receitas.",
        "Trocar curativos e tirar dúvidas.",
        "Pedir visita domiciliar.",
      ],
    },
  ],

  // Usado pelo botão "Preencher exemplo" em Meus dados (para a apresentação)
  exemplo: {
    paciente: {
      nome: "Maria da Silva",
      cuidador: "João (filho)",
      dataAlta: "2026-10-26",
      profissional: "Equipe de Cuidados Paliativos",
    },
    remedios: [
      { nome: "Morfina 10 mg", dose: "1 comprimido", para: "Dor", horarios: "06:00, 10:00, 14:00, 18:00, 22:00" },
      { nome: "Ondansetrona 8 mg", dose: "1 comprimido", para: "Enjoo", horarios: "08:00, 20:00" },
      { nome: "Lactulose", dose: "15 ml", para: "Intestino", horarios: "08:00" },
    ],
    cuidados: [
      { texto: "Limpar a boca", horarios: "08:00, 13:00, 21:00" },
      { texto: "Mudar de posição na cama", horarios: "08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00" },
      { texto: "Hidratar a pele", horarios: "09:00" },
    ],
    contatos: [
      { nome: "Equipe de Cuidados Paliativos", papel: "Equipe", telefone: "(51) 3333-0000" },
      { nome: "UBS Centro", papel: "UBS", telefone: "(51) 3333-1111" },
      { nome: "João", papel: "Filho", telefone: "(51) 99999-0000" },
    ],
  },
};
