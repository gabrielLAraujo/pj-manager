import { Project } from "@/types/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
}

export function ProjectList({
  projects,
  loading,
  error,
  onDelete,
}: ProjectListProps) {
  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDelete}
            />
          ))}
      </div>

      {projects.length === 0 && !loading && (
        <p className="text-gray-500 text-center py-8">
          Nenhum projeto encontrado
        </p>
      )}
    </div>
  );
}
