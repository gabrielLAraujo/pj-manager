import { ProjectCard } from "./ProjectCard";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { ProjectResponse, PaginationMeta } from "@/types/api";

interface ProjectListProps {
  projects: ProjectResponse[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onSearch?: (search: string) => void;
  onDelete?: (projectId: string) => Promise<void>;
  showSearch?: boolean;
}

export function ProjectList({
  projects,
  loading,
  error,
  pagination,
  onPageChange,
  onSearch,
  onDelete,
  showSearch = true,
}: ProjectListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {showSearch && (
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(9)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erro ao carregar projetos
        </h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Busca - apenas se showSearch for true */}
      {showSearch && onSearch && (
        <div className="flex justify-between items-center">
          <SearchInput onSearch={onSearch} />
          {pagination && (
            <div className="text-sm text-gray-500">
              {pagination.total} projeto{pagination.total !== 1 ? "s" : ""}{" "}
              encontrado{pagination.total !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-500">
            Crie seu primeiro projeto para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {pagination && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
