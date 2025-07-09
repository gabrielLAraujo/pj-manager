"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProjectStatus, WorkDay } from "@/types/types";
import { CreateProjectRequest, UpdateProjectRequest } from "@/types/api";
import { Project } from "@/types/types";
import { useProjects } from "@/hooks/useProjects";
import axios from "axios";

interface ProjectFormModalProps {
  mode: "create" | "edit";
  project?: Project;
  trigger?: React.ReactNode;
  onProjectSaved?: (project: Project) => void;
}

export function ProjectFormModal({
  mode,
  project,
  trigger,
  onProjectSaved,
}: ProjectFormModalProps) {
  const { createProject, updateProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Configuração padrão para projetos
  const defaultConfig = {
    hourlyRate: 50.0,
    workDays: [
      {
        day: "monday",
        enabled: true,
        start: "07:00",
        end: "17:00",
        discountLunch: true,
      },
      {
        day: "tuesday",
        enabled: true,
        start: "07:00",
        end: "17:00",
        discountLunch: true,
      },
      {
        day: "wednesday",
        enabled: true,
        start: "07:00",
        end: "17:00",
        discountLunch: true,
      },
      {
        day: "thursday",
        enabled: true,
        start: "07:00",
        end: "17:00",
        discountLunch: true,
      },
      {
        day: "friday",
        enabled: true,
        start: "07:00",
        end: "16:00",
        discountLunch: true,
      },
      {
        day: "saturday",
        enabled: false,
        start: "07:00",
        end: "17:00",
        discountLunch: false,
      },
      {
        day: "sunday",
        enabled: false,
        start: "07:00",
        end: "17:00",
        discountLunch: false,
      },
    ],
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as ProjectStatus,
    hourlyRate: defaultConfig.hourlyRate,
    workDays: defaultConfig.workDays,
  });

  useEffect(() => {
    if (mode === "edit" && project) {
      setFormData({
        name: project.name,
        description: project.description || "",
        status: project.status,
        hourlyRate: project.config?.hourlyRate || defaultConfig.hourlyRate,
        workDays: project.config?.workDays || defaultConfig.workDays,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "planning",
        hourlyRate: defaultConfig.hourlyRate,
        workDays: defaultConfig.workDays,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nome do projeto é obrigatório");
      return;
    }

    try {
      setLoading(true);

      if (mode === "create") {
        const projectData: CreateProjectRequest = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status,
        };

        const newProject = await createProject(projectData);

        // Criar configuração do projeto
        await axios.post(`/api/projects/${newProject.id}/config`, {
          hourlyRate: formData.hourlyRate,
          workDays: formData.workDays,
        });

        if (onProjectSaved) {
          onProjectSaved(newProject);
        }

        alert("Projeto criado com sucesso!");
      } else {
        if (!project) return;

        const updateData: UpdateProjectRequest = {
          id: project.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status,
        };

        const updatedProject = await updateProject(project.id, updateData);

        try {
          await axios.put(`/api/projects/${project.id}/config`, {
            hourlyRate: formData.hourlyRate,
            workDays: formData.workDays,
          });
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            await axios.post(`/api/projects/${project.id}/config`, {
              hourlyRate: formData.hourlyRate,
              workDays: formData.workDays,
            });
          } else {
            throw error;
          }
        }

        if (onProjectSaved) {
          onProjectSaved(updatedProject);
        }

        alert("Projeto atualizado com sucesso!");
      }

      setOpen(false);

      // Reset form apenas após sucesso
      if (mode === "create") {
        setFormData({
          name: "",
          description: "",
          status: "planning",
          hourlyRate: defaultConfig.hourlyRate,
          workDays: defaultConfig.workDays,
        });
      }
    } catch (error) {
      console.error(
        `Erro ao ${mode === "create" ? "criar" : "atualizar"} projeto:`,
        error
      );
      alert(`Erro ao ${mode === "create" ? "criar" : "atualizar"} projeto`);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkDay = (
    index: number,
    field: keyof WorkDay,
    value: string | boolean
  ) => {
    const newWorkDays = [...formData.workDays];
    newWorkDays[index] = { ...newWorkDays[index], [field]: value };
    setFormData({ ...formData, workDays: newWorkDays });
  };

  const defaultTrigger = (
    <Button
      variant={mode === "create" ? "default" : "outline"}
      className="whitespace-nowrap"
    >
      {mode === "create" ? "+ Novo Projeto" : "Editar"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Novo Projeto" : "Editar Projeto"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações do novo projeto abaixo."
              : "Atualize as informações do projeto."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Projeto *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Digite o nome do projeto"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição do projeto (opcional)"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as ProjectStatus })
                }
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="active">Em Andamento</SelectItem>
                  <SelectItem value="inactive">Pausado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Configurações</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Valor/hora (R$)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourlyRate: Number(e.target.value),
                    })
                  }
                  disabled={loading}
                />
              </div>

              {/* Dias de Trabalho */}
              <div className="space-y-3">
                <Label>Dias de Trabalho</Label>
                <div className="space-y-2">
                  {formData.workDays.map((workDay, index) => (
                    <div
                      key={workDay.day}
                      className="flex items-center space-x-4 p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2 min-w-[120px]">
                        <Switch
                          checked={workDay.enabled}
                          onCheckedChange={(checked: boolean) =>
                            updateWorkDay(index, "enabled", checked)
                          }
                          disabled={loading}
                        />
                        <Label className="text-sm capitalize">
                          {workDay.day === "monday" && "Segunda"}
                          {workDay.day === "tuesday" && "Terça"}
                          {workDay.day === "wednesday" && "Quarta"}
                          {workDay.day === "thursday" && "Quinta"}
                          {workDay.day === "friday" && "Sexta"}
                          {workDay.day === "saturday" && "Sábado"}
                          {workDay.day === "sunday" && "Domingo"}
                        </Label>
                      </div>

                      {workDay.enabled && (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            type="time"
                            value={workDay.start}
                            onChange={(e) =>
                              updateWorkDay(index, "start", e.target.value)
                            }
                            disabled={loading}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">às</span>
                          <Input
                            type="time"
                            value={workDay.end}
                            onChange={(e) =>
                              updateWorkDay(index, "end", e.target.value)
                            }
                            disabled={loading}
                            className="w-24"
                          />
                          <div className="flex items-center space-x-2 ml-4">
                            <Switch
                              checked={workDay.discountLunch}
                              onCheckedChange={(checked: boolean) =>
                                updateWorkDay(index, "discountLunch", checked)
                              }
                              disabled={loading}
                            />
                            <Label className="text-xs text-gray-600">
                              Descontar almoço
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Criando..."
                  : "Salvando..."
                : mode === "create"
                ? "Criar Projeto"
                : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
