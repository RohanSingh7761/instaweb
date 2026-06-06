import { useEffect, useState } from 'react'
import { createLead, getLeads, removeLead, updateLead } from '../services/leadsApi'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)

  const reloadLeads = () => {
    setRefreshIndex((current) => current + 1)
  }

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getLeads(searchTerm, controller.signal)
        setLeads(data)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load leads')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 250)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [searchTerm, refreshIndex])

  const addLead = async (payload) => {
    const result = await createLead(payload)
    reloadLeads()
    return result
  }

  const editLead = async (id, payload) => {
    const result = await updateLead(id, payload)
    reloadLeads()
    return result
  }

  const deleteLead = async (id) => {
    const result = await removeLead(id)
    reloadLeads()
    return result
  }

  return {
    leads,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    setError,
    reloadLeads,
    addLead,
    editLead,
    deleteLead,
  }
}