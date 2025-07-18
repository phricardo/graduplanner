interface Data {
  curso: {
    nome: string;
    instituicao: string;
    campus: string;
    nivel: string;
    grau: string;
    modalidade: string;
    implantacao: string;
    turno: string;
    periodicidade: string;
  };
  periodos: {
    periodo: string;
    disciplinas: {
      nome: string;
      prerequisitos?: string[];
    }[];
  }[];
}

export const data: Data = {
  curso: {
    nome: "Sistemas de Informação",
    instituicao: "CEFET/RJ",
    campus: "Nova Friburgo",
    nivel: "Graduação",
    grau: "Bacharelado",
    modalidade: "Presencial",
    implantacao: "2014/1",
    turno: "Noite",
    periodicidade: "Semestral",
  },
  periodos: [
    {
      periodo: "1º período",
      disciplinas: [
        { nome: "Construção de Algoritmos" },
        { nome: "Arquitetura de Computadores" },
        { nome: "Fund. de Administração" },
        { nome: "Gestão de Proc. de Negócios" },
        { nome: "Fundamentos da Matemática" },
        { nome: "Matemática Discreta" },
        { nome: "Fundamentos de SI" },
      ],
    },
    {
      periodo: "2º período",
      disciplinas: [
        {
          nome: "Programação Estruturada",
          prerequisitos: ["Construção de Algoritmos"],
        },
        { nome: "Fundamentos de Redes" },
        { nome: "Modelagem de Dados" },
        { nome: "Engenharia de Requisitos" },
        {
          nome: "Cálculo Dif. e Integral",
          prerequisitos: ["Fundamentos da Matemática"],
        },
        { nome: "Metodologia da Pesquisa Científica" },
      ],
    },
    {
      periodo: "3º período",
      disciplinas: [
        {
          nome: "Programação Orientada a Objetos",
          prerequisitos: ["Programação Estruturada"],
        },
        { nome: "Fundamentos da Web" },
        { nome: "Banco de Dados 1", prerequisitos: ["Modelagem de Dados"] },
        { nome: "Álgebra Linear" },
        {
          nome: "Algoritmos e Est. de Dados",
          prerequisitos: ["Programação Estruturada", "Matemática Discreta"],
        },
      ],
    },
    {
      periodo: "4º período",
      disciplinas: [
        {
          nome: "Programação de Aplicações Coorporativas",
          prerequisitos: [
            "Programação Orientada a Objetos",
            "Fundamentos da Web",
          ],
        },
        {
          nome: "Sistemas Operacionais",
          prerequisitos: ["Arquitetura de Computadores"],
        },
        { nome: "Banco de Dados 2", prerequisitos: ["Banco de Dados 1"] },
        { nome: "Adm. de Banco de Dados", prerequisitos: ["Banco de Dados 1"] },
        {
          nome: "Engenharia de Software",
          prerequisitos: ["Engenharia de Requisitos"],
        },
        {
          nome: "Análise e Proj. de Sistemas",
          prerequisitos: ["Engenharia de Requisitos"],
        },
        {
          nome: "Algoritmos em Grafos",
          prerequisitos: ["Algoritmos e Est. de Dados"],
        },
      ],
    },
    {
      periodo: "5º período",
      disciplinas: [
        { nome: "Programação para Web", prerequisitos: ["Fundamentos da Web"] },
        {
          nome: "Administração de Redes",
          prerequisitos: ["Fundamentos de Redes"],
        },
        { nome: "Probabilidade e Estatística" },
        { nome: "Gestão do Conhecimento da Informação" },
        {
          nome: "Qualidade de Software",
          prerequisitos: ["Engenharia de Software"],
        },
        {
          nome: "Projeto e Arq. de Software",
          prerequisitos: ["Análise e Proj. de Sistemas"],
        },
      ],
    },
    {
      periodo: "6º período",
      disciplinas: [
        {
          nome: "Programação Paralela e Concorrente",
          prerequisitos: ["Sistemas Operacionais"],
        },
        {
          nome: "Seg. e Auditoria de Sistemas",
          prerequisitos: ["Sistemas Operacionais", "Administração de Redes"],
        },
        {
          nome: "Progr. de Clientes Web",
          prerequisitos: ["Programação para Web"],
        },
        {
          nome: "Teste e Manut. de Software",
          prerequisitos: ["Qualidade de Software"],
        },
        { nome: "Empreendedor Digital" },
        { nome: "Optativa I" },
      ],
    },
    {
      periodo: "7º período",
      disciplinas: [
        { nome: "Gestão de Projetos de TI" },
        { nome: "Interação H/C" },
        { nome: "Tecnologias Sustentáveis" },
        { nome: "Ética" },
        { nome: "Projeto Final I", prerequisitos: ["70% do curso concluído"] },
        { nome: "Optativa II" },
      ],
    },
    {
      periodo: "8º período",
      disciplinas: [
        { nome: "Governança de TI" },
        { nome: "Optativa III" },
        { nome: "Leg. e Prop. Intelectual" },
        { nome: "Projeto Final II", prerequisitos: ["Projeto Final I"] },
        { nome: "Optativa IV" },
        { nome: "Economia" },
      ],
    },
  ],
};
