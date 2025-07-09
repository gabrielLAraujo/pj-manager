export interface WorkDay {
    day: string
    enabled: boolean
    start: string
    end: string
    discountLunch: boolean
  }

export interface MonthlyWorkRecord {
  id: string
  projectId: string
  year: number
  month: number
  date: string // formato YYYY-MM-DD
  dayOfWeek: string
  enabled: boolean
  start: string | null
  end: string | null
  discountLunch: boolean
  duration: number // em minutos
  createdAt: Date
  updatedAt: Date
}

export interface MonthlyHistory {
  id: string
  projectId: string
  year: number
  month: number
  totalHours: number
  totalDays: number
  records: MonthlyWorkRecord[]
  createdAt: Date
  updatedAt: Date
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