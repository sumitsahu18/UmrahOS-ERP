import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { User, Upload } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, PageHeader, Badge, DataTable } from '../../components/ui'
import { PASSENGERS, BOOKINGS, DOCUMENTS, INCOME, fmt } from '../../data/mock'

const TABS = ['Personal Details', 'Passport Details', 'Documents', 'Bookings', 'Payments', 'Travel History']

export default function PassengerProfile({ crumbs, initialTab = 0 }) {
  const { id } = useParams()
  const { notify } = useApp()
  const [pid, setPid] = useState(id || PASSENGERS[0].id)
  const [tab, setTab] = useState(initialTab)
  const p = PASSENGERS.find((x) => x.id === pid) || PASSENGERS[0]
  const bookings = BOOKINGS.filter((b) => b.passenger === p.name)
  const kv = (rows) => (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 px-4 py-3"><dt className="text-xs text-slate-400">{k}</dt><dd className="font-semibold text-slate-800">{v}</dd></div>)}
    </dl>
  )

  return (
    <>
      <PageHeader title="Passenger Profile" crumbs={crumbs || ['Passenger Management', 'Passenger Profile']}
        actions={<select className="input w-auto" value={pid} onChange={(e) => setPid(e.target.value)}>{PASSENGERS.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.id})</option>)}</select>} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <Card bodyClass="p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white"><User size={42} /></div>
          <div className="mt-3 text-lg font-bold text-slate-900">{p.name}</div>
          <div className="text-sm text-slate-500">Passport: {p.passport}</div>
          <div className="text-sm text-slate-500">Nationality: {p.nationality}</div>
          <div className="mt-3"><Badge>{p.docs}</Badge></div>
          <nav className="mt-5 space-y-1 text-start">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`w-full rounded-xl px-3 py-2 text-start text-sm ${tab === i ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>{t}</button>
            ))}
          </nav>
        </Card>
        <Card title={TABS[tab]} bodyClass={tab >= 2 ? 'pb-2' : 'px-5 pb-5'}>
          {tab === 0 && kv([['Passenger ID', p.id], ['Full Name', p.name], ['Gender', p.gender], ['Nationality', p.nationality], ['Phone', p.phone], ['Branch', p.branch], ['Family / Group', p.group], ['Total Trips', p.trips]])}
          {tab === 1 && kv([['Passport No.', p.passport], ['Expiry Date', p.expiry], ['Issuing Country', p.nationality], ['Visa Status', p.docs === 'Missing Visa' ? 'Not submitted' : 'Issued']])}
          {tab === 2 && (
            <>
              <div className="px-5 pb-3"><button className="btn-light btn-sm" onClick={() => notify('Upload dialog opened')}><Upload size={14} />Upload Document</button></div>
              <DataTable columns={[{ key: 'name', label: 'Document', strong: true }, { key: 'type', label: 'Type' }, { key: 'size', label: 'Size' }, { key: 'uploaded', label: 'Uploaded' }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> }]} rows={DOCUMENTS.slice(0, 4)} />
            </>
          )}
          {tab === 3 && <DataTable columns={[{ key: 'id', label: 'Booking', strong: true }, { key: 'package', label: 'Package' }, { key: 'date', label: 'Travel Date' }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> }]} rows={bookings.length ? bookings : BOOKINGS.slice(0, 2)} />}
          {tab === 4 && <DataTable columns={[{ key: 'receipt', label: 'Receipt', strong: true }, { key: 'date', label: 'Date' }, { key: 'method', label: 'Method' }, { key: 'amount', label: 'Amount', align: 'end', render: fmt }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> }]} rows={INCOME.slice(0, 3)} />}
          {tab === 5 && <DataTable columns={[{ key: 'year', label: 'Year', strong: true }, { key: 'trip', label: 'Trip' }, { key: 'days', label: 'Days' }, { key: 'branch', label: 'Branch' }]} rows={Array.from({ length: p.trips }, (_, i) => ({ year: 2026 - i, trip: i % 2 ? 'Umrah – Ramadan' : 'Umrah', days: 10 + i * 5, branch: p.branch }))} />}
        </Card>
      </div>
    </>
  )
}
