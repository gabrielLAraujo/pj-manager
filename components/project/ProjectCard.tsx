import { ProjectResponse } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ProjectFormModal } from "./ProjectFormModal";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  project: ProjectResponse;
  onDelete?: (projectId: string) => Promise<void>;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja deletar o projeto "${project.name}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(project.id);
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      alert("Erro ao deletar projeto. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 p-6">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {project.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Deletar projeto"
            >
              <Trash className="w-4 h-4" />
            </Button>
          )}
          <ProjectFormModal
            mode="edit"
            project={project}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                title="Editar projeto"
              >
                ✏️
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-6">
        <CardDescription className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {project.description || "Sem descrição"}
        </CardDescription>

        {project.config && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Valor/hora: R$ {project.config.hourlyRate.toFixed(2)}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Criado em{" "}
            {new Date(project.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        <Button
          variant="link"
          className="px-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          onClick={() => router.push(`/projects/${project.id}`)}
        >
          Ver detalhes →
        </Button>
      </CardFooter>
    </Card>
  );
}
