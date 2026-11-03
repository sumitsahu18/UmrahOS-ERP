import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, PlaneTakeoff, PlusCircle, UserPlus, Receipt, BarChart3 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, StatCard, PageHeader, DataTable, Badge, Restriction } from '../../components/ui'
import { BookingsTrend } from '../../components/charts'
import { TREND, BOOKINGS, EXPENSES, fmt } from '../../data/mock'

export default function BranchDashboard() {
  const { role } = useApp()
  const nav = useNavigate()
  const due = BOOKINGS.filter((b) => b.due > 0).slice(0, 5)
  return (
    <>
      <PageHeader title="Branch Dashboard" subtitle={<>Branch: <b className="text-slate-700">Chattogram Branch</b> (assigned)</>} />
      {role.restriction && <Restriction>{role.restriction}</Restriction>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Bookings" value="196" icon={BookOpen} tone="blue" hint="7 today" />
        <StatCard label="Passengers" value="412" icon={Users} tone="violet" trend="+6%" />
        <StatCard label="Departures" value="9" icon={PlaneTakeoff} tone="green" hint="next 14 days" />
      </div>

      <Card title="Monthly Booking Trend" className="mt-5"><BookingsTrend data={TREND} h={270} /></Card>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Pending Payments" bodyClass="pb-2">
          <DataTable compact columns={[
            { key: 'id', label: 'Booking', strong: true }, { key: 'passenger', label: 'Passenger' },
            { key: 'due', label: 'Outstanding', align: 'end', render: (v) => <span className="font-semibold text-rose-600">{fmt(v)}</span> },
            { key: 'payment', label: 'Status', render: (v) => <Badge>{v}</Badge> },
          ]} rows={due} />
        </Card>
        <Card title="Expense Requests" bodyClass="pb-2">
          <DataTable compact columns={[
            { key: 'id', label: 'Request', strong: true }, { key: 'category', label: 'Category' },
            { key: 'amount', label: 'Amount', align: 'end', render: fmt }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
          ]} rows={EXPENSES.slice(0, 5)} />
        </Card>
      </div>

      <Card title="Today's Operations" className="mt-5" bodyClass="pb-2">
        <DataTable columns={[
          { key: 'id', label: 'Booking', strong: true }, { key: 'passenger', label: 'Passenger' }, { key: 'package', label: 'Package' },
          { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
        ]} rows={BOOKINGS.slice(0, 6)} />
      </Card>

      <Card title="Quick Actions" className="mt-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ['New Booking', PlusCircle, '/m/booking-management/new-booking', 'bg-brand-500'],
            ['Add Passenger', UserPlus, '/m/passenger-management/add-passenger', 'bg-blue-500'],
            ['Submit Expense', Receipt, '/m/branch-finance/expense-requests', 'bg-amber-500'],
            ['View Reports', BarChart3, '/m/branch-reports/branch-performance', 'bg-emerald-600'],
          ].map(([l, I, to, c]) => (
            <button key={l} onClick={() => nav(to)} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:bg-brand-50">
              <span className={`grid h-11 w-11 place-items-center rounded-xl text-white ${c}`}><I size={20} /></span>{l}
            </button>
          ))}
        </div>
      </Card>
    </>
  )
}
