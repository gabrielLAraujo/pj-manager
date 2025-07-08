import { Project } from "@/types/types";
import { ProjectCard } from "./ProjectCard";

export function ProjectList({
  projects,
  loading,
  error,
}: {
  projects: Project[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar projetos: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        {projects.length === 0 && !loading && <p>Nenhum projeto encontrado</p>}
      </div>{" "}
    </div>
  );
}
