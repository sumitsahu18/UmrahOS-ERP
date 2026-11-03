import { useState } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, PageHeader, Field, Input } from '../../components/ui'
import { BOOKINGS, HOTELS, ROOM_TYPES, PASSENGERS } from '../../data/mock'

export default function RoomAllocation({ crumbs }) {
  const { notify } = useApp()
  const [booking, setBooking] = useState(BOOKINGS[2].id)
  const [hotel, setHotel] = useState(HOTELS[1].name)
  const [rooms, setRooms] = useState([{ type: 'Quad', no: '804', guests: [0, 1, 2, 3] }])
  const b = BOOKINGS.find((x) => x.id === booking)
  const guests = PASSENGERS.slice(0, Math.max(b.pax, 4) + 2)
  const cap = (t) => ROOM_TYPES.find((r) => r.type === t).capacity

  const assigned = new Set(rooms.flatMap((r) => r.guests))
  const errors = rooms.filter((r) => r.guests.length > cap(r.type))
  const toggleGuest = (ri, gi) => setRooms((rs) => rs.map((r, i) => {
    if (i !== ri) return { ...r, guests: r.guests.filter((g) => g !== gi) }
    return { ...r, guests: r.guests.includes(gi) ? r.guests.filter((g) => g !== gi) : [...r.guests, gi] }
  }))

  return (
    <>
      <PageHeader title="Room Allocation" crumbs={crumbs || ['Room Allocation', 'Assign Rooms']} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Stay Details">
          <div className="space-y-4">
            <Field label="Select Booking / Group"><select className="input" value={booking} onChange={(e) => setBooking(e.target.value)}>{BOOKINGS.map((x) => <option key={x.id} value={x.id}>{x.id} — {x.passenger} ({x.pax} pax)</option>)}</select></Field>
            <Field label="Select Hotel"><select className="input" value={hotel} onChange={(e) => setHotel(e.target.value)}>{HOTELS.map((h) => <option key={h.code}>{h.name}</option>)}</select></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Check-in Date"><Input type="date" defaultValue="2026-12-05" /></Field>
              <Field label="Check-out Date"><Input type="date" defaultValue="2026-12-12" /></Field>
            </div>
          </div>
          <div className="mt-5">
            <div className="label">Available Room Types</div>
            <div className="grid grid-cols-2 gap-2">
              {ROOM_TYPES.map((r) => (
                <div key={r.type} className="rounded-xl border border-slate-200 p-3">
                  <div className="text-sm font-bold">{r.type}</div>
                  <div className="text-xs text-slate-500">{r.capacity} pax · {r.total - r.occupied} free</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Assign Room(s)" subtitle="Tick guests for each room" className="xl:col-span-2"
          action={<button className="btn-light btn-sm" onClick={() => setRooms([...rooms, { type: 'Double', no: '', guests: [] }])}>+ Add room</button>}>
          <div className="space-y-4">
            {rooms.map((r, ri) => {
              const over = r.guests.length > cap(r.type)
              return (
                <div key={ri} className={`rounded-2xl border p-4 ${over ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'}`}>
                  <div className="flex flex-wrap items-end gap-3">
                    <Field label="Room Type"><select className="input w-36" value={r.type} onChange={(e) => setRooms(rooms.map((x, i) => (i === ri ? { ...x, type: e.target.value } : x)))}>{ROOM_TYPES.map((t) => <option key={t.type}>{t.type}</option>)}</select></Field>
                    <Field label="Room No."><input className="input w-28" value={r.no} placeholder="e.g. 805" onChange={(e) => setRooms(rooms.map((x, i) => (i === ri ? { ...x, no: e.target.value } : x)))} /></Field>
                    <div className={`ms-auto text-sm font-semibold ${over ? 'text-rose-600' : 'text-slate-500'}`}>{r.guests.length} / {cap(r.type)} guests</div>
                    {rooms.length > 1 && <button className="btn-light btn-sm" onClick={() => setRooms(rooms.filter((_, i) => i !== ri))}>Remove</button>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {guests.map((g, gi) => {
                      const on = r.guests.includes(gi)
                      const elsewhere = !on && assigned.has(gi)
                      return (
                        <button key={g.id} onClick={() => toggleGuest(ri, gi)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${on ? 'bg-brand-500 text-white ring-brand-500' : elsewhere ? 'bg-slate-100 text-slate-400 ring-slate-200' : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-300'}`}>
                          {g.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5">
            <div className="label">Room Capacity Validation</div>
            {errors.length ? (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"><AlertTriangle size={18} />{errors.length} room(s) exceed capacity. Fix before saving.</div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 size={18} />All rooms within capacity · {assigned.size} of {guests.length} guests assigned · no conflicting reservations.</div>
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button className="btn-primary" disabled={errors.length > 0} onClick={() => notify(`Allocation saved for ${booking} at ${hotel}`)}><Save size={16} />Save Allocation</button>
          </div>
        </Card>
      </div>
    </>
  )
}
