import { useEffect, useState } from 'react'
import { EMPTY_LEAD_FORM } from '../../constants/leads'

export function LeadFormModal({ mode, lead, saving, error, onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY_LEAD_FORM)

  useEffect(() => {
    if (mode === 'edit' && lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone_no: lead.phone_no || '',
        company_name: lead.company_name || '',
        status: lead.status || 'NEW',
        notes: lead.notes || '',
      })
      return
    }

    setFormData(EMPTY_LEAD_FORM)
  }, [mode, lead])

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onSubmit({
      ...formData,
      email: formData.email.trim() || null,
      phone_no: formData.phone_no.trim() || null,
      company_name: formData.company_name.trim() || null,
      notes: formData.notes.trim() || null,
    })
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/45 p-4" role="presentation" onClick={onClose}>
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 via-white to-[#fff8f2] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full border border-[#ff6b00]/15 bg-[#fff4eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b00]">
                Lead Details
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {mode === 'edit' ? 'Edit Lead' : 'Add Lead'}
              </h2>
              
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-auto px-6 py-5">
          {error ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-slate-700">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-slate-500">Name</span>
              <input
                required
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                placeholder="Full name"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-slate-500">Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                placeholder="name@example.com"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-slate-500">Phone</span>
              <input
                type="text"
                value={formData.phone_no}
                onChange={handleChange('phone_no')}
                className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                placeholder="Phone number"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-slate-500">Company</span>
              <input
                type="text"
                value={formData.company_name}
                onChange={handleChange('company_name')}
                className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                placeholder="Company name"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-slate-500">Status</span>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={handleChange('status')}
                  className="h-12 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 pr-11 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="LOST">LOST</option>
                </select>
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              
            </label>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <div className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Notes</div>
              <textarea
                rows="5"
                value={formData.notes}
                onChange={handleChange('notes')}
                className="min-h-36 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10"
                placeholder="Add context, reminders, or next steps"
              />
            </div>

            <div className="flex justify-end gap-3 md:col-span-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 items-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center rounded-2xl bg-[#ff6b00] px-5 text-sm font-semibold text-white transition hover:bg-[#e96100] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </span>
                  ) : (
                    'Save Lead'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}