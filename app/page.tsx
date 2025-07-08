"use client";
import { ProjectForm } from "@/components/project/ProjectForm";
import { ProjectList } from "@/components/project/ProjectList";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectInput } from "@/types/api";

export default function Home() {
  const { projects, loading, error, createProject, deleteProject } =
    useProjects();

  const handleProjectSubmit = async (projectData: CreateProjectInput) => {
    await createProject(projectData);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Projetos</h1>
        <ProjectForm onSubmit={handleProjectSubmit} loading={loading} />
      </div>

      <ProjectList
        projects={projects}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
}
