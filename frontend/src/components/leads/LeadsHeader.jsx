export function LeadsHeader({ onCreateLead }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Leads</h1>
        <p className="mt-2 text-sm text-slate-600">Search, filter, edit, and manage your lead list.</p>
      </div>

      <button
        className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        type="button"
        onClick={onCreateLead}
      >
        New Lead
      </button>
    </div>
  )
}