"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectList } from "@/components/project/ProjectList";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";
import { SearchInput } from "@/components/ui/search-input";
import { Header } from "@/components/layout/Header";
import { AuthDebug } from "@/components/debug/AuthDebug";

export default function DashboardPage() {
  const {
    projects,
    loading,
    error,
    pagination,
    setPage,
    setSearch,
    deleteProject,
  } = useProjects();

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="p-6">
        {/* Barra de ações DENTRO do mesmo container da lista */}
        <div className="space-y-6">
          {/* Ações alinhadas com a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4">
              <div className="flex items-center gap-4">
                <SearchInput onSearch={setSearch} />
                {pagination && (
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {pagination.total} projeto
                    {pagination.total !== 1 ? "s" : ""} encontrado
                    {pagination.total !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <ProjectFormModal mode="create" />
            </div>
          </div>

          {/* Lista de projetos */}
          <ProjectList
            projects={projects}
            loading={loading}
            error={error}
            pagination={pagination}
            onPageChange={setPage}
            onDelete={deleteProject}
            showSearch={false}
          />
        </div>
      </div>
      <AuthDebug />
    </div>
  );
}
