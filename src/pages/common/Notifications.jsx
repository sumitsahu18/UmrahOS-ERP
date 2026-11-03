import { useState } from 'react'
import { Bell, CheckCircle2, AlertTriangle, BookOpen, Bus, Hotel, Wallet, ShieldAlert, CheckCheck } from 'lucide-react'
import { Card, PageHeader } from '../../components/ui'
import { NOTIFICATIONS } from '../../data/mock'

const ICON = { approval: CheckCircle2, booking: BookOpen, alert: AlertTriangle, transport: Bus, hotel: Hotel, finance: Wallet, security: ShieldAlert }
const TONE = { approval: 'bg-emerald-50 text-emerald-600', booking: 'bg-blue-50 text-blue-600', alert: 'bg-rose-50 text-rose-600', transport: 'bg-amber-50 text-amber-600', hotel: 'bg-violet-50 text-violet-600', finance: 'bg-teal-50 text-teal-600', security: 'bg-slate-100 text-slate-600' }

export default function Notifications() {
  const [items, setItems] = useState(NOTIFICATIONS)
  const [tab, setTab] = useState('All')
  const shown = items.filter((n) => tab === 'All' || (tab === 'Unread' ? n.unread : !n.unread))
  return (
    <>
      <PageHeader title="Notifications" crumbs={['Notifications']} subtitle="Role-relevant alerts and history"
        actions={<button className="btn-light" onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}><CheckCheck size={16} />Mark all as read</button>} />
      <Card bodyClass="p-0">
        <div className="flex gap-1 border-b border-slate-100 px-5 pt-4">
          {['All', 'Unread', 'History'].map((x) => (
            <button key={x} onClick={() => setTab(x)} className={`-mb-px border-b-2 px-3 pb-3 text-sm font-semibold ${tab === x ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500'}`}>{x}</button>
          ))}
        </div>
        <ul className="divide-y divide-slate-100">
          {shown.length === 0 && <li className="py-12 text-center text-sm text-slate-400"><Bell className="mx-auto mb-2" />Nothing here</li>}
          {shown.map((n, i) => {
            const I = ICON[n.type] || Bell
            return (
              <li key={i} className={`flex gap-4 px-5 py-4 ${n.unread ? 'bg-brand-50/40' : ''}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${TONE[n.type]}`}><I size={18} /></span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold text-slate-800">{n.title}</div>
                    <span className="whitespace-nowrap text-xs text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-sm text-slate-500">{n.body}</p>
                </div>
                {n.unread && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />}
              </li>
            )
          })}
        </ul>
      </Card>
    </>
  )
}
