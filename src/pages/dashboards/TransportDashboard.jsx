import { useNavigate } from 'react-router-dom'
import { Bus, Car, UserCheck, PlusCircle, Users, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, StatCard, PageHeader, DataTable, Badge, Progress } from '../../components/ui'
import { TRIPS, VEHICLES, DRIVERS } from '../../data/mock'

const HOURS = Array.from({ length: 9 }, (_, i) => 6 + i * 2) // 06..22
const color = { Arrival: 'bg-blue-500', Intercity: 'bg-brand-500', Departure: 'bg-emerald-600', Ziyarat: 'bg-amber-500' }

export default function TransportDashboard() {
  const nav = useNavigate()
  const { notify } = useApp()
  const today = TRIPS.slice(0, 8)
  return (
    <>
      <PageHeader title="Transport Operations Dashboard" subtitle="Trips, vehicles and drivers — today"
        actions={<>
          <button className="btn-primary" onClick={() => nav('/m/trip-management/create-trip')}><PlusCircle size={16} />Create Trip</button>
          <button className="btn-light" onClick={() => nav('/m/vehicle-management/vehicle-availability')}><Car size={16} />Assign Vehicle</button>
        </>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Trips Today" value={today.length} icon={Bus} tone="blue" hint="2 in progress" />
        <StatCard label="Available Vehicles" value={VEHICLES.filter((v) => v.status === 'Available').length} icon={Car} tone="green" hint={`of ${VEHICLES.length}`} />
        <StatCard label="Assigned Drivers" value={DRIVERS.filter((d) => d.status === 'On Duty').length} icon={UserCheck} tone="violet" />
      </div>

      <Card title="Daily Trip Schedule" subtitle="Timeline — 03 Nov 2026" className="mt-5">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[160px_1fr] text-[11px] text-slate-400">
              <div />
              <div className="relative flex justify-between pe-2">{HOURS.map((h) => <span key={h}>{String(h).padStart(2, '0')}:00</span>)}</div>
            </div>
            {today.map((tr) => {
              const hr = parseInt(tr.time) + (tr.time.endsWith('30') ? 0.5 : 0)
              const start = ((hr - 6) / 16) * 100
              const dur = tr.type === 'Intercity' ? 26 : tr.type === 'Ziyarat' ? 20 : 10
              return (
                <div key={tr.id} className="mt-2 grid grid-cols-[160px_1fr] items-center">
                  <div className="truncate pe-3 text-xs font-semibold text-slate-700">{tr.vehicle}<div className="font-normal text-slate-400">{tr.driver}</div></div>
                  <div className="relative h-9 rounded-lg bg-slate-50">
                    <div className={`absolute top-1 bottom-1 flex items-center overflow-hidden rounded-md px-2 text-[11px] font-semibold text-white ${color[tr.type]}`}
                      style={{ insetInlineStart: `${Math.min(start, 100 - dur)}%`, width: `${dur}%` }} title={tr.route}>
                      {tr.time} · {tr.id}
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
              {Object.entries(color).map(([k, c]) => <span key={k} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded ${c}`} />{k}</span>)}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Scheduled Trips" className="mt-5" bodyClass="pb-2">
        <DataTable columns={[
          { key: 'id', label: 'Trip ID', strong: true }, { key: 'route', label: 'Route' }, { key: 'vehicle', label: 'Vehicle' }, { key: 'driver', label: 'Driver' },
          { key: 'time', label: 'Time' }, { key: 'passengers', label: 'Passengers', align: 'end' }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
        ]} rows={TRIPS} />
      </Card>

      <Card title="Passenger Assignments" className="mt-5" bodyClass="pb-2">
        <DataTable columns={[
          { key: 'group', label: 'Group / Booking', strong: true }, { key: 'id', label: 'Trip' },
          { key: 'passengers', label: 'Seats', align: 'end' },
          { key: 'capacity', label: 'Capacity', render: (v, r) => <div className="w-40"><div className="mb-1 text-xs text-slate-500">{r.passengers} / {v}</div><Progress value={r.passengers} max={v} /></div> },
        ]} rows={TRIPS.slice(0, 7)} />
      </Card>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => nav('/m/passenger-assignments/assign-booking-group')}><Users size={16} />Assign Passengers</button>
        <button className="btn-light" onClick={() => notify('Trip status updated')}><RefreshCw size={16} />Update Trip</button>
      </div>
    </>
  )
}
