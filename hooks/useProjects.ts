"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { 
  ProjectResponse, 
  CreateProjectRequest, 
  PaginatedProjectsResponse,
  PaginationMeta,
  UseProjectsReturn, 
  UpdateProjectRequest
} from '@/types/api'

export function useProjects(): UseProjectsReturn {
  const { user } = useAuth()
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  
  const lastFetchParams = useRef<{ page: number; search: string } | null>(null)

  const fetchProjects = useCallback(async (page: number = 1, searchTerm: string = '') => {
    const userId = user && 'id' in user ? user.id as string : null
    if (!userId) {
      console.log('fetchProjects: userId não encontrado, user:', user)
      return
    }
    
    if (lastFetchParams.current?.page === page && lastFetchParams.current?.search === searchTerm) {
      console.log('fetchProjects: parâmetros iguais, pulando requisição')
      return
    }

    try {
      console.log('fetchProjects: Iniciando busca', { page, searchTerm, userId })
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9', 
        search: searchTerm,
        userId: userId,
      })

      const response = await axios.get<PaginatedProjectsResponse>(`/api/projects?${params}`)
      console.log('fetchProjects: Resposta recebida', response.data)
      
      setProjects(response.data.projects)
      setPagination(response.data.pagination)
      setCurrentPage(page)
      
      lastFetchParams.current = { page, search: searchTerm }
    } catch (error) {
      console.error('fetchProjects: Erro ao buscar projetos:', error)
      setError('Erro ao buscar projetos')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isInitialized && user) {
      console.log('useProjects: Inicializando com user:', user)
      fetchProjects(1, '')
      setIsInitialized(true)
    }
  }, [isInitialized, user, fetchProjects])

  useEffect(() => {
    if (isInitialized && (currentPage !== 1 || search !== '')) {
      console.log('useProjects: Executando fetchProjects por mudança de página/busca')
      fetchProjects(currentPage, search)
    }
  }, [currentPage, search, isInitialized, fetchProjects])

  const setPage = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const setSearchTerm = (searchTerm: string) => {
    if (searchTerm !== search) {
      setSearch(searchTerm)
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
    }
  }

  const refetch = () => {
    lastFetchParams.current = null
    fetchProjects(currentPage, search)
  }

  const createProject = async (projectData: CreateProjectRequest) => {
    const userId = user && 'id' in user ? user.id as string : null
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const response = await axios.post('/api/projects', {
        ...projectData,
        userId: userId
      })
      
      const newProject = response.data
      
      // Sempre atualizar a lista quando um novo projeto é criado
      setProjects(prevProjects => {
        const updatedProjects = [newProject, ...prevProjects]
        return updatedProjects.slice(0, 9)
      })
      
      // Atualizar paginação
      setPagination(prev => prev ? {
        ...prev,
        total: prev.total + 1,
        totalPages: Math.ceil((prev.total + 1) / 9)
      } : null)
      
      // Se não estiver na primeira página ou houver busca, voltar para a primeira página
      if (currentPage !== 1 || search !== '') {
        setCurrentPage(1)
        setSearch('')
        lastFetchParams.current = null
      }
      
      // Forçar um refetch para garantir sincronização
      setTimeout(() => {
        fetchProjects(1, '')
      }, 100)
      
      return newProject
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      throw error
    }
  }

  const updateProject = async (projectId: string, projectData: UpdateProjectRequest) => {
    try {
      const response = await axios.put(`/api/projects/${projectId}`, projectData)
      const updatedProject = response.data
      
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId ? updatedProject : project
        )
      )
      
      return updatedProject
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      throw error
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      await axios.delete(`/api/projects/${projectId}`)
      
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== projectId)
      )
      
      setPagination(prev => prev ? {
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil(Math.max(0, prev.total - 1) / 9)
      } : null)
      
      if (projects.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else if (projects.length <= 1) {
        lastFetchParams.current = null
        await fetchProjects(currentPage, search)
      }
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
      throw error
    }
  }

  return {
    projects,
    loading,
    error,
    pagination,
    currentPage,
    setPage,
    setSearch: setSearchTerm,
    refetch,
    createProject,
    updateProject,
    deleteProject,
  }
}