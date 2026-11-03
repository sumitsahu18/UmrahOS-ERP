import { Link } from 'react-router-dom'
import { ChevronRight, Search, Download, Filter, X, Inbox } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { BRANCHES } from '../data/mock'

/* ---------- Badge ---------- */
const TONES = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  slate: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}
const STATUS_TONE = {
  confirmed: 'green', approved: 'green', active: 'green', paid: 'green', posted: 'green', verified: 'green', complete: 'green', completed: 'violet',
  available: 'green', 'on duty': 'blue', assigned: 'blue', allocated: 'green', 'checked in': 'blue', enabled: 'green', 'in progress': 'amber',
  pending: 'amber', partial: 'amber', 'partially allocated': 'amber', 'partially occupied': 'amber', expected: 'blue', scheduled: 'blue', draft: 'slate',
  'pending review': 'amber', returned: 'amber', 'returned for correction': 'amber', 'on leave': 'amber', maintenance: 'amber', delayed: 'red',
  cancelled: 'red', rejected: 'red', unpaid: 'red', missing: 'red', 'missing visa': 'red', 'missing photo': 'red', inactive: 'slate', locked: 'red',
  occupied: 'violet', 'checked out': 'slate', 'off duty': 'slate', disabled: 'slate', refunded: 'violet', open: 'green', closed: 'slate', submitted: 'blue',
}
export function Badge({ children, tone }) {
  const k = tone || STATUS_TONE[String(children).toLowerCase()] || 'slate'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONES[k]}`}>{children}</span>
}

/* ---------- Card ---------- */
export function Card({ title, subtitle, action, children, className = '', bodyClass = 'px-5 pb-5' }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <div className="card-h">
          <div>
            {title && <h3 className="card-t">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

/* ---------- Stat card ---------- */
const STAT_TONES = {
  violet: 'bg-violet-100 text-violet-600', blue: 'bg-blue-100 text-blue-600', green: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600', red: 'bg-rose-100 text-rose-600', navy: 'bg-indigo-100 text-indigo-700', teal: 'bg-teal-100 text-teal-600',
}
export function StatCard({ label, value, icon: Icon, tone = 'violet', hint, trend }) {
  const { t } = useApp()
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`h-12 w-12 shrink-0 rounded-2xl grid place-items-center ${STAT_TONES[tone]}`}>{Icon && <Icon size={22} />}</div>
      <div className="min-w-0">
        <div className="text-[22px] leading-7 font-extrabold text-slate-900 truncate">{value}</div>
        <div className="text-xs font-medium text-slate-500 truncate">{t(label)}</div>
        {(hint || trend) && (
          <div className="text-[11px] mt-0.5">
            {trend && <span className={trend.startsWith('-') ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>{trend}</span>}
            {hint && <span className="text-slate-400"> {hint}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Page header ---------- */
export function PageHeader({ title, subtitle, crumbs = [], actions }) {
  const { t } = useApp()
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {crumbs.length > 0 && (
          <nav className="mb-1 flex flex-wrap items-center gap-1 text-xs text-slate-500">
            <Link to="/dashboard" className="hover:text-brand-600">{t('Dashboard')}</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1"><ChevronRight size={12} className="rtl:rotate-180" />{t(c)}</span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-extrabold text-slate-900">{t(title)}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/* ---------- Filters ---------- */
export function BranchSelect({ value, onChange, className = '' }) {
  const { t } = useApp()
  return (
    <select className={`input w-auto ${className}`} value={value} onChange={(e) => onChange?.(e.target.value)}>
      <option>{t('All Branches')}</option>
      {BRANCHES.map((b) => <option key={b.code}>{b.name}</option>)}
    </select>
  )
}
export function DateRange() {
  return (
    <div className="flex items-center gap-2">
      <input type="date" className="input w-auto" defaultValue="2026-10-01" />
      <span className="text-slate-400 text-xs">to</span>
      <input type="date" className="input w-auto" defaultValue="2026-11-03" />
    </div>
  )
}
export function SearchBox({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
      <input className="input ps-9" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

/* ---------- Data table ---------- */
export function DataTable({ columns, rows, actions, empty = 'No records found', compact, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-50/80 border-y border-slate-100">
          <tr>
            {columns.map((c) => <th key={c.key} className={`th ${c.align === 'end' ? 'text-end' : ''}`}>{c.label}</th>)}
            {actions && <th className="th text-end">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="py-10 text-center text-sm text-slate-400">
              <Inbox className="mx-auto mb-2" size={28} />{empty}
            </td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={i} className={`hover:bg-brand-50/40 ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(r)}>
              {columns.map((c) => (
                <td key={c.key} className={`td ${compact ? 'py-2' : ''} ${c.align === 'end' ? 'text-end tabular-nums' : ''} ${c.strong ? 'font-semibold text-slate-900' : ''}`}>
                  <bdi>{c.render ? c.render(r[c.key], r) : r[c.key]}</bdi>
                </td>
              ))}
              {actions && <td className="td text-end" onClick={(e) => e.stopPropagation()}><div className="flex justify-end gap-1.5">{actions(r)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableToolbar({ search, setSearch, children, onExport }) {
  const { notify } = useApp()
  return (
    <div className="flex flex-col gap-2 px-5 pb-4 md:flex-row md:items-center md:justify-between">
      <SearchBox value={search} onChange={setSearch} className="md:w-72" />
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <button className="btn-light" onClick={() => notify('Filters applied')}><Filter size={16} />Filter</button>
        <button className="btn-light" onClick={onExport || (() => notify('Export started (Excel / PDF)'))}><Download size={16} />Export</button>
      </div>
    </div>
  )
}

/* ---------- Form bits ---------- */
export function Field({ label, children, span = 1, hint }) {
  return (
    <label className={`block ${span === 2 ? 'md:col-span-2' : span === 3 ? 'md:col-span-3' : ''}`}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  )
}
export const Input = (p) => <input className="input" {...p} />
export const Select = ({ options = [], ...p }) => (
  <select className="input" {...p}>{options.map((o) => <option key={o}>{o}</option>)}</select>
)
export const Textarea = (p) => <textarea className="input min-h-[96px]" {...p} />

export function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className={`card w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="card-h border-b border-slate-100 pb-4">
          <h3 className="card-t">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function Progress({ value, max = 100, tone = 'bg-brand-500' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${pct >= 100 ? 'bg-rose-500' : pct > 85 ? 'bg-amber-500' : tone}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Restriction({ children }) {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span className="mt-0.5">🔒</span><p><b>Restriction:</b> {children}</p>
    </div>
  )
}
