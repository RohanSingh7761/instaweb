import { useEffect, useRef } from 'react'
import { LEAD_STATUSES } from '../../constants/leads'

export function LeadsToolbar({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  isFilterOpen,
  onToggleFilter,
  onStatusFilterChange,
  onCloseFilter,
}) {
  const filterRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!isFilterOpen) return

      if (filterRef.current && !filterRef.current.contains(event.target)) {
        onCloseFilter()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isFilterOpen, onCloseFilter])

  return (
    <div className="mb-4 flex flex-wrap items-start gap-3">
      <label className="block min-w-0 flex-1 lg:max-w-[520px]" htmlFor="lead-search">
        <input
          id="lead-search"
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search leads by name, email, or company"
          aria-label="Search leads by name, email, or company"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ff6b00]"
        />
      </label>

      <div ref={filterRef} className="relative w-fit">
        <button
          type="button"
          className="inline-flex h-12 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400"
          onClick={onToggleFilter}
        >
          Filter
        </button>

        {isFilterOpen ? (
          <div
            className="absolute left-0 top-[calc(100%+0.5rem)] z-20 min-w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
            role="menu"
            aria-label="Lead status filter"
          >
            {LEAD_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                className={
                  statusFilter === status
                    ? 'block w-full rounded-lg bg-slate-100 px-3 py-2 text-left text-sm font-medium text-slate-900'
                    : 'block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100'
                }
                onClick={() => onStatusFilterChange(status)}
              >
                {status === 'ALL' ? 'All status' : status}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}