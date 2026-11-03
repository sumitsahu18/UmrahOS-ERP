import { Building2, Users, BookOpen, AlertTriangle, Info } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, StatCard, PageHeader, BranchSelect, DateRange, DataTable, Badge, Restriction, Progress } from '../../components/ui'
import { SimpleBars, Donut } from '../../components/charts'
import { BRANCHES, EMPLOYEES, BOOKING_STATUS } from '../../data/mock'

const ALERTS = [
  { level: 'high', text: 'Jeddah Liaison branch is inactive — 3 bookings need reassignment.' },
  { level: 'med', text: '8 passengers in Sylhet Branch have missing visa documents.' },
  { level: 'med', text: 'Room allocation pending for group GRP-314 (Makkah).' },
  { level: 'low', text: '2 new access requests awaiting role assignment.' },
]

export default function HeadOfficeDashboard() {
  const { role, branch, setBranch } = useApp()
  return (
    <>
      <PageHeader title="Head Office Dashboard" subtitle="Branches, employees and operations across the company"
        actions={<><BranchSelect value={branch} onChange={setBranch} /><DateRange /></>} />
      {role.restriction && <Restriction>{role.restriction}</Restriction>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Branches" value={BRANCHES.length} icon={Building2} tone="navy" hint="6 active · 1 inactive" />
        <StatCard label="Employees" value={BRANCHES.reduce((s, b) => s + b.staff, 0)} icon={Users} tone="violet" trend="+4" hint="this month" />
        <StatCard label="Bookings" value={BRANCHES.reduce((s, b) => s + b.bookings, 0).toLocaleString()} icon={BookOpen} tone="blue" trend="+9%" />
      </div>

      <Card title="Branch Activity Overview" subtitle="Bookings and passengers by branch" className="mt-5">
        <SimpleBars data={BRANCHES.map((b) => ({ name: b.code, Bookings: b.bookings, Staff: b.staff * 4 }))} x="name"
          bars={[{ key: 'Bookings', name: 'Bookings' }, { key: 'Staff', name: 'Staff activity (×4)', color: '#e8ad35' }]} h={280} />
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Employee Activity" subtitle="Actions logged this period">
          <ul className="space-y-3">
            {EMPLOYEES.slice(0, 7).map((e) => (
              <li key={e.id} className="flex items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{e.name.split(' ').map((x) => x[0]).join('')}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm"><span className="truncate font-medium text-slate-800">{e.name} <span className="text-xs text-slate-400">· {e.role}</span></span><span className="text-xs font-semibold text-slate-500">{e.activity}</span></div>
                  <div className="mt-1"><Progress value={e.activity} max={100} /></div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Booking Status"><Donut data={BOOKING_STATUS} sub="Bookings" /></Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Branch Directory" className="xl:col-span-2" bodyClass="pb-2">
          <DataTable columns={[
            { key: 'code', label: 'Code', strong: true }, { key: 'name', label: 'Branch' }, { key: 'manager', label: 'Manager' },
            { key: 'staff', label: 'Staff', align: 'end' }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
          ]} rows={BRANCHES} />
        </Card>
        <Card title="Operational Alerts">
          <ul className="space-y-3">
            {ALERTS.map((a, i) => (
              <li key={i} className={`flex gap-3 rounded-xl p-3 text-sm ${a.level === 'high' ? 'bg-rose-50 text-rose-800' : a.level === 'med' ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-800'}`}>
                {a.level === 'low' ? <Info size={18} className="shrink-0" /> : <AlertTriangle size={18} className="shrink-0" />}{a.text}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
