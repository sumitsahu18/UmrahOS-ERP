import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, ArrowRight, LogIn } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ROLES } from '../../data/roles'
import { Logo } from '../../components/Layout'
import GlassBg from '../../components/GlassBg'

export default function Login() {
  const { setRoleId } = useApp()
  const nav = useNavigate()
  const [show, setShow] = useState(false)
  const [role, setRole] = useState(() => new URLSearchParams(window.location.search).get('role') || ROLES[0].id)

  const enter = (id) => { setRoleId(id); nav('/dashboard') }
  const submit = (e) => { e.preventDefault(); enter(role) }

  return (
    <div className="relative isolate min-h-screen bg-[#0b0f2e] text-white">
      <GlassBg />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
          <ArrowLeft size={18} className="rtl:rotate-180" />Back to website
        </Link>
        <Link to="/"><Logo /></Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* Sign in card */}
        <div className="mx-auto mt-4 max-w-md text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Sign in</h1>
          <p className="mt-2 text-white/70">UmrahOS ERP management</p>
        </div>

        <form onSubmit={submit}
          className="mx-auto mt-8 max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white/90">Email</span>
            <div className="relative">
              <Mail size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input type="email" defaultValue="admin@umrahos.com" required
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-3.5 pe-4 ps-11 text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-white/15" />
            </div>
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-white/90">Password</span>
            <div className="relative">
              <Lock size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input type={show ? 'text' : 'password'} defaultValue="demo1234" required
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-3.5 pe-12 ps-11 text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-white/15" />
              <button type="button" onClick={() => setShow(!show)} className="absolute end-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/70"><input type="checkbox" defaultChecked className="accent-amber-400" />Remember me</label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="font-semibold text-amber-300 hover:text-amber-200">Forgot password?</a>
          </div>
          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 font-bold text-navy-950 shadow-lg shadow-amber-500/30 transition hover:brightness-110">
            <LogIn size={18} />Sign in
          </button>
          <p className="mt-5 text-center text-xs text-white/50">
            Signing in as <b className="text-white/80">{ROLES.find((r) => r.id === role)?.name}</b> — pick another dashboard below.
          </p>
        </form>

        {/* Dashboards */}
        <section className="mt-14">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Choose a dashboard</h2>
            <p className="mt-1 text-sm text-white/60">Click any card to open that role’s dashboard</p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r) => {
              const active = r.id === role
              return (
                <button key={r.id} onClick={() => enter(r.id)} onMouseEnter={() => setRole(r.id)} onFocus={() => setRole(r.id)}
                  className={`group flex flex-col rounded-3xl border p-5 text-start backdrop-blur-xl transition hover:-translate-y-1
                    ${active ? 'border-amber-300/60 bg-white/15 shadow-xl shadow-amber-500/10' : 'border-white/10 bg-white/[0.07] hover:border-white/25 hover:bg-white/10'}`}>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">{r.icon}</span>
                  <span className="mt-4 font-bold leading-snug">{r.dashboard}</span>
                  <span className="mt-1 text-sm text-white/60">{r.name}</span>
                  <span className="mt-1 text-xs text-white/40">{r.desc}</span>
                  <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-amber-300">
                    Open<ArrowRight size={16} className="transition group-hover:translate-x-1 rtl:rotate-180" />
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
