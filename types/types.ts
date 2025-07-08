export interface WorkDay {
    day: string
    enabled: boolean
    start: string
    end: string
  }
  
  export interface ProjectConfig {
    id: string
    projectId: string
    hourlyRate: number
    workDays: WorkDay[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Task {
    id: string
    title: string
    description?: string
    status: TaskStatus
    createdAt: Date
    projectId: string
  }
  
  export interface Project {
    id: string
    name: string
    description?: string
    createdAt: Date
    updatedAt: Date
    config?: ProjectConfig
    status: ProjectStatus
    userId: string
  }
  export type TaskStatus = "todo" | "inprogress" | "done"
  export type ProjectStatus = "active" | "inactive" | "planning" | "completed"