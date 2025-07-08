"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Project } from '@/types/types'

type ApiProject = Project & {
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get('/api/projects')
        const projectsWithDates = response.data.map((project: Project) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        }))
        setProjects(projectsWithDates)
      } catch (error) {
        setError('Erro ao buscar projetos')
        console.error('Erro ao buscar projetos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return { projects, loading, error }
}