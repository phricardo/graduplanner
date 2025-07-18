import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  GraduationCap,
  Share2,
  Copy,
  CheckCheck,
  Target,
} from "lucide-react";
import { data } from "@/data/courseData";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Subject {
  nome: string;
  prerequisitos?: string[];
}

interface Period {
  periodo: string;
  disciplinas: Subject[];
}

type SubjectStatus =
  | "completed"
  | "current"
  | "planned"
  | "available"
  | "locked";

const CourseTracker = () => {
  const [completedSubjects, setCompletedSubjects] = useState<Set<string>>(
    new Set()
  );
  const [currentSubjects, setCurrentSubjects] = useState<Set<string>>(
    new Set()
  );
  const [plannedSubjects, setPlannedSubjects] = useState<Set<string>>(
    new Set()
  );
  const [finalizedPeriods, setFinalizedPeriods] = useState<Set<number>>(
    new Set()
  );
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { toast } = useToast();

  // Função para determinar o semestre atual
  const getCurrentSemester = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() retorna 0-11

    // Janeiro a Junho = primeiro semestre (.1)
    // Julho a Dezembro = segundo semestre (.2)
    const semester = month <= 6 ? 1 : 2;

    return `${year}.${semester}`;
  };

  // Carregar dados do localStorage ou URL ao inicializar
  useEffect(() => {
    const loadData = () => {
      // Primeiro, tenta carregar da URL
      const urlParams = new URLSearchParams(window.location.search);
      const urlData = urlParams.get("data");

      if (urlData) {
        try {
          const decodedData = JSON.parse(decodeURIComponent(urlData));
          setCompletedSubjects(new Set(decodedData.completed || []));
          setCurrentSubjects(new Set(decodedData.current || []));
          setPlannedSubjects(new Set(decodedData.planned || []));
          setFinalizedPeriods(new Set(decodedData.finalizedPeriods || []));

          // Salva no localStorage após carregar da URL
          localStorage.setItem("courseProgress", JSON.stringify(decodedData));

          // Remove os parâmetros da URL para limpar
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);

          toast({
            title: "Dados carregados!",
            description: "Seu progresso foi carregado do link compartilhado.",
          });

          return;
        } catch (error) {
          console.error("Erro ao carregar dados da URL:", error);
        }
      }

      // Se não há dados na URL, carrega do localStorage
      const savedData = localStorage.getItem("courseProgress");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setCompletedSubjects(new Set(parsedData.completed || []));
          setCurrentSubjects(new Set(parsedData.current || []));
          setPlannedSubjects(new Set(parsedData.planned || []));
          setFinalizedPeriods(new Set(parsedData.finalizedPeriods || []));
        } catch (error) {
          console.error("Erro ao carregar dados do localStorage:", error);
        }
      }
    };

    loadData();
  }, [toast]);

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    const dataToSave = {
      completed: Array.from(completedSubjects),
      current: Array.from(currentSubjects),
      planned: Array.from(plannedSubjects),
      finalizedPeriods: Array.from(finalizedPeriods),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("courseProgress", JSON.stringify(dataToSave));
  }, [completedSubjects, currentSubjects, plannedSubjects, finalizedPeriods]);

  const getSubjectStatus = (subject: Subject): SubjectStatus => {
    if (completedSubjects.has(subject.nome)) return "completed";
    if (currentSubjects.has(subject.nome)) return "current";
    if (plannedSubjects.has(subject.nome)) return "planned";

    if (subject.prerequisitos) {
      const hasAllPrerequisites = subject.prerequisitos.every((prereq) =>
        completedSubjects.has(prereq)
      );
      return hasAllPrerequisites ? "available" : "locked";
    }

    return "available";
  };

  const toggleSubjectStatus = (
    subjectName: string,
    currentStatus: SubjectStatus
  ) => {
    if (currentStatus === "locked") return;

    const newCompleted = new Set(completedSubjects);
    const newCurrent = new Set(currentSubjects);
    const newPlanned = new Set(plannedSubjects);

    if (currentStatus === "completed") {
      newCompleted.delete(subjectName);
    } else if (currentStatus === "current") {
      newCurrent.delete(subjectName);
      newCompleted.add(subjectName);
    } else if (currentStatus === "planned") {
      newPlanned.delete(subjectName);
      newCurrent.add(subjectName);
    } else if (currentStatus === "available") {
      newPlanned.add(subjectName);
    }

    setCompletedSubjects(newCompleted);
    setCurrentSubjects(newCurrent);
    setPlannedSubjects(newPlanned);
  };

  const shareProgress = async () => {
    const dataToShare = {
      completed: Array.from(completedSubjects),
      current: Array.from(currentSubjects),
      planned: Array.from(plannedSubjects),
      finalizedPeriods: Array.from(finalizedPeriods),
      timestamp: new Date().toISOString(),
    };

    const encodedData = encodeURIComponent(JSON.stringify(dataToShare));
    const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Meu Progresso no Curso de Sistemas de Informação",
          text: "Confira meu progresso no curso!",
          url: shareUrl,
        });
      } else {
        // Fallback: copiar para clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copiado!",
          description:
            "O link com seu progresso foi copiado para a área de transferência.",
        });
      }
    } catch (error) {
      // Fallback manual
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      toast({
        title: "Link copiado!",
        description:
          "O link com seu progresso foi copiado para a área de transferência.",
      });
    }
  };

  const clearProgress = () => {
    setCompletedSubjects(new Set());
    setCurrentSubjects(new Set());
    setPlannedSubjects(new Set());
    setFinalizedPeriods(new Set());
    localStorage.removeItem("courseProgress");

    toast({
      title: "Progresso limpo!",
      description: "Todos os dados foram removidos.",
    });
  };

  const getStatusIcon = (status: SubjectStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "current":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "planned":
        return <Target className="w-5 h-5 text-orange-600" />;
      case "available":
        return <Circle className="w-5 h-5 text-gray-400" />;
      case "locked":
        return <Circle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: SubjectStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-800";
      case "current":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "planned":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "available":
        return "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
      case "locked":
        return "bg-red-50 border-red-200 text-red-600 cursor-not-allowed";
    }
  };

  const calculateProgress = () => {
    const totalSubjects = data.periodos.reduce(
      (acc, period) => acc + period.disciplinas.length,
      0
    );
    const completedCount = completedSubjects.size;
    const currentCount = currentSubjects.size;
    const plannedCount = plannedSubjects.size;
    const progressPercentage = Math.round(
      (completedCount / totalSubjects) * 100
    );

    return {
      total: totalSubjects,
      completed: completedCount,
      current: currentCount,
      planned: plannedCount,
      percentage: progressPercentage,
    };
  };

  const estimateGraduation = () => {
    const progress = calculateProgress();
    const currentSemester = getCurrentSemester();
    const [currentYear, currentSemesterNumber] = currentSemester
      .split(".")
      .map(Number);

    // Disciplinas restantes (excluindo as já planejadas para este ano)
    const remainingSubjects =
      progress.total - progress.completed - progress.current - progress.planned;

    // Considerar disciplinas planejadas para este ano
    let semestersFromPlanned = 0;
    if (progress.planned > 0) {
      // Se há disciplinas planejadas, elas serão cursadas ainda este ano
      const remainingSemestersThisYear = currentSemesterNumber === 1 ? 1 : 0; // Se estamos no .1, ainda temos o .2
      semestersFromPlanned = remainingSemestersThisYear > 0 ? 0 : 1; // Se não há mais semestres este ano, adiciona 1
    }

    const subjectsPerSemester = 6; // Considerando 6 disciplinas por semestre
    const remainingSemesters =
      Math.ceil(remainingSubjects / subjectsPerSemester) + semestersFromPlanned;

    // Calcular ano de formatura
    let graduationYear = currentYear;
    let graduationSemester = currentSemesterNumber;

    // Adicionar os semestres restantes
    for (let i = 0; i < remainingSemesters; i++) {
      graduationSemester++;
      if (graduationSemester > 2) {
        graduationSemester = 1;
        graduationYear++;
      }
    }

    return {
      remainingSubjects,
      remainingSemesters,
      graduationYear,
      graduationSemester: `${graduationYear}.${graduationSemester}`,
      currentSemester,
    };
  };

  const getRecommendations = () => {
    const availableSubjects: Subject[] = [];

    data.periodos.forEach((period) => {
      period.disciplinas.forEach((subject) => {
        const status = getSubjectStatus(subject);
        if (status === "available") {
          availableSubjects.push(subject);
        }
      });
    });

    // Priorizar disciplinas que desbloqueiam outras
    const prioritySubjects = availableSubjects.filter((subject) => {
      const dependentCount = data.periodos.reduce((acc, period) => {
        return (
          acc +
          period.disciplinas.filter((s) =>
            s.prerequisitos?.includes(subject.nome)
          ).length
        );
      }, 0);
      return dependentCount > 0;
    });

    return {
      priority: prioritySubjects.slice(0, 4),
      other: availableSubjects
        .filter((s) => !prioritySubjects.includes(s))
        .slice(0, 2),
    };
  };

  const canFinalizePeriod = (periodIndex: number) => {
    // Se o período já foi finalizado, não pode ser finalizado novamente
    if (finalizedPeriods.has(periodIndex)) {
      return false;
    }

    const period = data.periodos[periodIndex];

    // Verifica se há disciplinas bloqueadas no período
    const hasLockedSubjects = period.disciplinas.some((subject) => {
      const status = getSubjectStatus(subject);
      return status === "locked";
    });

    return !hasLockedSubjects;
  };

  const completeAllPeriodSubjects = (periodIndex: number) => {
    if (!canFinalizePeriod(periodIndex)) {
      return;
    }

    const period = data.periodos[periodIndex];
    const newCompleted = new Set(completedSubjects);
    const newCurrent = new Set(currentSubjects);
    const newPlanned = new Set(plannedSubjects);
    const newFinalizedPeriods = new Set(finalizedPeriods);

    let completedCount = 0;

    period.disciplinas.forEach((subject) => {
      const status = getSubjectStatus(subject);
      if (status !== "locked") {
        // Remove from current and planned if it was there
        newCurrent.delete(subject.nome);
        newPlanned.delete(subject.nome);
        // Add to completed
        newCompleted.add(subject.nome);
        completedCount++;
      }
    });

    // Marca o período como finalizado
    newFinalizedPeriods.add(periodIndex);

    setCompletedSubjects(newCompleted);
    setCurrentSubjects(newCurrent);
    setPlannedSubjects(newPlanned);
    setFinalizedPeriods(newFinalizedPeriods);

    toast({
      title: "Período finalizado!",
      description: `${completedCount} disciplinas foram marcadas como concluídas.`,
    });
  };

  const progress = calculateProgress();
  const graduation = estimateGraduation();
  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <GraduationCap className="w-10 h-10 text-blue-600" />
            GraduPlanner
          </h1>
          <p className="text-gray-600">
            {data.curso.nome} - {data.curso.campus}/{data.curso.instituicao}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Semestre atual: {graduation.currentSemester}
          </p>
        </div>

        {/* Legend - Moved to top */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Como usar:</h3>
            <div className="mb-4 text-sm text-gray-600">
              <p className="mb-1">
                • <strong>Primeiro clique</strong> na disciplina: marca como
                "Planejada para este ano"
              </p>
              <p className="mb-1">
                • <strong>Segundo clique</strong> na disciplina: marca como
                "Cursando"
              </p>
              <p>
                • <strong>Terceiro clique</strong> na disciplina: marca como
                "Concluída"
              </p>
            </div>
            <h4 className="font-semibold mb-3">Legenda:</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Concluída</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Cursando</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span>Planejada para este ano</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-gray-400" />
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-red-400" />
                <span>Bloqueada (faltam pré-requisitos)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={shareProgress}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar Progresso
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Limpar Progresso
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja limpar todo o progresso?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é <strong>irreversível</strong>. Todos os dados do
                  seu progresso serão perdidos permanentemente e você terá que
                  preencher tudo novamente do zero.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearProgress}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sim, limpar tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Progress Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {progress.percentage}%
                </div>
                <div className="text-gray-600">Progresso Geral</div>
                <div className="text-sm text-gray-500 mt-1">
                  {progress.completed} de {progress.total} disciplinas
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {graduation.graduationSemester}
                </div>
                <div className="text-gray-600">Previsão de Formatura</div>
                <div className="text-sm text-gray-500 mt-1">
                  {graduation.remainingSemesters} semestres restantes
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {progress.current}
                </div>
                <div className="text-gray-600">Cursando Agora</div>
                <div className="text-sm text-gray-500 mt-1">
                  disciplinas em andamento
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {progress.planned}
                </div>
                <div className="text-gray-600">Planejadas</div>
                <div className="text-sm text-gray-500 mt-1">
                  para este ano ({graduation.currentSemester.split(".")[0]})
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowRecommendations(!showRecommendations)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {showRecommendations ? "Ocultar" : "Ver"} Recomendações do Próximo
            Semestre
          </Button>
        </div>

        {/* Recommendations */}
        {showRecommendations && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">
                Recomendações para o Próximo Semestre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    Disciplinas Prioritárias (desbloqueiam outras):
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {recommendations.priority.map((subject, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="p-2 bg-green-100 text-green-800"
                      >
                        {subject.nome}
                      </Badge>
                    ))}
                  </div>
                </div>

                {recommendations.other.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      Outras Opções Disponíveis:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {recommendations.other.map((subject, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="p-2 bg-blue-100 text-blue-800"
                        >
                          {subject.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso do Curso</span>
              <span>
                {progress.completed}/{progress.total} disciplinas
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Periods Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {data.periodos.map((period, periodIndex) => {
            const canFinalize = canFinalizePeriod(periodIndex);
            const isFinalized = finalizedPeriods.has(periodIndex);

            return (
              <Card key={periodIndex} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-800">
                      {period.periodo}
                    </CardTitle>
                    <Button
                      onClick={() => completeAllPeriodSubjects(periodIndex)}
                      size="sm"
                      disabled={!canFinalize}
                      className={`${
                        isFinalized
                          ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                          : canFinalize
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      } text-white`}
                    >
                      <CheckCheck className="w-4 h-4 mr-1" />
                      {isFinalized ? "Período Finalizado" : "Finalizar Período"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {period.disciplinas.map((subject, subjectIndex) => {
                      const status = getSubjectStatus(subject);
                      return (
                        <div
                          key={subjectIndex}
                          className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${getStatusColor(
                            status
                          )}`}
                          onClick={() =>
                            toggleSubjectStatus(subject.nome, status)
                          }
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(status)}
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {subject.nome}
                              </div>
                              {subject.prerequisitos && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Pré-requisitos:{" "}
                                  {subject.prerequisitos.join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseTracker;
