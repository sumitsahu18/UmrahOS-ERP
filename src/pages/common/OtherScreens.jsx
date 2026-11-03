import { useState } from 'react'
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom'
import { Search as SearchIcon, UploadCloud, BookOpen, LifeBuoy, Mail, Phone, MonitorSmartphone, KeyRound, LogOut, ShieldCheck, ArrowLeft, Printer, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, PageHeader, DataTable, Badge, TableToolbar } from '../../components/ui'
import { BOOKINGS, PASSENGERS, EMPLOYEES, DOCUMENTS, TRIPS, EXPENSES, PACKAGES, fmt } from '../../data/mock'

/* ---------- Global search ---------- */
export function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [v, setV] = useState(q)
  const lc = q.toLowerCase()
  const has = (o) => q && Object.values(o).some((x) => String(x).toLowerCase().includes(lc))
  const groups = [
    ['Bookings', BOOKINGS.filter(has).map((b) => ({ a: b.id, b: b.passenger, c: b.status, to: `/booking/${b.id}` }))],
    ['Passengers', PASSENGERS.filter(has).map((p) => ({ a: p.id, b: p.name, c: p.docs, to: `/passenger/${p.id}` }))],
    ['Expenses', EXPENSES.filter(has).map((e) => ({ a: e.id, b: e.category, c: e.status, to: `/expense/${e.id}` }))],
    ['Trips', TRIPS.filter(has).map((t) => ({ a: t.id, b: t.route, c: t.status }))],
    ['Employees', EMPLOYEES.filter(has).map((e) => ({ a: e.id, b: e.name, c: e.status }))],
  ]
  const total = groups.reduce((s, g) => s + g[1].length, 0)
  return (
    <>
      <PageHeader title="Search" crumbs={['Search']} subtitle="Only records you are authorised to see are shown" />
      <form className="relative mb-5" onSubmit={(e) => { e.preventDefault(); setParams({ q: v }) }}>
        <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input className="input py-3.5 ps-12 text-base" value={v} onChange={(e) => setV(e.target.value)} placeholder="Booking ID, passenger, passport, trip, expense…" autoFocus />
      </form>
      {q && <p className="mb-4 text-sm text-slate-500">{total} results for “<b>{q}</b>”</p>}
      <div className="space-y-4">
        {groups.filter((g) => g[1].length).map(([name, rows]) => (
          <Card key={name} title={name} bodyClass="pb-2">
            <ul className="divide-y divide-slate-100">
              {rows.slice(0, 6).map((r) => (
                <li key={r.a} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                  <span className="w-28 font-semibold text-slate-800">{r.a}</span><span className="flex-1 text-slate-600">{r.b}</span><Badge>{r.c}</Badge>
                  {r.to && <Link to={r.to} className="text-xs font-semibold text-brand-600">Open</Link>}
                </li>
              ))}
            </ul>
          </Card>
        ))}
        {!q && <div className="card p-10 text-center text-slate-400">Type something to search across bookings, passengers, finance and operations.</div>}
      </div>
    </>
  )
}

/* ---------- Documents ---------- */
export function Documents() {
  const { notify } = useApp()
  const [q, setQ] = useState('')
  const rows = DOCUMENTS.filter((d) => !q || Object.values(d).some((x) => String(x).toLowerCase().includes(q.toLowerCase())))
  return (
    <>
      <PageHeader title="Documents" crumbs={['Documents']} subtitle="Secure upload and authorised viewing" />
      <label className="card mb-5 flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-200 p-8 text-center hover:bg-brand-50/40">
        <UploadCloud size={34} className="text-brand-500" />
        <div className="font-semibold text-slate-800">Drag & drop files here, or click to browse</div>
        <div className="text-xs text-slate-400">PDF, JPG, PNG · max 10 MB · encrypted at rest</div>
        <input type="file" className="hidden" multiple onChange={() => notify('Document uploaded')} />
      </label>
      <Card bodyClass="pb-2" className="pt-4">
        <TableToolbar search={q} setSearch={setQ} />
        <DataTable columns={[
          { key: 'name', label: 'Document', strong: true }, { key: 'owner', label: 'Passenger' }, { key: 'type', label: 'Type' },
          { key: 'size', label: 'Size' }, { key: 'uploaded', label: 'Uploaded' }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
        ]} rows={rows} actions={(r) => <button className="btn-light btn-sm" onClick={() => notify(`Opening ${r.name}`)}>View</button>} />
      </Card>
    </>
  )
}

/* ---------- Help ---------- */
const FAQ = [
  ['How do I create a new booking?', 'Open Booking Management → Create Booking. Follow the 5 steps: Passenger, Package, Booking, Payment and Confirmation.'],
  ['Why can’t I approve an expense?', 'You cannot approve your own requests, and only Head Office Accountant / Approver or Super Admin roles hold approval permission.'],
  ['How do I switch language?', 'Use the globe button in the top bar to switch between English, Arabic (right-to-left) and Bengali.'],
  ['How do I allocate rooms for a group?', 'Go to Room Allocation → Assign Rooms, pick the booking/group and hotel, then tick guests for each room. Capacity is validated automatically.'],
  ['Who can see which branches?', 'Each user sees only the branches assigned to them. Super Admin sees all branches.'],
]
export function Help() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <PageHeader title="Help" crumbs={['Help']} subtitle="User guide and support information" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Frequently asked questions" className="xl:col-span-2">
          <div className="divide-y divide-slate-100">
            {FAQ.map(([q, a], i) => (
              <div key={q} className="py-3">
                <button className="flex w-full items-center justify-between text-start font-semibold text-slate-800" onClick={() => setOpen(open === i ? -1 : i)}>{q}<ChevronDown size={16} className={open === i ? 'rotate-180' : ''} /></button>
                {open === i && <p className="mt-2 text-sm text-slate-600">{a}</p>}
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card title="User guide">
            {['Getting started', 'Bookings & packages', 'Hotels & rooms', 'Transport & trips', 'Finance & approvals', 'Reports'].map((g) => (
              <a key={g} href="#guide" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"><BookOpen size={16} className="text-brand-500" />{g}</a>
            ))}
          </Card>
          <Card title="Support">
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><LifeBuoy size={16} className="text-brand-500" />Mon–Sat, 9:00 – 18:00</div>
              <div className="flex items-center gap-2"><Mail size={16} className="text-brand-500" />support@umrahos.com</div>
              <div className="flex items-center gap-2"><Phone size={16} className="text-brand-500" />+880 9610 000000</div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

/* ---------- Session & Security ---------- */
export function Security() {
  const { notify } = useApp()
  const [sessions, setSessions] = useState([
    { device: 'Chrome · Windows 11', ip: '103.42.18.7', place: 'Dhaka, BD', last: 'Active now', current: true },
    { device: 'Safari · iPhone 15', ip: '37.104.22.9', place: 'Makkah, SA', last: '2 hours ago' },
    { device: 'Edge · Windows 10', ip: '103.42.18.30', place: 'Dhaka, BD', last: 'Yesterday' },
  ])
  return (
    <>
      <PageHeader title="Session & Security" crumbs={['Session & Security']} subtitle="Logout, active sessions and authentication" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Active sessions" className="xl:col-span-2">
          <ul className="divide-y divide-slate-100">
            {sessions.map((s, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><MonitorSmartphone size={18} /></span>
                <div className="flex-1"><div className="text-sm font-semibold">{s.device} {s.current && <Badge tone="green">This device</Badge>}</div><div className="text-xs text-slate-500">{s.ip} · {s.place} · {s.last}</div></div>
                {!s.current && <button className="btn-light btn-sm" onClick={() => { setSessions(sessions.filter((_, j) => j !== i)); notify('Session signed out') }}>Sign out</button>}
              </li>
            ))}
          </ul>
          <button className="btn-danger mt-3" onClick={() => { setSessions(sessions.filter((s) => s.current)); notify('Signed out of all other sessions') }}><LogOut size={16} />Logout all other sessions</button>
        </Card>
        <div className="space-y-5">
          <Card title="Multi-factor authentication">
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"><ShieldCheck size={18} />MFA is enabled (Authenticator app)</div>
            <button className="btn-light mt-3 w-full" onClick={() => notify('Recovery codes regenerated')}>Regenerate recovery codes</button>
          </Card>
          <Card title="Password">
            <p className="text-sm text-slate-500">Last changed 42 days ago.</p>
            <Link to="/profile" className="btn-light mt-3 w-full"><KeyRound size={16} />Change password</Link>
          </Card>
        </div>
      </div>
    </>
  )
}

/* ---------- Booking view ---------- */
export function BookingView() {
  const { id } = useParams()
  const nav = useNavigate()
  const { notify } = useApp()
  const b = BOOKINGS.find((x) => x.id === id) || BOOKINGS[0]
  const pkg = PACKAGES.find((p) => p.name === b.pkg)
  const kv = [['Passenger / Group', b.passenger], ['Type', b.type], ['Passengers', b.pax], ['Package', b.pkg], ['Travel Date', b.date], ['Branch', b.branch], ['Booking Officer', b.officer], ['Makkah Hotel', pkg.makkah], ['Madinah Hotel', pkg.madinah]]
  return (
    <>
      <PageHeader title={`Booking ${b.id}`} crumbs={['Bookings', b.id]}
        actions={<><button className="btn-light" onClick={() => nav(-1)}><ArrowLeft size={16} className="rtl:rotate-180" />Back</button><button className="btn-primary" onClick={() => notify('Printing confirmation')}><Printer size={16} />Print Confirmation</button></>} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Booking details" action={<Badge>{b.status}</Badge>} className="xl:col-span-2">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {kv.map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 px-4 py-3"><dt className="text-xs text-slate-400">{k}</dt><dd className="font-semibold text-slate-800">{v}</dd></div>)}
          </dl>
        </Card>
        <div className="space-y-5">
          <Card title="Payment">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Total</dt><dd className="font-semibold">{fmt(b.total)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Received</dt><dd className="font-semibold text-emerald-600">{fmt(b.paid)}</dd></div>
              <div className="flex justify-between border-t border-slate-100 pt-2"><dt className="text-slate-500">Outstanding</dt><dd className="font-bold text-rose-600">{fmt(b.due)}</dd></div>
            </dl>
            <div className="mt-3"><Badge>{b.payment}</Badge></div>
          </Card>
          <Card title="Operations">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Hotel allocation</span><Badge>{b.hotel}</Badge></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">Transport</span><Badge>{b.transport}</Badge></div>
          </Card>
        </div>
      </div>
    </>
  )
}
