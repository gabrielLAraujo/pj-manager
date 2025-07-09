import { Project, ProjectStatus, Task } from './types'

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  userId?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type CreateProjectRequest = {
  name: string
  description: string
  userId?: string
  status?: ProjectStatus
}

export type UpdateProjectRequest = Partial<CreateProjectRequest> & {
  id: string
}

export type ProjectResponse = Project & {
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
  tasks?: Task[]
}

export interface PaginatedProjectsResponse {
  projects: ProjectResponse[]
  pagination: PaginationMeta
}

export interface UseProjectsReturn {
  projects: ProjectResponse[]
  loading: boolean
  error: string | null
  pagination: PaginationMeta | null
  currentPage: number
  setPage: (page: number) => void
  setSearch: (search: string) => void
  refetch: () => void
  createProject: (projectData: CreateProjectRequest) => Promise<ProjectResponse>
  updateProject: (projectId: string, projectData: UpdateProjectRequest) => Promise<ProjectResponse>
  deleteProject: (projectId: string) => Promise<void>
}

export interface Config {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}