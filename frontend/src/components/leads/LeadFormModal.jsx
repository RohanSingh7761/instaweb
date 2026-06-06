import { useEffect, useState } from 'react'
import { EMPTY_LEAD_FORM } from '../../constants/leads'

export function LeadFormModal({ mode, lead, saving, onClose, onSubmit }) {
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
        className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {mode === 'edit' ? 'Edit Lead' : 'Add Lead'}
          </h2>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm text-slate-700">
            Name
            <input
              required
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Email
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Phone
            <input
              type="text"
              value={formData.phone_no}
              onChange={handleChange('phone_no')}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Company
            <input
              type="text"
              value={formData.company_name}
              onChange={handleChange('company_name')}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Status
            <select
              value={formData.status}
              onChange={handleChange('status')}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="CONVERTED">CONVERTED</option>
              <option value="LOST">LOST</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-700 md:col-span-2">
            Notes
            <textarea
              rows="4"
              value={formData.notes}
              onChange={handleChange('notes')}
              className="min-h-28 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}