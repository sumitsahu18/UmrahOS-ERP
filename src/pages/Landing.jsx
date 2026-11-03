import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu, X, ArrowRight, Network, CalendarCheck, Hotel, Bus, Coins, CheckCircle2, Languages, ShieldCheck,
  UserPlus, Package, FilePlus2, BedDouble, CreditCard, BadgeCheck, BarChart3, Mail, Phone, MapPin, Sparkles,
  TrendingUp, Users, Building2,
} from 'lucide-react'
import { Logo } from '../components/Layout'
import GlassBg from '../components/GlassBg'
import { ROLES } from '../data/roles'

const NAV = [['Features', '#features'], ['Workflow', '#workflow'], ['Dashboards', '#dashboards'], ['Contact', '#contact']]

const FEATURES = [
  [Network, 'Multi-Branch Management', 'Run head office and every branch from one system with branch-level access.'],
  [CalendarCheck, 'Umrah Bookings & Packages', 'Individual and group bookings, package capacity and payment tracking.'],
  [Hotel, 'Hotel Management', 'Room inventory, availability calendar and group rooming lists.'],
  [Bus, 'Transport & Trips', 'Vehicles, drivers, routes and trip schedules with seat checks.'],
  [Coins, 'Accounting & Finance', 'Ledger, journals, receivables, payables and profit & loss.'],
  [CheckCircle2, 'Approvals & Workflows', 'Expense requests flow from branch to head office for approval.'],
  [Languages, 'Arabic · English · Bengali', 'Full right-to-left Arabic plus English and Bengali.'],
  [ShieldCheck, 'Secure Role-Based Access', '8 roles. Each user sees only what their role allows.'],
]

const FLOW = [
  [UserPlus, 'Register Passenger'], [Package, 'Select Umrah Package'], [FilePlus2, 'Create Booking'], [BedDouble, 'Allocate Hotel & Room'],
  [Bus, 'Assign Transport'], [CreditCard, 'Record Payment'], [BadgeCheck, 'Approval (If Required)'], [BarChart3, 'Reports & Reconciliation'],
]

const glass = 'rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl'

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-3 transition sm:px-5
        ${scrolled ? 'border-white/15 bg-[#0b0f2e]/60 shadow-xl shadow-black/20 backdrop-blur-2xl' : 'border-white/10 bg-white/[0.06] backdrop-blur-xl'}`}>
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(([l, h]) => <a key={l} href={h} className="rounded-xl px-4 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white">{l}</a>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-white/85 hover:text-white">Sign in</Link>
          <Link to="/login" className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-sm font-bold text-navy-950 shadow-lg shadow-amber-500/25 hover:brightness-110">View Demo</Link>
        </div>
        <button className="rounded-xl p-2 text-white hover:bg-white/10 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/15 bg-[#0b0f2e]/80 p-3 backdrop-blur-2xl md:hidden">
          {NAV.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-white/85 hover:bg-white/10">{l}</a>)}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link to="/login" className="rounded-xl border border-white/20 py-3 text-center font-semibold text-white">Sign in</Link>
            <Link to="/login" className="rounded-xl bg-amber-400 py-3 text-center font-bold text-navy-950">View Demo</Link>
          </div>
        </div>
      )}
    </header>
  )
}

function HeroPreview() {
  const bars = [38, 52, 61, 70, 84, 100]
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className={`${glass} border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/40 sm:p-5`}>
        <div className="flex items-center justify-between">
          <div><div className="text-xs text-white/50">Executive Dashboard</div><div className="font-bold">All Branches · This Month</div></div>
          <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {[[Users, '1,245', 'Passengers'], [CalendarCheck, '328', 'Bookings'], [Building2, '18', 'Branches']].map(([I, v, l]) => (
            <div key={l} className="rounded-2xl bg-white/10 p-3">
              <I size={16} className="text-amber-300" />
              <div className="mt-1.5 text-lg font-extrabold sm:text-xl">{v}</div>
              <div className="text-[11px] text-white/60">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-white/10 p-4">
          <div className="mb-3 flex items-center justify-between text-xs"><span className="font-semibold">Bookings trend</span><span className="text-emerald-300">+18%</span></div>
          <div className="flex h-28 items-end gap-2 sm:gap-3">
            {bars.map((h, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-violet-400" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-white/50">{['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`${glass} absolute -left-3 -top-5 hidden items-center gap-2 border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold shadow-xl sm:flex`}>
        <CheckCircle2 size={16} className="text-emerald-300" />Booking UM-1004 confirmed
      </div>
      <div className={`${glass} absolute -bottom-5 -right-3 hidden items-center gap-2 border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold shadow-xl sm:flex`}>
        <TrendingUp size={16} className="text-amber-300" />Profit SAR 390,000
      </div>
    </div>
  )
}

export default function Landing() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#0b0f2e] text-white">
      <GlassBg />
      <Header />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:pt-20">
        <div className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur">
            <Sparkles size={14} />Multi-Branch Umrah Management System
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Manage every Umrah journey <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">from one place</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg lg:mx-0">
            Bookings, passengers, hotels, transport, accounting and approvals for your head office and every branch, in Arabic, English and Bengali.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 font-bold text-navy-950 shadow-lg shadow-amber-500/30 hover:brightness-110">
              Open Demo<ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold backdrop-blur hover:bg-white/15">
              Explore Features
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-md lg:max-w-none">
            {[['8', 'User roles'], ['12', 'ERP modules'], ['3', 'Languages']].map(([v, l]) => (
              <div key={l} className={`${glass} px-3 py-4 text-center`}>
                <div className="text-2xl font-extrabold text-amber-300 sm:text-3xl">{v}</div>
                <div className="text-xs text-white/60 sm:text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <HeroPreview />
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Features</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Everything your Umrah business runs on</h2>
          <p className="mt-3 text-white/65">One ERP for operations, finance and approvals across all branches.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(([I, t, d]) => (
            <div key={t} className={`${glass} group p-6 transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/10`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400/40 to-violet-500/40 text-amber-200 ring-1 ring-white/15"><I size={22} /></span>
              <h3 className="mt-5 font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Key workflow</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">From registration to reconciliation</h2>
        </div>
        <div className={`${glass} mt-12 p-5 sm:p-8`}>
          <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {FLOW.map(([I, t], i) => (
              <li key={t} className="relative flex flex-col items-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-amber-300 ring-1 ring-white/15"><I size={24} /></span>
                <span className="mt-1 text-[11px] font-bold text-white/40">STEP {i + 1}</span>
                <span className="text-sm font-semibold leading-snug">{t}</span>
                {i < FLOW.length - 1 && <span className="absolute left-[calc(50%+36px)] right-[calc(-50%+36px)] top-7 hidden h-px bg-gradient-to-r from-white/30 to-white/5 lg:block" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dashboards */}
      <section id="dashboards" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Role-based dashboards</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">A dashboard for every team</h2>
          <p className="mt-3 text-white/65">Each role gets its own menu and dashboard. Try any one in the demo.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => (
            <Link key={r.id} to={`/login?role=${r.id}`} className={`${glass} group flex flex-col p-5 transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">{r.icon}</span>
              <span className="mt-4 font-bold">{r.name}</span>
              <span className="mt-1 text-sm text-white/60">{r.desc}</span>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-amber-300">{r.dashboard}<ArrowRight size={15} className="transition group-hover:translate-x-1 rtl:rotate-180" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-amber-400/20 p-8 text-center backdrop-blur-xl sm:p-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to see UmrahOS in action?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">Open the demo and explore all 8 role dashboards. No setup needed.</p>
          <Link to="/login" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-navy-950 hover:bg-amber-100">
            Open Demo<ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-24 mt-16 border-t border-white/10 bg-[#080b24]/60 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-white/60">Multi-Branch Umrah Management ERP for bookings, passengers, hotels, transport, accounting and approvals.</p>
          </div>
          <div>
            <h4 className="font-bold">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {NAV.slice(0, 3).map(([l, h]) => <li key={l}><a href={h} className="hover:text-white">{l}</a></li>)}
              <li><Link to="/login" className="hover:text-white">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2"><Mail size={16} className="text-amber-300" />info@umrahos.com</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-amber-300" />+880 9610 000000</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-amber-300" />Dhaka · Makkah · Madinah</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6">
            <span>© 2026 UmrahOS ERP. All rights reserved.</span>
            <span>Built by <b className="text-white/80">KIAAN Technology</b></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
