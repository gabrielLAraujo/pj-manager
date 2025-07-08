"use client";
import { ProjectForm } from "@/components/project/ProjectForm";
import { ProjectList } from "@/components/project/ProjectList";
import { useProjects } from "@/hooks/useProjects";

export default function Home() {
  const { projects, loading, error } = useProjects();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Projetos</h1>
      <div className="flex  mb-6">
        <ProjectForm />
      </div>
      <ProjectList projects={projects} loading={loading} error={error} />
    </div>
  );
}
