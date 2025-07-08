"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Project } from '@/types/types'
import { CreateProjectInput, CreateProjectOutput } from '@/types/api'



export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
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

  const createProject = async (projectData: CreateProjectInput) => {
    try {
      const response = await axios.post('/api/projects', projectData)
      setProjects([...projects, response.data])
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      throw error
    }
  }

  const refreshProjects = async () => {
    const response = await axios.get('/api/projects')
    const projectsWithDates = response.data.map((project: CreateProjectOutput) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }))
    setProjects(projectsWithDates)
  }
  const deleteProject = async (id: string) => {
    await axios.delete(`/api/projects/${id}`)
    setProjects(projects.filter((project) => project.id !== id))
  }
  return { projects, loading, error, createProject, refreshProjects, deleteProject }
}