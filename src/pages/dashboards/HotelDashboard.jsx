import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BedDouble, BedSingle, LogIn, ClipboardList, ListChecks } from 'lucide-react'
import { Card, StatCard, PageHeader, DateRange, DataTable, Badge } from '../../components/ui'
import { SimpleBars } from '../../components/charts'
import { HOTELS, ROOM_TYPES, CHECKINS } from '../../data/mock'

const DAYS = ['04 Nov', '05 Nov', '06 Nov', '07 Nov', '08 Nov', '09 Nov', '10 Nov']
const avail = (ti, di) => Math.max(0, ((ti * 13 + di * 7) % 24) - 3)

export default function HotelDashboard() {
  const nav = useNavigate()
  const [hotel, setHotel] = useState('All Hotels')
  const total = ROOM_TYPES.reduce((s, r) => s + r.total, 0)
  const occ = ROOM_TYPES.reduce((s, r) => s + r.occupied, 0)
  return (
    <>
      <PageHeader title="Hotel Operations Dashboard" subtitle="Rooms, occupancy and arrivals"
        actions={<>
          <select className="input w-auto" value={hotel} onChange={(e) => setHotel(e.target.value)}>
            <option>All Hotels</option>{HOTELS.map((h) => <option key={h.code}>{h.name}</option>)}
          </select>
          <DateRange />
        </>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Available Rooms" value={total - occ} icon={BedSingle} tone="green" hint={`of ${total} rooms`} />
        <StatCard label="Occupied Rooms" value={occ} icon={BedDouble} tone="violet" hint={`${Math.round((occ / total) * 100)}% occupancy`} />
        <StatCard label="Arrivals Today" value="46" icon={LogIn} tone="blue" hint="guests" />
      </div>

      <Card title="Room Occupancy Chart" subtitle="Occupied vs available by hotel" className="mt-5">
        <SimpleBars data={HOTELS.map((h) => ({ name: h.name.split(' ').slice(0, 2).join(' '), Occupied: h.rooms - h.available, Available: h.available }))} x="name"
          bars={[{ key: 'Occupied', name: 'Occupied', color: '#6d5dfc' }, { key: 'Available', name: 'Available', color: '#16a34a' }]} h={280} />
      </Card>

      <Card title="Room Availability Calendar" subtitle="Available rooms per type and date" className="mt-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr><th className="th">Room Type</th>{DAYS.map((d) => <th key={d} className="th text-center">{d}</th>)}</tr></thead>
            <tbody>
              {ROOM_TYPES.map((r, ti) => (
                <tr key={r.type} className="border-t border-slate-100">
                  <td className="td font-semibold">{r.type} <span className="text-xs text-slate-400">({r.capacity} pax)</span></td>
                  {DAYS.map((d, di) => {
                    const a = avail(ti, di)
                    return (
                      <td key={d} className="p-1.5 text-center">
                        <div className={`rounded-lg py-2 text-xs font-bold ${a === 0 ? 'bg-rose-100 text-rose-700' : a < 6 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{a === 0 ? 'Full' : a}</div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Upcoming Check-ins" className="mt-5" bodyClass="pb-2">
        <DataTable columns={[
          { key: 'passenger', label: 'Passenger', strong: true }, { key: 'booking', label: 'Booking' }, { key: 'hotel', label: 'Hotel' },
          { key: 'room', label: 'Room' }, { key: 'checkin', label: 'Check-in' }, { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
        ]} rows={CHECKINS.filter((c) => c.status === 'Expected' || c.status === 'Checked In')} />
      </Card>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => nav('/m/room-allocation/assign-rooms')}><ClipboardList size={16} />Allocate Room</button>
        <button className="btn-light" onClick={() => nav('/m/room-allocation/group-rooming-lists')}><ListChecks size={16} />View Rooming List</button>
      </div>
    </>
  )
}
