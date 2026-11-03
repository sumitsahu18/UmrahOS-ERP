import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, UserPlus, FilePlus2, CheckCircle2, Clock, PlaneTakeoff, FileWarning } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, StatCard, PageHeader, DataTable, Badge } from '../../components/ui'
import { Donut } from '../../components/charts'
import { BOOKINGS, BOOKING_STATUS, PACKAGES, PASSENGERS } from '../../data/mock'

export default function BookingDashboard() {
  const { t, notify } = useApp()
  const nav = useNavigate()
  const [f, setF] = useState({ passenger: '', id: '', pkg: '' })
  const rows = useMemo(() => BOOKINGS.filter((b) =>
    b.passenger.toLowerCase().includes(f.passenger.toLowerCase()) && b.id.toLowerCase().includes(f.id.toLowerCase()) && (!f.pkg || b.pkg === f.pkg)
  ).slice(0, 8), [f])

  return (
    <>
      <PageHeader title="Booking Operations Dashboard" subtitle="Create and track Umrah bookings"
        actions={<>
          <button className="btn-primary" onClick={() => nav('/m/booking-management/create-booking')}><PlusCircle size={16} />Create Booking</button>
          <button className="btn-light" onClick={() => nav('/m/passenger-management/add-passenger')}><UserPlus size={16} />Add Passenger</button>
        </>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="New Bookings" value="14" icon={FilePlus2} tone="violet" hint="today" />
        <StatCard label="Confirmed Bookings" value="240" icon={CheckCircle2} tone="green" />
        <StatCard label="Pending Bookings" value="52" icon={Clock} tone="amber" />
      </div>

      <Card title="Booking Status Chart" className="mt-5"><Donut data={BOOKING_STATUS} sub="Bookings" /></Card>

      <Card title="Search / Filter" className="mt-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input className="input" placeholder="Passenger name" value={f.passenger} onChange={(e) => setF({ ...f, passenger: e.target.value })} />
          <input className="input" placeholder="Booking ID (e.g. UM-1004)" value={f.id} onChange={(e) => setF({ ...f, id: e.target.value })} />
          <select className="input" value={f.pkg} onChange={(e) => setF({ ...f, pkg: e.target.value })}>
            <option value="">All packages</option>{PACKAGES.map((p) => <option key={p.code}>{p.name}</option>)}
          </select>
        </div>
      </Card>

      <Card title="Recent Bookings" className="mt-5" bodyClass="pb-2">
        <DataTable columns={[
          { key: 'id', label: 'Booking ID', strong: true }, { key: 'passenger', label: 'Passenger' },
          { key: 'package', label: 'Package' }, { key: 'date', label: 'Travel Date' },
          { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
        ]} rows={rows}
          actions={(r) => (<>
            <button className="btn-light btn-sm" onClick={() => nav(`/booking/${r.id}`)}>{t('View')}</button>
            <button className="btn-light btn-sm" onClick={() => nav('/m/booking-management/edit-booking')}>{t('Edit')}</button>
            <button className="btn-light btn-sm" onClick={() => notify(`Printing confirmation ${r.id}`)}>{t('Print')}</button>
          </>)} />
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Upcoming Departures">
          <ul className="divide-y divide-slate-100">
            {BOOKINGS.filter((b) => b.status === 'Confirmed').slice(0, 5).map((b) => (
              <li key={b.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><PlaneTakeoff size={18} /></span>
                <div className="flex-1"><div className="text-sm font-semibold">{b.passenger}</div><div className="text-xs text-slate-500">{b.id} · {b.package} · {b.pax} pax</div></div>
                <span className="text-sm font-semibold text-slate-700">{b.date}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Document Alerts">
          <ul className="divide-y divide-slate-100">
            {PASSENGERS.filter((p) => p.docs !== 'Complete').slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600"><FileWarning size={18} /></span>
                <div className="flex-1"><div className="text-sm font-semibold">{p.name}</div><div className="text-xs text-slate-500">{p.id} · Passport {p.passport}</div></div>
                <Badge>{p.docs}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
