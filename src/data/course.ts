export interface ICourseData {
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
