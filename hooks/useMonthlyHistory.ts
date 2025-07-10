"use client"

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { MonthlyHistory, MonthlyWorkRecord } from '@/types/types'

type UpdateMonthlyHistoryData = 
  | { year: number; month: number; records: Omit<MonthlyWorkRecord, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[] }
  | { recordId: string; enabled: boolean; start: string; end: string; discountLunch: boolean }

interface UseMonthlyHistoryProps {
  projectId: string
  year: number
  month: number
}

interface UseMonthlyHistoryReturn {
  monthlyHistory: MonthlyHistory | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateMonthlyHistory: (data: UpdateMonthlyHistoryData) => Promise<void>
}

export function useMonthlyHistory({ 
  projectId, 
  year, 
  month 
}: UseMonthlyHistoryProps): UseMonthlyHistoryReturn {
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyHistory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMonthlyHistory = useCallback(async () => {
    if (!projectId) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(
        `/api/projects/${projectId}/monthly-history?year=${year}&month=${month}`
      )
      setMonthlyHistory(response.data)
    } catch (error) {
      console.error("Erro ao carregar histórico mensal:", error)
      setError("Erro ao carregar histórico mensal")
    } finally {
      setLoading(false)
    }
  }, [projectId, year, month])

  const updateMonthlyHistory = useCallback(async (data: UpdateMonthlyHistoryData) => {
    if (!projectId) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.put(
        `/api/projects/${projectId}/monthly-history`,
        data
      )
      setMonthlyHistory(response.data)
    } catch (error) {
      console.error("Erro ao atualizar histórico mensal:", error)
      setError("Erro ao atualizar histórico mensal")
    } finally {
      setLoading(false)
    }
  }, [projectId])

  const refetch = useCallback(async () => {
    await fetchMonthlyHistory()
  }, [fetchMonthlyHistory])

  useEffect(() => {
    fetchMonthlyHistory()
  }, [fetchMonthlyHistory])

  return {
    monthlyHistory,
    loading,
    error,
    refetch,
    updateMonthlyHistory
  }
} 