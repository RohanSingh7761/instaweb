import { useEffect, useMemo, useState } from 'react'
import { LeadsHeader } from '../../components/leads/LeadsHeader'
import { LeadFormModal } from '../../components/leads/LeadFormModal'
import { LeadsTable } from '../../components/leads/LeadsTable'
import { LeadsToolbar } from '../../components/leads/LeadsToolbar'
import { DeleteConfirmModal } from '../../components/leads/DeleteConfirmModal'
import { useLeads } from '../../hooks/useLeads'

function LeadDashboard() {
  const {
    leads,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    setError,
    addLead,
    editLead,
    deleteLead,
  } = useLeads()

  const [statusFilter, setStatusFilter] = useState('ALL')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [modalMode, setModalMode] = useState(null)
  const [activeLead, setActiveLead] = useState(null)
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const visibleLeads = useMemo(() => {
    if (statusFilter === 'ALL') {
      return leads
    }

    return leads.filter((lead) => lead.status === statusFilter)
  }, [leads, statusFilter])

  const totalPages = Math.max(1, Math.ceil(visibleLeads.length / pageSize))

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return visibleLeads.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, visibleLeads])

  const visibleIds = paginatedLeads.map((lead) => lead.id)
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))

  const firstVisibleIndex = visibleLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastVisibleIndex = Math.min(currentPage * pageSize, visibleLeads.length)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1))
  }

  const toggleLeadSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    )
  }

  const toggleAllVisible = () => {
    setSelectedIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...current, ...visibleIds])),
    )
  }

  const openCreateModal = () => {
    setModalMode('create')
    setActiveLead(null)
    setError('')
    setModalError('')
  }

  const openEditModal = (lead) => {
    setModalMode('edit')
    setActiveLead(lead)
    setError('')
    setModalError('')
  }

  const closeModal = () => {
    setModalMode(null)
    setActiveLead(null)
    setSaving(false)
    setModalError('')
  }

  const handleSubmit = async (payload) => {
    setSaving(true)
    setModalError('')

    try {
      if (modalMode === 'edit' && activeLead) {
        await editLead(activeLead.id, payload)
      } else {
        await addLead(payload)
      }

      closeModal()
    } catch (submitError) {
      setModalError(submitError.message || 'Unable to save lead')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (leadId) => {
    const lead = leads.find((item) => item.id === leadId) || null
    setDeleteTarget(lead)
  }

  const closeDeleteModal = () => {
    setDeleteTarget(null)
    setDeleting(false)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    setError('')

    try {
      console.log('Deleting lead:', deleteTarget)
      await deleteLead(deleteTarget.id)
      setSelectedIds((current) => current.filter((id) => id !== deleteTarget.id))
      closeDeleteModal()
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete lead')
      setDeleting(false)
    }
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (status) => {
    setStatusFilter(status)
    setFilterOpen(false)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value))
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-360 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <LeadsHeader onCreateLead={openCreateModal} />

        <LeadsToolbar
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          statusFilter={statusFilter}
          isFilterOpen={filterOpen}
          onToggleFilter={() => setFilterOpen((current) => !current)}
          onStatusFilterChange={handleStatusChange}
        />

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <LeadsTable
          leads={paginatedLeads}
          loading={loading}
          selectedIds={selectedIds}
          visibleIds={visibleIds}
          allVisibleSelected={allVisibleSelected}
          onToggleAllVisible={toggleAllVisible}
          onToggleLeadSelection={toggleLeadSelection}
          onEditLead={openEditModal}
          onDeleteLead={handleDelete}
        />

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            {visibleLeads.length === 0
              ? 'No leads to display'
              : `Showing ${firstVisibleIndex}-${lastVisibleIndex} of ${visibleLeads.length}`}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Per page
              <select
                className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-500"
                value={pageSize}
                onChange={(event) => handlePageSizeChange(event.target.value)}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="min-w-16 text-center text-sm text-slate-600">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {modalMode ? (
        <LeadFormModal
          mode={modalMode}
          lead={modalMode === 'edit' ? activeLead : null}
          saving={saving}
          error={modalError}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmModal
          lead={deleteTarget}
          saving={deleting}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      ) : null}
    </main>
  )
}

export default LeadDashboard