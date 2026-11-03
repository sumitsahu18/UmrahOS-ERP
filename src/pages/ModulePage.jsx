import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { Plus, Save, FileSpreadsheet, FileText, UploadCloud, Check, Minus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { resolveMenu, slug } from '../data/roles'
import { resolvePage, DATASETS, FORMS } from '../data/pages'
import { Card, PageHeader, DataTable, TableToolbar, Field, Input, Textarea, Modal, Badge, BranchSelect, DateRange, StatCard } from '../components/ui'
import { BookingsTrend, IncomeExpense, Donut, SimpleBars } from '../components/charts'
import { TREND, BRANCHES, HOTELS, TRIPS, EMPLOYEES, PERMISSIONS, fmt } from '../data/mock'
import { BarChart3, TrendingUp, TrendingDown, Wallet } from 'lucide-react'

import { FormRenderer } from '../components/FormRenderer'
import NewBooking from './screens/NewBooking'
import ExpenseDetail from './screens/ExpenseDetail'
import RoomAllocation from './screens/RoomAllocation'
import CreateTrip from './screens/CreateTrip'
import PassengerProfile from './screens/PassengerProfile'
import Notifications from './common/Notifications'
import Profile from './common/Profile'

/* ---------------- Table page ---------------- */
function TablePage({ title, crumbs, cfg }) {
  const { notify, t } = useApp()
  const nav = useNavigate()
  const ds = DATASETS[cfg.dataset]
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')
  const [viewRow, setViewRow] = useState(null)
  const [adding, setAdding] = useState(false)
  useEffect(() => { setQ(''); setTab('All') }, [title])

  const base = useMemo(() => (cfg.filter ? ds.rows.filter(cfg.filter) : ds.rows), [cfg, ds])
  const rows = base.filter((r) => (tab === 'All' || r.status === tab) && (!q || Object.values(r).some((v) => String(v).toLowerCase().includes(q.toLowerCase()))))

  const view = (r) => {
    if (ds.view === 'expense') return nav(`/expense/${r.id}`)
    if (ds.view === 'passenger') return nav(`/passenger/${r.id}`)
    setViewRow(r)
  }

  return (
    <>
      <PageHeader title={title} crumbs={crumbs} subtitle={`${base.length} records`}
        actions={<button className="btn-primary" onClick={() => setAdding(true)}><Plus size={16} />{t('Add New')}</button>} />
      <Card bodyClass="pb-2" className="pt-4">
        {cfg.statusTabs && (
          <div className="mb-3 flex flex-wrap gap-1.5 px-5">
            {['All', ...cfg.statusTabs].map((s) => (
              <button key={s} onClick={() => setTab(s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${tab === s ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s} <span className="opacity-70">({s === 'All' ? base.length : base.filter((r) => r.status === s).length})</span>
              </button>
            ))}
          </div>
        )}
        <TableToolbar search={q} setSearch={setQ}><BranchSelect /></TableToolbar>
        <DataTable columns={ds.columns} rows={rows} onRowClick={view}
          actions={(r) => (
            <>
              <button className="btn-light btn-sm" onClick={() => view(r)}>{t('View')}</button>
              {cfg.approve ? (
                <>
                  <button className="btn-success btn-sm" onClick={() => notify(`${r.id} approved`)}>{t('Approve')}</button>
                  <button className="btn-danger btn-sm" onClick={() => nav(`/expense/${r.id}`)}>{t('Reject')}</button>
                </>
              ) : cfg.rowAction ? (
                <button className="btn-light btn-sm" onClick={() => (cfg.rowLink ? nav(cfg.rowLink) : notify(`${cfg.rowAction}: done`))}>{cfg.rowAction}</button>
              ) : (
                <button className="btn-light btn-sm" onClick={() => setAdding(r)}>{t('Edit')}</button>
              )}
            </>
          )} />
        <div className="flex items-center justify-between px-5 py-3 text-xs text-slate-500">
          <span>Showing {rows.length} of {base.length}</span>
          <div className="flex gap-1"><button className="btn-light btn-sm">‹</button><button className="btn-sm rounded-lg bg-brand-500 px-2.5 text-white">1</button><button className="btn-light btn-sm">›</button></div>
        </div>
      </Card>

      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title={`${title} — details`} wide>
        {viewRow && (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ds.columns.map((c) => (
              <div key={c.key} className="rounded-xl bg-slate-50 px-4 py-3"><dt className="text-xs text-slate-400">{c.label}</dt><dd className="font-semibold text-slate-800">{c.render ? c.render(viewRow[c.key], viewRow) : viewRow[c.key]}</dd></div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal open={!!adding} onClose={() => setAdding(false)} title={adding === true ? `Add — ${title}` : `Edit — ${title}`} wide
        footer={<><button className="btn-light" onClick={() => setAdding(false)}>{t('Cancel')}</button><button className="btn-primary" onClick={() => { setAdding(false); notify('Record saved') }}><Save size={16} />{t('Save')}</button></>}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ds.columns.map((c) => (
            <Field key={c.key} label={c.label}>
              {c.key === 'status' ? (
                <select className="input" defaultValue={adding !== true ? adding.status : undefined}>{[...new Set(ds.rows.map((r) => r.status))].map((s) => <option key={s}>{s}</option>)}</select>
              ) : (
                <Input defaultValue={adding !== true ? String(adding[c.key] ?? '') : ''} />
              )}
            </Field>
          ))}
        </div>
      </Modal>
    </>
  )
}

/* ---------------- Form page ---------------- */
function FormPage({ title, crumbs, cfg }) {
  const { notify, t } = useApp()
  const nav = useNavigate()
  return (
    <>
      <PageHeader title={cfg.title || title} crumbs={crumbs} subtitle={cfg.settings ? 'System configuration' : 'Fill in the details and save'} />
      <FormRenderer sections={FORMS[cfg.form]} />
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-light" onClick={() => nav(-1)}>{t('Cancel')}</button>
        <button className="btn-primary" onClick={() => notify(`${cfg.title || title} saved`)}><Save size={16} />{t('Save')}</button>
      </div>
      {cfg.below && <div className="mt-6"><TablePage title="Uploaded Documents" crumbs={[]} cfg={cfg.below} /></div>}
    </>
  )
}

/* ---------------- Report page ---------------- */
function ReportPage({ title, crumbs, cfg }) {
  const { notify } = useApp()
  const ds = DATASETS[cfg.dataset]
  const rows = cfg.filter ? ds.rows.filter(cfg.filter) : ds.rows
  const chart = {
    finance: <IncomeExpense data={TREND} type="bar" h={280} />,
    branches: <SimpleBars data={BRANCHES.map((b) => ({ name: b.code, Income: b.income, Expenses: b.expense }))} x="name" money bars={[{ key: 'Income', name: 'Income', color: '#16a34a' }, { key: 'Expenses', name: 'Expenses', color: '#f97316' }]} h={280} />,
    bookings: <BookingsTrend data={TREND} h={280} />,
    hotels: <SimpleBars data={HOTELS.map((h) => ({ name: h.name.split(' ').slice(0, 2).join(' '), Occupied: h.rooms - h.available, Available: h.available }))} x="name" bars={[{ key: 'Occupied', name: 'Occupied' }, { key: 'Available', name: 'Available', color: '#16a34a' }]} h={280} />,
    transport: <SimpleBars data={['Arrival', 'Intercity', 'Departure', 'Ziyarat'].map((t) => ({ name: t, Trips: TRIPS.filter((x) => x.type === t).length * 6, Passengers: TRIPS.filter((x) => x.type === t).reduce((s, x) => s + x.passengers, 0) }))} x="name" bars={[{ key: 'Trips', name: 'Trips' }, { key: 'Passengers', name: 'Passengers', color: '#e8ad35' }]} h={280} />,
    employees: <SimpleBars horizontal data={EMPLOYEES.slice(0, 8).map((e) => ({ name: e.name, Actions: e.activity }))} x="name" bars={[{ key: 'Actions', name: 'Actions' }]} h={300} />,
    receivables: <Donut data={[{ name: '0–30 days', value: 142, color: '#16a34a' }, { name: '31–60 days', value: 78, color: '#f59e0b' }, { name: '61–90 days', value: 31, color: '#f97316' }, { name: '90+ days', value: 17, color: '#ef4444' }]} center="268k" sub="SAR outstanding" />,
    payables: <Donut data={[{ name: 'Due this week', value: 96, color: '#ef4444' }, { name: 'This month', value: 138, color: '#f59e0b' }, { name: 'Next month', value: 64, color: '#3b82f6' }, { name: 'Later', value: 24, color: '#94a3b8' }]} center="322k" sub="SAR payable" />,
    approvals: <Donut data={[{ name: 'Approved', value: 46, color: '#16a34a' }, { name: 'Pending', value: 12, color: '#f59e0b' }, { name: 'Rejected', value: 7, color: '#ef4444' }, { name: 'Returned', value: 5, color: '#8b5cf6' }]} sub="Requests" />,
  }[cfg.report]
  const inc = TREND.reduce((s, m) => s + m.income, 0)
  const exp = TREND.reduce((s, m) => s + m.expenses, 0)

  return (
    <>
      <PageHeader title={title} crumbs={crumbs} subtitle="Report"
        actions={<>
          <DateRange /><BranchSelect />
          <button className="btn-light" onClick={() => notify('Excel export started')}><FileSpreadsheet size={16} />Excel</button>
          <button className="btn-light" onClick={() => notify('PDF export started')}><FileText size={16} />PDF</button>
        </>} />
      {['finance', 'branches'].includes(cfg.report) && (
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Income" value={fmt(inc)} icon={TrendingUp} tone="green" />
          <StatCard label="Expenses" value={fmt(exp)} icon={TrendingDown} tone="red" />
          <StatCard label="Net Profit" value={fmt(inc - exp)} icon={Wallet} tone="teal" />
        </div>
      )}
      <Card title={title} subtitle="Selected period" action={<BarChart3 size={18} className="text-slate-400" />}>{chart}</Card>
      <Card title="Report Data" className="mt-5" bodyClass="pb-2"><DataTable columns={ds.columns} rows={rows} /></Card>
    </>
  )
}

/* ---------------- Permission matrix ---------------- */
function MatrixPage({ title, crumbs }) {
  const { notify } = useApp()
  const L = { v: 'View', c: 'Create', e: 'Edit', a: 'Approve' }
  const [m, setM] = useState(() => Object.fromEntries(Object.entries(PERMISSIONS.matrix).map(([r, s]) => [r, s.split(' ').map((x) => (x === '-' ? '' : x))])))
  const toggle = (r, i, k) => setM((o) => ({ ...o, [r]: o[r].map((x, j) => (j === i ? (x.includes(k) ? x.replace(k, '') : x + k) : x)) }))
  return (
    <>
      <PageHeader title={title} crumbs={crumbs} subtitle="Click a cell letter to toggle View / Create / Edit / Approve"
        actions={<button className="btn-primary" onClick={() => notify('Permissions saved')}><Save size={16} />Save</button>} />
      <Card bodyClass="pb-2" className="pt-2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="th sticky start-0 bg-slate-50">Role</th>{PERMISSIONS.modules.map((mm) => <th key={mm} className="th text-center">{mm}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {Object.keys(m).map((r) => (
                <tr key={r}>
                  <td className="td sticky start-0 bg-white font-semibold">{r}</td>
                  {m[r].map((x, i) => (
                    <td key={i} className="px-2 py-2 text-center">
                      <div className="inline-flex gap-0.5">
                        {Object.keys(L).map((k) => (
                          <button key={k} title={L[k]} onClick={() => toggle(r, i, k)}
                            className={`h-6 w-6 rounded-md text-[10px] font-bold uppercase ${x.includes(k) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-300'}`}>{k}</button>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 px-5 py-3 text-xs text-slate-500">
          {Object.entries(L).map(([k, v]) => <span key={k} className="flex items-center gap-1"><span className="grid h-5 w-5 place-items-center rounded bg-brand-500 text-[10px] font-bold uppercase text-white">{k}</span>{v}</span>)}
          <span className="flex items-center gap-1"><Check size={14} className="text-emerald-600" />Branch scope is enforced per user</span>
          <span className="flex items-center gap-1"><Minus size={14} />Users cannot approve their own requests</span>
        </div>
      </Card>
    </>
  )
}

/* ---------------- Export reports ---------------- */
function ExportPage({ title, crumbs }) {
  const { notify } = useApp()
  const list = ['Branch Report', 'Booking Report', 'Passenger Report', 'Hotel Report', 'Transport Report', 'Profit & Loss', 'General Ledger', 'Receivables Aging', 'Payables Aging', 'Expense Approvals', 'Audit Log', 'Employee List']
  return (
    <>
      <PageHeader title={title} crumbs={crumbs} subtitle="Download any report as Excel or PDF" actions={<><DateRange /><BranchSelect /></>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => (
          <div key={r} className="card flex items-center gap-3 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><FileText size={20} /></span>
            <div className="flex-1 font-semibold text-slate-800">{r}</div>
            <button className="btn-light btn-sm" onClick={() => notify(`${r}.xlsx exported`)}>Excel</button>
            <button className="btn-light btn-sm" onClick={() => notify(`${r}.pdf exported`)}>PDF</button>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------- Trip calendar ---------------- */
function TripCalendar({ title, crumbs }) {
  const days = Array.from({ length: 7 }, (_, i) => `${i + 3} Nov 2026`)
  return (
    <>
      <PageHeader title={title} crumbs={crumbs} subtitle="Week of 03 – 09 Nov 2026" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {days.map((d) => (
          <div key={d} className="card min-h-[220px] p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-500">{d.slice(0, 6)}</div>
            <div className="space-y-2">
              {TRIPS.filter((t) => t.date === d).map((t) => (
                <div key={t.id} className="rounded-lg border-s-4 border-brand-500 bg-brand-50 p-2 text-xs">
                  <div className="font-bold text-slate-800">{t.time} · {t.id}</div>
                  <div className="text-slate-600">{t.route}</div>
                  <div className="mt-1"><Badge>{t.status}</Badge></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------- Router entry ---------------- */
export default function ModulePage() {
  const { section: secSlug, child: childSlug } = useParams()
  const { role } = useApp()
  const found = resolveMenu(role, secSlug, childSlug)
  if (!found) return <Navigate to="/dashboard" replace />
  const { section, child } = found

  // a top-level item with children (and no child chosen) → open its first child
  if (!child && section.children.length) return <Navigate to={`/m/${secSlug}/${slug(section.children[0])}`} replace />

  const title = child || section.label
  const crumbs = child ? [section.label, child] : [section.label]
  const cfg = resolvePage(section.label, child)
  const key = `${secSlug}/${childSlug}`

  switch (cfg.kind) {
    case 'newBooking': return <NewBooking key={key} title={cfg.title} crumbs={crumbs} />
    case 'expenseDetail': return <ExpenseDetail key={key} pickFirst />
    case 'roomAllocation': return <RoomAllocation key={key} crumbs={crumbs} />
    case 'createTrip': return <CreateTrip key={key} crumbs={crumbs} />
    case 'passengerProfile': return <PassengerProfile key={key} crumbs={crumbs} initialTab={cfg.tab || 0} />
    case 'notifications': return <Notifications key={key} />
    case 'profile': return <Profile key={key} />
    case 'matrix': return <MatrixPage key={key} title={title} crumbs={crumbs} />
    case 'export': return <ExportPage key={key} title={title} crumbs={crumbs} />
    case 'tripCalendar': return <TripCalendar key={key} title={title} crumbs={crumbs} />
    case 'form': return <FormPage key={key} title={title} crumbs={crumbs} cfg={cfg} />
    case 'report': return <ReportPage key={key} title={title} crumbs={crumbs} cfg={cfg} />
    default: return <TablePage key={key} title={title} crumbs={crumbs} cfg={cfg} />
  }
}

