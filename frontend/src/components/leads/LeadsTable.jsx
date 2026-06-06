import { formatLeadDate } from '../../lib/formatDate'

export function LeadsTable({
  leads,
  loading,
  selectedIds,
  visibleIds,
  allVisibleSelected,
  onToggleAllVisible,
  onToggleLeadSelection,
  onEditLead,
  onDeleteLead,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-700">
              <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={onToggleAllVisible}
                aria-label="Select all visible leads"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                  Loading leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id)
                const isVisible = visibleIds.includes(lead.id)

                return (
                  <tr key={lead.id} className={isSelected ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleLeadSelection(lead.id)}
                        aria-label={`Select ${lead.name}`}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                      />
                    </td>
                    <td className="px-4 py-4 align-top font-medium text-slate-900">{lead.name || '—'}</td>
                    <td className="px-4 py-4 align-top">{lead.email || '—'}</td>
                    <td className="px-4 py-4 align-top">{lead.phone_no || '—'}</td>
                    <td className="px-4 py-4 align-top">{lead.company_name || '—'}</td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        {lead.status || '—'}
                      </span>
                    </td>
                    <td className="max-w-sm px-4 py-4 align-top text-slate-600">{lead.notes || '—'}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-700">{formatLeadDate(lead.created_date)}</span>
                        {isSelected && isVisible ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                              onClick={() => onEditLead(lead)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="inline-flex h-10 items-center rounded-xl border border-[#ff6b00] bg-[#fff4eb] px-3 text-sm font-medium text-[#ff6b00] transition hover:bg-[#ffe7d7]"
                              onClick={() => onDeleteLead(lead.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}