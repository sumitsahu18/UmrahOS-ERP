import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Undo2, Paperclip, ArrowLeft, ShieldAlert } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, PageHeader, Badge, Modal, Textarea, Field } from '../../components/ui'
import { EXPENSES, fmt } from '../../data/mock'

export default function ExpenseDetail({ pickFirst }) {
  const { id } = useParams()
  const { notify } = useApp()
  const nav = useNavigate()
  const [selected, setSelected] = useState(id || EXPENSES.find((e) => e.status === 'Pending').id)
  const e0 = EXPENSES.find((e) => e.id === selected) || EXPENSES[0]
  const [status, setStatus] = useState(e0.status)
  const [modal, setModal] = useState(null)
  const [reason, setReason] = useState('')
  const [history, setHistory] = useState([
    { by: e0.submittedBy, action: 'Submitted', date: e0.date, note: 'Request created and submitted for approval' },
    { by: 'Branch Manager', action: 'Reviewed', date: e0.date, note: 'Forwarded to Head Office' },
  ])
  const isOwn = e0.submittedBy === 'Abdul Karim'

  const decide = (action) => {
    if (action === 'Rejected' && !reason.trim()) return notify('Reason is required to reject', 'warn')
    setStatus(action === 'Returned for Correction' ? 'Returned' : action)
    setHistory((h) => [...h, { by: 'You', action, date: '03 Nov 2026', note: reason || (action === 'Approved' ? 'Posted to General Ledger (once)' : '') }])
    setModal(null); setReason('')
    notify(`${e0.id} — ${action}`)
  }

  const rows = [
    ['Request Number', e0.id], ['Submitted By', e0.submittedBy], ['Branch', e0.branch], ['Expense Category', e0.category],
    ['Supplier', e0.supplier], ['Amount', fmt(e0.amount)], ['Expense Date', e0.date],
  ]

  return (
    <>
      <PageHeader title="Expense Request Details" crumbs={['Expense Approvals', 'Expense Details']}
        actions={<>
          {pickFirst && (
            <select className="input w-auto" value={selected} onChange={(e) => { setSelected(e.target.value); setStatus(EXPENSES.find((x) => x.id === e.target.value).status) }}>
              {EXPENSES.map((e) => <option key={e.id}>{e.id}</option>)}
            </select>
          )}
          <button className="btn-light" onClick={() => nav(-1)}><ArrowLeft size={16} className="rtl:rotate-180" />Back</button>
        </>} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title={e0.id} subtitle={e0.category} action={<Badge>{status}</Badge>} className="xl:col-span-2">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 px-4 py-3"><dt className="text-xs text-slate-400">{k}</dt><dd className="font-semibold text-slate-800">{v}</dd></div>
            ))}
            <div className="rounded-xl bg-slate-50 px-4 py-3 sm:col-span-2"><dt className="text-xs text-slate-400">Description</dt><dd className="text-slate-700">{e0.description}</dd></div>
          </dl>
          <div className="mt-5">
            <div className="label">Supporting Receipt</div>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><Paperclip size={18} /></span>
              <div className="flex-1"><div className="text-sm font-semibold">receipt_{e0.id.toLowerCase()}.pdf</div><div className="text-xs text-slate-400">PDF · 412 KB</div></div>
              <button className="btn-light btn-sm" onClick={() => notify('Opening receipt preview')}>View</button>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Actions">
            {isOwn ? (
              <div className="flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"><ShieldAlert size={18} />You cannot approve your own request.</div>
            ) : (
              <div className="grid gap-2">
                <button className="btn-success" disabled={status === 'Approved'} onClick={() => decide('Approved')}><CheckCircle2 size={16} />Approve</button>
                <button className="btn-danger" onClick={() => setModal('reject')}><XCircle size={16} />Reject (Reason Required)</button>
                <button className="btn-warn" onClick={() => setModal('return')}><Undo2 size={16} />Return for Correction</button>
              </div>
            )}
            <p className="mt-3 text-[11px] text-slate-400">Approved expenses are posted to the ledger only once. Approval history is preserved.</p>
          </Card>
          <Card title="Previous Approval History">
            <ol className="relative space-y-4 border-s border-slate-200 ps-5">
              {history.map((h, i) => (
                <li key={i}>
                  <span className={`absolute -start-[7px] mt-1 h-3.5 w-3.5 rounded-full border-2 border-white ${h.action === 'Approved' ? 'bg-emerald-500' : h.action === 'Rejected' ? 'bg-rose-500' : 'bg-brand-500'}`} />
                  <div className="text-sm font-semibold text-slate-800">{h.action} <span className="font-normal text-slate-400">· {h.by}</span></div>
                  <div className="text-xs text-slate-400">{h.date}</div>
                  {h.note && <div className="mt-0.5 text-xs text-slate-600">{h.note}</div>}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'reject' ? 'Reject Request' : 'Return for Correction'}
        footer={<><button className="btn-light" onClick={() => setModal(null)}>Cancel</button>
          <button className={modal === 'reject' ? 'btn-danger' : 'btn-warn'} onClick={() => decide(modal === 'reject' ? 'Rejected' : 'Returned for Correction')}>Confirm</button></>}>
        <Field label={modal === 'reject' ? 'Reason (required)' : 'What needs correcting?'}>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Type your remarks…" />
        </Field>
      </Modal>
    </>
  )
}
