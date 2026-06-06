export function DeleteConfirmModal({ lead, saving, onClose, onConfirm }) {
  if (!lead) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4" role="presentation" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Delete lead?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This will permanently remove <span className="font-medium text-slate-900">{lead.name || 'this lead'}</span>.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-xl bg-[#ff6b00] px-4 text-sm font-medium text-white transition hover:bg-[#e96100] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}