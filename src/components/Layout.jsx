import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Menu, ChevronDown, Bell, Search, Globe, UserCircle, FileText, LifeBuoy, ShieldCheck, LogOut,
  Repeat, PanelLeftClose, PanelLeftOpen, X, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { sectionPath, childPath, slug } from '../data/roles'
import { LANGS } from '../data/i18n'
import { BRANCHES, NOTIFICATIONS } from '../data/mock'

function useOutside(ref, cb) {
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && cb()
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [ref, cb])
}

export function Logo({ small, light = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#151a4a" strokeWidth="2.2" strokeLinejoin="round"><path d="M5 20V9l7-5 7 5v11" /><rect x="9.5" y="12.5" width="5" height="7.5" fill="#151a4a" /></svg>
      </div>
      {!small && (
        <div className="leading-tight">
          <div className={`text-lg font-extrabold ${light ? 'text-white' : 'text-navy-900'}`}>UmrahOS <span className="text-gold-500">ERP</span></div>
        </div>
      )}
    </div>
  )
}

function Sidebar() {
  const { role, t, collapsed, mobileOpen, setMobileOpen } = useApp()
  const { pathname } = useLocation()
  const activeSec = role.menu.find((s) => (s.dashboard ? pathname.startsWith('/dashboard') : pathname.startsWith(`/m/${slug(s.label)}`)))
  const [open, setOpen] = useState(() => new Set(activeSec ? [activeSec.label] : []))

  useEffect(() => {
    if (activeSec) setOpen((o) => new Set(o).add(activeSec.label))
    setMobileOpen(false)
  }, [pathname]) // eslint-disable-line

  const toggle = (l) => setOpen((o) => { const n = new Set(o); n.has(l) ? n.delete(l) : n.add(l); return n })
  const mini = collapsed && !mobileOpen

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 start-0 z-40 flex flex-col bg-navy-900 text-slate-300 transition-all duration-200
        ${mini ? 'w-[76px]' : 'w-[272px]'} ${mobileOpen ? 'translate-x-0' : 'max-lg:-translate-x-full max-lg:rtl:translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-4">
          <Link to="/dashboard"><Logo small={mini} /></Link>
          <button className="lg:hidden rounded-lg p-1.5 hover:bg-white/10" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        {!mini && (
          <div className="mx-3 mt-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">{t('Main Menu')}</div>
            <div className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-white"><span>{role.icon}</span><span className="truncate">{t(role.name)}</span></div>
          </div>
        )}
        <nav className="sidebar-scroll mt-2 flex-1 overflow-y-auto px-3 pb-6">
          {role.menu.map((s, idx) => {
            const Icon = s.icon
            const isActive = activeSec?.label === s.label
            const hasKids = s.children.length > 0
            const isOpen = open.has(s.label)
            const base = `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'hover:bg-white/5 hover:text-white'}`
            const label = (
              <>
                <Icon size={18} className="shrink-0" />
                {!mini && <span className="flex-1 truncate text-start"><span className="opacity-60 me-1">{idx + 1}.</span>{t(s.label)}</span>}
              </>
            )
            return (
              <div key={s.label} className="mt-1">
                {hasKids ? (
                  <div className="flex items-center">
                    <NavLink to={sectionPath(s)} end className={base} title={mini ? t(s.label) : undefined}
                      onClick={() => !mini && setOpen((o) => new Set(o).add(s.label))}>
                      {label}
                      {!mini && (
                        <span role="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(s.label) }} className="rounded-md p-0.5 hover:bg-white/10">
                          <ChevronDown size={15} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
                        </span>
                      )}
                    </NavLink>
                  </div>
                ) : (
                  <NavLink to={sectionPath(s)} className={base} title={mini ? t(s.label) : undefined}>{label}</NavLink>
                )}
                {hasKids && isOpen && !mini && (
                  <div className="ms-[22px] mt-1 space-y-0.5 border-s border-white/10 ps-3">
                    {s.children.map((c) => (
                      <NavLink key={c} to={childPath(s, c)}
                        className={({ isActive: a }) => `block rounded-lg px-3 py-1.5 text-[13px] transition ${a ? 'bg-white/10 font-semibold text-white' : 'text-slate-400 hover:text-white'}`}>
                        {c}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        {!mini && (
          <div className="border-t border-white/10 px-4 py-3 text-[11px] text-slate-400">
            Built by <span className="font-semibold text-slate-200">KIAAN Technology</span>
          </div>
        )}
      </aside>
    </>
  )
}

function Dropdown({ button, children, width = 'w-64' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutside(ref, () => setOpen(false))
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{button}</div>
      {open && <div className={`absolute end-0 top-full z-50 mt-2 ${width} card overflow-hidden`} onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}

function Topbar() {
  const { role, t, lang, setLang, branch, setBranch, period, setPeriod, collapsed, setCollapsed, setMobileOpen, setRoleId } = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const unread = NOTIFICATIONS.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
      <button className="hidden rounded-lg p-2 hover:bg-slate-100 lg:block" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <PanelLeftOpen size={20} className="rtl:rotate-180" /> : <PanelLeftClose size={20} className="rtl:rotate-180" />}
      </button>
      <form className="relative hidden flex-1 md:block md:max-w-sm" onSubmit={(e) => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(q)}`) }}>
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} className="input ps-9 bg-slate-50" placeholder={t('Search records…')} />
      </form>
      <div className="ms-auto flex items-center gap-2">
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="input hidden w-auto py-1.5 xl:block">
          <option value="All Branches">{t('All Branches')}</option>
          {BRANCHES.map((b) => <option key={b.code} value={b.name}>{b.name}</option>)}
        </select>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input hidden w-auto py-1.5 lg:block">
          {['Today', 'This Week', 'This Month', 'This Year'].map((p) => <option key={p} value={p}>{t(p)}</option>)}
        </select>
        <Dropdown width="w-40" button={
          <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 py-1.5 text-sm hover:bg-slate-50">
            <Globe size={16} /><span className="font-semibold uppercase">{lang}</span>
          </button>}>
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)} className={`flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 ${lang === l.code ? 'font-bold text-brand-600' : ''}`}>
              {l.label}<span className="text-[10px] text-slate-400">{l.dir.toUpperCase()}</span>
            </button>
          ))}
        </Dropdown>
        <Dropdown width="w-80" button={
          <button className="relative rounded-xl p-2 hover:bg-slate-100">
            <Bell size={20} />
            {unread > 0 && <span className="absolute -top-0.5 -end-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
          </button>}>
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold">{t('Notifications')}</div>
          {NOTIFICATIONS.slice(0, 4).map((n, i) => (
            <div key={i} className="flex gap-3 border-b border-slate-50 px-4 py-3 hover:bg-slate-50">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-brand-500' : 'bg-slate-200'}`} />
              <div><div className="text-sm font-semibold text-slate-800">{n.title}</div><div className="text-xs text-slate-500">{n.time}</div></div>
            </div>
          ))}
          <Link to="/notifications" className="block px-4 py-2.5 text-center text-sm font-semibold text-brand-600 hover:bg-slate-50">{t('View all')}</Link>
        </Dropdown>
        <Dropdown button={
          <button className="flex items-center gap-2 rounded-xl p-1 pe-2 hover:bg-slate-100">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-navy-900 text-sm font-bold text-gold-400">{role.name[0]}</div>
            <div className="hidden text-start leading-tight sm:block">
              <div className="text-sm font-semibold text-slate-800">Abdul Karim</div>
              <div className="max-w-[140px] truncate text-[11px] text-slate-500">{t(role.name)}</div>
            </div>
            <ChevronDown size={14} className="hidden sm:block" />
          </button>}>
          {[
            ['/profile', UserCircle, 'My Profile'], ['/documents', FileText, 'Documents'], ['/help', LifeBuoy, 'Help'], ['/security', ShieldCheck, 'Session & Security'],
          ].map(([to, I, l]) => (
            <Link key={to} to={to} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"><I size={16} className="text-slate-400" />{t(l)}</Link>
          ))}
          <button onClick={() => { setRoleId(''); nav('/login') }} className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm hover:bg-slate-50"><Repeat size={16} className="text-slate-400" />{t('Switch Role')}</button>
          <button onClick={() => { setRoleId(''); nav('/login') }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"><LogOut size={16} />{t('Logout')}</button>
        </Dropdown>
      </div>
    </header>
  )
}

function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const ok = toast.kind === 'success'
  return (
    <div key={toast.id} className="fixed bottom-5 end-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
      {ok ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-amber-400" />}{toast.msg}
    </div>
  )
}

export default function Layout() {
  const { collapsed } = useApp()
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className={`transition-all duration-200 ${collapsed ? 'lg:ps-[76px]' : 'lg:ps-[272px]'}`}>
        <Topbar />
        <main className="mx-auto max-w-[1500px] p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  )
}
