const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Request failed'

    try {
      const data = await response.json()

      if (data?.error) {
        message = data.error
      }
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function getLeads(searchTerm = '', signal) {
  const trimmedSearch = searchTerm.trim()
  const path = trimmedSearch
    ? `/api/leads/search?q=${encodeURIComponent(trimmedSearch)}`
    : '/api/leads'

  return request(path, { signal })
}

export function createLead(payload) {
  return request('/api/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateLead(id, payload) {
  return request(`/api/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function removeLead(id) {
  return request(`/api/leads/${id}`, {
    method: 'DELETE',
  })
}