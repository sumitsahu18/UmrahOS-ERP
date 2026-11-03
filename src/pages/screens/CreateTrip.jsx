import { useState } from 'react'
import { CalendarClock, MapPin, Bus, UserCheck, Users, CheckCircle2, AlertTriangle, Save } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, PageHeader, Field, Input, Select, Progress } from '../../components/ui'
import { VEHICLES, DRIVERS, BOOKINGS } from '../../data/mock'

const Sec = ({ icon: I, title, children }) => (
  <Card title={<span className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><I size={16} /></span>{title}</span>}>
    {children}
  </Card>
)
const Check = ({ ok, okText, badText }) => (
  <div className={`mt-3 flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
    {ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}{ok ? okText : badText}
  </div>
)

export default function CreateTrip({ crumbs }) {
  const { notify } = useApp()
  const [vehicle, setVehicle] = useState(VEHICLES[1].plate)
  const [driver, setDriver] = useState(DRIVERS[1].name)
  const [groups, setGroups] = useState([BOOKINGS[2].id, BOOKINGS[5].id])
  const v = VEHICLES.find((x) => x.plate === vehicle)
  const d = DRIVERS.find((x) => x.name === driver)
  const seats = groups.reduce((s, id) => s + BOOKINGS.find((b) => b.id === id).pax, 0)

  return (
    <>
      <PageHeader title="Create Transport Trip" crumbs={crumbs || ['Trip Management', 'Create Trip']} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Sec icon={CalendarClock} title="Trip Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Trip Reference"><Input value="TRP-5515" readOnly className="input bg-slate-50 font-semibold" /></Field>
            <Field label="Date"><Input type="date" defaultValue="2026-11-05" /></Field>
            <Field label="Departure Time"><Input type="time" defaultValue="09:30" /></Field>
            <Field label="Trip Type"><Select options={['Arrival', 'Departure', 'Intercity', 'Ziyarat']} /></Field>
          </div>
        </Sec>
        <Sec icon={MapPin} title="Route Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Pickup Location"><Select options={['Jeddah Airport (KAIA)', 'Makkah Hotel', 'Madinah Hotel', 'Madinah Airport']} /></Field>
            <Field label="Drop-off Location"><Select options={['Makkah Hotel', 'Madinah Hotel', 'Jeddah Airport (KAIA)', 'Madinah Airport']} /></Field>
            <Field label="Route" span={2}><Select options={['Jeddah → Makkah (Hwy 40)', 'Makkah → Madinah (Hijrah Rd)', 'Makkah Ziyarat Circuit', 'Madinah Ziyarat Circuit']} /></Field>
          </div>
        </Sec>
        <Sec icon={Bus} title="Vehicle Assignment">
          <Field label="Select Vehicle"><select className="input" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>{VEHICLES.map((x) => <option key={x.plate} value={x.plate}>{x.plate} — {x.type} ({x.status})</option>)}</select></Field>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">Vehicle Capacity: <b>{v.capacity} seats</b> · Supplier: {v.supplier}</div>
          <Check ok={v.status === 'Available'} okText="Availability Check: vehicle is free for this slot" badText={`Availability Check: vehicle is ${v.status.toLowerCase()}`} />
        </Sec>
        <Sec icon={UserCheck} title="Driver Assignment">
          <Field label="Select Driver"><select className="input" value={driver} onChange={(e) => setDriver(e.target.value)}>{DRIVERS.map((x) => <option key={x.id}>{x.name}</option>)}</select></Field>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">{d.id} · Licence {d.licence} · {d.phone}</div>
          <Check ok={d.status !== 'Off Duty'} okText="Availability Check: driver available" badText="Availability Check: driver is off duty" />
        </Sec>
        <div className="xl:col-span-2">
          <Sec icon={Users} title="Passenger Assignment">
            <div className="label">Select Booking / Group</div>
            <div className="flex flex-wrap gap-2">
              {BOOKINGS.slice(0, 12).map((b) => {
                const on = groups.includes(b.id)
                return (
                  <button key={b.id} onClick={() => setGroups(on ? groups.filter((g) => g !== b.id) : [...groups, b.id])}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${on ? 'bg-brand-500 text-white ring-brand-500' : 'bg-white text-slate-600 ring-slate-200'}`}>
                    {b.id} · {b.pax} pax
                  </button>
                )
              })}
            </div>
            <div className="mt-4">
              <div className="label">Passenger List</div>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                {groups.map((id) => { const b = BOOKINGS.find((x) => x.id === id); return <span key={id} className="rounded-lg bg-slate-100 px-2.5 py-1">{b.passenger} ({b.pax})</span> })}
              </div>
            </div>
            <div className="mt-4 max-w-md">
              <div className="label">Seat Capacity Check</div>
              <Progress value={seats} max={v.capacity} />
              <div className="mt-1 text-xs text-slate-500">{seats} / {v.capacity} seats</div>
              <Check ok={seats <= v.capacity} okText="Seats within vehicle capacity" badText="Passengers exceed vehicle capacity" />
            </div>
          </Sec>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-light" onClick={() => notify('Trip saved as draft')}>Save</button>
        <button className="btn-primary" disabled={seats > v.capacity} onClick={() => notify('Trip TRP-5515 scheduled')}><Save size={16} />Save / Schedule Trip</button>
      </div>
    </>
  )
}
