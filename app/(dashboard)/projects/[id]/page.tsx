"use client";

import { useParams } from "next/navigation";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";
import { Task } from "@/types/types";
import { TaskStatus } from "@prisma/client";
import { useProjects } from "@/hooks/useProjects";
import { Header } from "@/components/layout/Header";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listDaysCurrentToNextMonth, DayInfo } from "@/utils/dateUtils";
import { WorkDay, MonthlyHistory } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { projects, loading, error, refetch } = useProjects();
  const project = projects.find((p) => p.id === id);
  const workDays = project?.config?.workDays;
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [tempTimes, setTempTimes] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [saving, setSaving] = useState(false);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyHistory | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  console.log(workDays);
  useEffect(() => {
    const loadMonthlyHistory = async () => {
      if (!project) return;

      try {
        const response = await axios.get(
          `/api/projects/${project.id}/monthly-history?year=${currentYear}&month=${currentMonth}`
        );
        setMonthlyHistory(response.data);
      } catch (error) {
        console.error("Erro ao carregar histórico mensal:", error);
      }
    };

    loadMonthlyHistory();
  }, [project, currentYear, currentMonth]);

  useEffect(() => {
    if (project && workDays) {
      updateMonthlyHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workDays, project]);

  const updateMonthlyHistory = async () => {
    if (!project) return;

    const currentMonthDays = listDaysCurrentToNextMonth(false).filter(
      (day) =>
        day.date.getMonth() === currentMonth - 1 &&
        day.date.getFullYear() === currentYear
    );

    const records = currentMonthDays.map((day: DayInfo) => {
      const dayOfWeekMap: { [key: string]: string } = {
        Domingo: "sunday",
        "Segunda-feira": "monday",
        "Terça-feira": "tuesday",
        "Quarta-feira": "wednesday",
        "Quinta-feira": "thursday",
        "Sexta-feira": "friday",
        Sábado: "saturday",
      };

      const dayConfig = workDays?.find(
        (wd: WorkDay) => wd.day === dayOfWeekMap[day.dayOfWeek]
      );

      const enabled = dayConfig?.enabled || false;
      const start = dayConfig?.start || "09:00";
      const end = dayConfig?.end || "17:00";
      const discountLunch = dayConfig?.discountLunch || false;

      let duration = 0;
      if (enabled) {
        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        duration = endMinutes - startMinutes;

        if (discountLunch) {
          duration -= 60;
        }
      }

      return {
        date: day.date.toISOString().split("T")[0],
        dayOfWeek: day.dayOfWeek,
        enabled,
        start: enabled ? start : null,
        end: enabled ? end : null,
        discountLunch,
        duration,
      };
    });

    try {
      setSaving(true);
      const response = await axios.post(
        `/api/projects/${project.id}/monthly-history`,
        {
          year: currentYear,
          month: currentMonth,
          records,
        }
      );
      setMonthlyHistory(response.data);
    } catch (error) {
      console.error("Erro ao salvar histórico mensal:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveTimeChanges = async (
    dayKey: string,
    newStart: string,
    newEnd: string,
    newDiscountLunch?: boolean
  ) => {
    if (!project?.config) return;

    setSaving(true);
    try {
      const updatedWorkDays = workDays?.map((wd: WorkDay) => {
        if (wd.day === dayKey) {
          return {
            ...wd,
            start: newStart,
            end: newEnd,
            ...(newDiscountLunch !== undefined && {
              discountLunch: newDiscountLunch,
            }),
          };
        }
        return wd;
      });

      await axios.put(`/api/projects/${project.id}/config`, {
        hourlyRate: project.config.hourlyRate,
        workDays: updatedWorkDays,
      });

      refetch();
      setEditingDay(null);

      await updateMonthlyHistory();
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
      alert("Erro ao salvar horários");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (
    dayKey: string,
    currentStart: string,
    currentEnd: string
  ) => {
    setEditingDay(dayKey);
    setTempTimes({ start: currentStart, end: currentEnd });
  };

  const cancelEditing = () => {
    setEditingDay(null);
    setTempTimes({ start: "", end: "" });
  };

  const confirmEditing = (dayKey: string) => {
    saveTimeChanges(dayKey, tempTimes.start, tempTimes.end);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Projeto não encontrado
          </h3>
          <p className="text-gray-500">
            O projeto que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="p-6">
        <div className="w-full">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <ProjectFormModal
                mode="edit"
                project={project}
                onProjectSaved={() => {
                  refetch();
                }}
              />
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : project.status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : project.status === "planning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {project.description || "Sem descrição"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Informações</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Criado em:
                  </span>
                  <p className="text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Última atualização:
                  </span>
                  <p className="text-gray-900">
                    {new Date(project.updatedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Criador:
                  </span>
                  <p className="text-gray-900">
                    {project.user?.name || "Usuário não encontrado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Total de tarefas:
                  </span>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.tasks?.length || 0}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Tarefas concluídas:
                  </span>
                  <p className="text-2xl font-bold text-green-600">
                    {project.tasks?.filter(
                      (task: Task) => task.status === TaskStatus.done
                    ).length || 0}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Progresso:
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          project.tasks && project.tasks.length > 0
                            ? (project.tasks.filter(
                                (task: Task) => task.status === TaskStatus.done
                              ).length /
                                project.tasks.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tarefas</h2>
            {project.tasks && project.tasks.length > 0 ? (
              <div className="space-y-3">
                {project.tasks.map((task: Task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.status === TaskStatus.done
                            ? "bg-green-500"
                            : task.status === TaskStatus.inprogress
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">{task.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma tarefa encontrada
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Calendário de Trabalho - {currentMonth}/{currentYear}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newMonth =
                        currentMonth === 1 ? 12 : currentMonth - 1;
                      const newYear =
                        currentMonth === 1 ? currentYear - 1 : currentYear;
                      setCurrentMonth(newMonth);
                      setCurrentYear(newYear);
                    }}
                  >
                    ← Mês Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newMonth =
                        currentMonth === 12 ? 1 : currentMonth + 1;
                      const newYear =
                        currentMonth === 12 ? currentYear + 1 : currentYear;
                      setCurrentMonth(newMonth);
                      setCurrentYear(newYear);
                    }}
                  >
                    Próximo Mês →
                  </Button>
                </div>
                <Button
                  onClick={updateMonthlyHistory}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? "Salvando..." : "Atualizar Histórico"}
                </Button>
                {saving && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Salvando...
                  </div>
                )}
              </div>
            </div>
            {monthlyHistory && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Resumo do Mês:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    Total de Horas:{" "}
                    <span className="font-semibold">
                      {monthlyHistory.totalHours.toFixed(1)}h
                    </span>
                  </div>
                  <div>
                    Dias Trabalhados:{" "}
                    <span className="font-semibold">
                      {monthlyHistory.totalDays}
                    </span>
                  </div>
                  <div>
                    Valor Total:{" "}
                    <span className="font-semibold">
                      {project?.config?.hourlyRate
                        ? (
                            monthlyHistory.totalHours *
                            project.config.hourlyRate
                          ).toFixed(2)
                        : 0}
                      R$
                    </span>
                  </div>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Dia da Semana</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead className="text-center">Desconto Almoço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const currentMonth = new Date().getMonth();
                  const currentYear = new Date().getFullYear();
                  const allDays = listDaysCurrentToNextMonth(false);

                  const currentMonthDays = allDays.filter(
                    (day) =>
                      day.date.getMonth() === currentMonth &&
                      day.date.getFullYear() === currentYear
                  );

                  return currentMonthDays.map((day: DayInfo) => {
                    const dayOfWeekMap: { [key: string]: string } = {
                      Domingo: "sunday",
                      "Segunda-feira": "monday",
                      "Terça-feira": "tuesday",
                      "Quarta-feira": "wednesday",
                      "Quinta-feira": "thursday",
                      "Sexta-feira": "friday",
                      Sábado: "saturday",
                    };

                    const dayConfig = workDays?.find(
                      (wd: WorkDay) => wd.day === dayOfWeekMap[day.dayOfWeek]
                    );

                    const isWorkDay = dayConfig?.enabled || false;
                    const startTime = dayConfig?.start || "09:00";
                    const endTime = dayConfig?.end || "17:00";
                    const discountLunch = dayConfig?.discountLunch || false;

                    const calculateDuration = (
                      start: string,
                      end: string,
                      hasLunchDiscount: boolean
                    ) => {
                      const [startHour, startMin] = start
                        .split(":")
                        .map(Number);
                      const [endHour, endMin] = end.split(":").map(Number);
                      const startMinutes = startHour * 60 + startMin;
                      const endMinutes = endHour * 60 + endMin;
                      let durationMinutes = endMinutes - startMinutes;

                      if (hasLunchDiscount) {
                        durationMinutes -= 60;
                      }

                      const hours = Math.floor(durationMinutes / 60);
                      const minutes = durationMinutes % 60;
                      return minutes > 0 ? `${hours}h${minutes}m` : `${hours}h`;
                    };

                    const duration = isWorkDay
                      ? calculateDuration(startTime, endTime, discountLunch)
                      : "-";

                    return (
                      <TableRow
                        key={day.date.toISOString()}
                        className={`
                        ${day.isToday ? "bg-blue-50" : ""}
                        ${!isWorkDay ? "bg-gray-50" : ""}
                      `}
                      >
                        <TableCell className="font-medium">
                          {day.date.toLocaleDateString("pt-BR")}
                          {day.isToday && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Hoje
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{day.dayOfWeek}</TableCell>
                        <TableCell>
                          {isWorkDay ? (
                            editingDay === dayOfWeekMap[day.dayOfWeek] ? (
                              <Input
                                type="time"
                                value={tempTimes.start}
                                onChange={(e) =>
                                  setTempTimes({
                                    ...tempTimes,
                                    start: e.target.value,
                                  })
                                }
                                className="w-20"
                                disabled={saving}
                              />
                            ) : (
                              <button
                                onClick={() =>
                                  startEditing(
                                    dayOfWeekMap[day.dayOfWeek],
                                    startTime,
                                    endTime
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 underline"
                                disabled={saving}
                              >
                                {startTime}
                              </button>
                            )
                          ) : (
                            <Input
                              type="time"
                              value=""
                              onChange={async (e) => {
                                if (e.target.value) {
                                  // Habilitar o dia automaticamente quando preencher horário
                                  const updatedWorkDays = workDays?.map(
                                    (wd: WorkDay) => {
                                      if (
                                        wd.day === dayOfWeekMap[day.dayOfWeek]
                                      ) {
                                        return {
                                          ...wd,
                                          enabled: true,
                                          start: e.target.value,
                                        };
                                      }
                                      return wd;
                                    }
                                  );

                                  if (project?.config && updatedWorkDays) {
                                    setSaving(true);
                                    try {
                                      await axios.put(
                                        `/api/projects/${project.id}/config`,
                                        {
                                          hourlyRate: project.config.hourlyRate,
                                          workDays: updatedWorkDays,
                                        }
                                      );
                                      refetch();
                                      await updateMonthlyHistory();
                                    } catch (error) {
                                      console.error(
                                        "Erro ao habilitar dia:",
                                        error
                                      );
                                    } finally {
                                      setSaving(false);
                                    }
                                  }
                                }
                              }}
                              className="w-20"
                              disabled={saving}
                              placeholder="--:--"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {isWorkDay ? (
                            editingDay === dayOfWeekMap[day.dayOfWeek] ? (
                              <Input
                                type="time"
                                value={tempTimes.end}
                                onChange={(e) =>
                                  setTempTimes({
                                    ...tempTimes,
                                    end: e.target.value,
                                  })
                                }
                                className="w-20"
                                disabled={saving}
                              />
                            ) : (
                              <button
                                onClick={() =>
                                  startEditing(
                                    dayOfWeekMap[day.dayOfWeek],
                                    startTime,
                                    endTime
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 underline"
                                disabled={saving}
                              >
                                {endTime}
                              </button>
                            )
                          ) : (
                            <Input
                              type="time"
                              value=""
                              onChange={async (e) => {
                                if (e.target.value) {
                                  const updatedWorkDays = workDays?.map(
                                    (wd: WorkDay) => {
                                      if (
                                        wd.day === dayOfWeekMap[day.dayOfWeek]
                                      ) {
                                        return {
                                          ...wd,
                                          enabled: true,
                                          end: e.target.value,
                                        };
                                      }
                                      return wd;
                                    }
                                  );

                                  if (project?.config && updatedWorkDays) {
                                    setSaving(true);
                                    try {
                                      await axios.put(
                                        `/api/projects/${project.id}/config`,
                                        {
                                          hourlyRate: project.config.hourlyRate,
                                          workDays: updatedWorkDays,
                                        }
                                      );
                                      refetch();
                                      await updateMonthlyHistory();
                                    } catch (error) {
                                      console.error(
                                        "Erro ao habilitar dia:",
                                        error
                                      );
                                    } finally {
                                      setSaving(false);
                                    }
                                  }
                                }
                              }}
                              className="w-20"
                              disabled={saving}
                              placeholder="--:--"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isWorkDay ? (
                            <input
                              type="checkbox"
                              checked={discountLunch}
                              onChange={async (e) => {
                                const dayKey = dayOfWeekMap[day.dayOfWeek];
                                const updatedWorkDays = workDays?.map(
                                  (wd: WorkDay) => {
                                    if (wd.day === dayKey) {
                                      return {
                                        ...wd,
                                        discountLunch: e.target.checked,
                                      };
                                    }
                                    return wd;
                                  }
                                );

                                if (project?.config && updatedWorkDays) {
                                  setSaving(true);
                                  try {
                                    await axios.put(
                                      `/api/projects/${project.id}/config`,
                                      {
                                        hourlyRate: project.config.hourlyRate,
                                        workDays: updatedWorkDays,
                                      }
                                    );
                                    refetch();
                                  } catch (error) {
                                    console.error(
                                      "Erro ao salvar desconto de almoço:",
                                      error
                                    );
                                    alert("Erro ao salvar desconto de almoço");
                                  } finally {
                                    setSaving(false);
                                  }
                                }

                                await updateMonthlyHistory();
                              }}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                              disabled={saving}
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {editingDay === dayOfWeekMap[day.dayOfWeek] ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  confirmEditing(dayOfWeekMap[day.dayOfWeek])
                                }
                                className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded bg-green-50"
                                disabled={saving}
                              >
                                ✓
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded bg-red-50"
                                disabled={saving}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            duration
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isWorkDay
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isWorkDay ? "Dia útil" : "Folga"}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {isWorkDay
                            ? "Dia de trabalho"
                            : "Não é dia de trabalho"}
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
