import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, User, Package, FileText, CreditCard, BadgeCheck, Printer, Save, UserPlus, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, PageHeader, Field, Input, Select, Progress, Badge } from '../../components/ui'
import { PASSENGERS, PACKAGES, BRANCHES, fmt } from '../../data/mock'

const STEPS = [
  { label: 'Passenger', icon: User },
  { label: 'Package', icon: Package },
  { label: 'Booking', icon: FileText },
  { label: 'Payment', icon: CreditCard },
  { label: 'Confirmation', icon: BadgeCheck },
]

export default function NewBooking({ title = 'Create Umrah Booking', crumbs = [] }) {
  const { notify, t } = useApp()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState('existing')
  const [d, setD] = useState({
    passenger: PASSENGERS[0].id, group: '', newName: '', newPassport: '',
    pkg: PACKAGES[0].code, from: '2026-12-05', to: '2026-12-15',
    branch: BRANCHES[1].name, officer: 'Sadia Rahman', pax: 1, status: 'Pending',
    received: 0, dueDate: '2026-11-20',
  })
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value })
  const pkg = PACKAGES.find((p) => p.code === d.pkg)
  const total = pkg.price * Number(d.pax || 1)
  const outstanding = Math.max(0, total - Number(d.received || 0))
  const ref = useMemo(() => `UM-${1100 + Math.floor(Math.random() * 800)}`, [])
  const pas = PASSENGERS.find((p) => p.id === d.passenger)
  const left = pkg.capacity - pkg.booked

  return (
    <>
      <PageHeader title={title} crumbs={crumbs.length ? crumbs : ['Booking Management', 'Create Booking']} />

      <Card bodyClass="p-5">
        <ol className="flex flex-wrap items-center gap-2 md:gap-0">
          {STEPS.map((s, i) => {
            const I = s.icon
            const done = i < step
            const cur = i === step
            return (
              <li key={s.label} className="flex flex-1 items-center gap-2">
                <button onClick={() => i <= step && setStep(i)} className="flex items-center gap-2">
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${done ? 'bg-emerald-600 text-white' : cur ? 'bg-brand-500 text-white ring-4 ring-brand-100' : 'bg-slate-100 text-slate-400'}`}>{done ? <Check size={16} /> : <I size={16} />}</span>
                  <span className={`text-left text-xs leading-tight ${cur ? 'font-bold text-slate-900' : 'text-slate-500'}`}>STEP {i + 1}<br /><span className="text-sm">{s.label}</span></span>
                </button>
                {i < STEPS.length - 1 && <span className={`mx-3 hidden h-0.5 flex-1 rounded md:block ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </li>
            )
          })}
        </ol>
      </Card>

      <Card className="mt-5" title={`Step ${step + 1}: ${STEPS[step].label}`}>
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {[['existing', 'Select Existing Passenger', User], ['new', 'Add New Passenger', UserPlus], ['group', 'Select Family / Group', Users]].map(([k, l, I]) => (
                <button key={k} onClick={() => setMode(k)} className={`btn ${mode === k ? 'bg-brand-50 text-brand-700 ring-2 ring-brand-400' : 'btn-light'}`}><I size={16} />{l}</button>
              ))}
            </div>
            {mode === 'existing' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Passenger"><select className="input" value={d.passenger} onChange={set('passenger')}>{PASSENGERS.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.passport}</option>)}</select></Field>
                <div className="rounded-xl bg-slate-50 p-4 text-sm">
                  <div className="font-bold text-slate-800">{pas.name}</div>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-slate-500"><span>ID: {pas.id}</span><span>Passport: {pas.passport}</span><span>Nationality: {pas.nationality}</span><span>Docs: <Badge>{pas.docs}</Badge></span></div>
                </div>
              </div>
            )}
            {mode === 'new' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Full Name"><Input value={d.newName} onChange={set('newName')} placeholder="As in passport" /></Field>
                <Field label="Passport Number"><Input value={d.newPassport} onChange={set('newPassport')} placeholder="M1234567" /></Field>
                <Field label="Nationality"><Select options={['Bangladesh', 'India', 'Pakistan', 'United Kingdom']} /></Field>
                <Field label="Date of Birth"><Input type="date" /></Field>
                <Field label="Gender"><Select options={['Male', 'Female']} /></Field>
                <Field label="Phone"><Input placeholder="+880 …" /></Field>
              </div>
            )}
            {mode === 'group' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Family / Group"><select className="input" value={d.group} onChange={set('group')}>
                  <option value="">Select group…</option>{[...new Set(PASSENGERS.map((p) => p.group).filter((g) => g !== '—'))].map((g) => <option key={g}>{g}</option>)}
                </select></Field>
                <Field label="Members"><Input type="number" min="1" value={d.pax} onChange={set('pax')} /></Field>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Field label="Select Package"><select className="input" value={d.pkg} onChange={set('pkg')}>{PACKAGES.map((p) => <option key={p.code} value={p.code}>{p.name} — {fmt(p.price)}</option>)}</select></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Travel Date — From"><Input type="date" value={d.from} onChange={set('from')} /></Field>
                <Field label="Travel Date — To"><Input type="date" value={d.to} onChange={set('to')} /></Field>
              </div>
              <div>
                <span className="label">Package Capacity</span>
                <Progress value={pkg.booked} max={pkg.capacity} />
                <div className="mt-1 text-xs text-slate-500">{pkg.booked} / {pkg.capacity} booked · <b className={left > 0 ? 'text-emerald-600' : 'text-rose-600'}>{left > 0 ? `${left} seats left` : 'Fully booked'}</b></div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="mb-2 text-xs font-semibold uppercase text-slate-400">Package Details</div>
              <div className="text-base font-bold text-slate-900">{pkg.name}</div>
              <dl className="mt-3 space-y-1.5 text-slate-600">
                <div className="flex justify-between"><dt>Duration</dt><dd className="font-semibold">{pkg.days} days</dd></div>
                <div className="flex justify-between"><dt>Makkah hotel</dt><dd className="font-semibold">{pkg.makkah}</dd></div>
                <div className="flex justify-between"><dt>Madinah hotel</dt><dd className="font-semibold">{pkg.madinah}</dd></div>
                <div className="flex justify-between"><dt>Start</dt><dd className="font-semibold">{pkg.start}</dd></div>
                <div className="flex justify-between"><dt>Price / person</dt><dd className="font-semibold">{fmt(pkg.price)}</dd></div>
              </dl>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Booking Reference (Automatic)"><Input value={ref} readOnly className="input bg-slate-50 font-semibold" /></Field>
            <Field label="Branch"><select className="input" value={d.branch} onChange={set('branch')}>{BRANCHES.map((b) => <option key={b.code}>{b.name}</option>)}</select></Field>
            <Field label="Booking Officer"><Select value={d.officer} onChange={set('officer')} options={['Sadia Rahman', 'Karim Uddin', 'Farhana Akter', 'Jamal Hossain']} /></Field>
            <Field label="Passenger Assignment (no. of pax)"><Input type="number" min="1" value={d.pax} onChange={set('pax')} /></Field>
            <Field label="Booking Status"><Select value={d.status} onChange={set('status')} options={['Pending', 'Confirmed', 'In Progress', 'Cancelled']} /></Field>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Field label="Total Amount"><Input value={fmt(total)} readOnly className="input bg-slate-50 font-semibold" /></Field>
            <Field label="Amount Received (SAR)"><Input type="number" min="0" value={d.received} onChange={set('received')} /></Field>
            <Field label="Outstanding Balance"><Input value={fmt(outstanding)} readOnly className={`input bg-slate-50 font-semibold ${outstanding ? 'text-rose-600' : 'text-emerald-600'}`} /></Field>
            <Field label="Payment Due Date"><Input type="date" value={d.dueDate} onChange={set('dueDate')} /></Field>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mb-3 text-sm font-semibold text-slate-500">Review Booking</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                ['Reference', ref], ['Passenger', mode === 'new' ? d.newName || '—' : mode === 'group' ? d.group || '—' : pas.name], ['Package', pkg.name],
                ['Travel', `${d.from} → ${d.to}`], ['Branch', d.branch], ['Booking Officer', d.officer], ['Passengers', d.pax], ['Status', d.status],
                ['Total', fmt(total)], ['Received', fmt(Number(d.received))], ['Outstanding', fmt(outstanding)], ['Due Date', d.dueDate],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 px-4 py-3"><div className="text-xs text-slate-400">{k}</div><div className="font-semibold text-slate-800">{v}</div></div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">Hotel and transport assignments can follow the initial booking through their respective operational modules.</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-5">
          <button className="btn-light" disabled={step === 0} onClick={() => setStep(step - 1)}>{t('Back')}</button>
          {step < 4 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)}>{t('Next')}</button>
          ) : (
            <div className="flex gap-2">
              <button className="btn-light" onClick={() => notify(`Printing confirmation ${ref}`)}><Printer size={16} />Print Confirmation</button>
              <button className="btn-primary" onClick={() => { notify(`Booking ${ref} saved`); nav('/dashboard') }}><Save size={16} />Save Booking</button>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
