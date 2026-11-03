import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getRole } from '../data/roles'
import { LANGS, translate } from '../data/i18n'

const Ctx = createContext(null)

const read = (k, d) => {
  try { return localStorage.getItem(k) ?? d } catch { return d }
}
const write = (k, v) => {
  try { localStorage.setItem(k, v) } catch { /* ignore */ }
}

export function AppProvider({ children }) {
  const [roleId, setRoleId] = useState(() => read('umrahos.role', ''))
  const [lang, setLang] = useState(() => read('umrahos.lang', 'en'))
  const [branch, setBranch] = useState('All Branches')
  const [period, setPeriod] = useState('This Month')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { write('umrahos.role', roleId) }, [roleId])
  useEffect(() => {
    write('umrahos.lang', lang)
    const l = LANGS.find((x) => x.code === lang) || LANGS[0]
    document.documentElement.lang = l.code
    document.documentElement.dir = l.dir
  }, [lang])

  const t = useCallback((s) => translate(lang, s), [lang])
  const notify = useCallback((msg, kind = 'success') => {
    setToast({ msg, kind, id: Date.now() })
    setTimeout(() => setToast(null), 2600)
  }, [])

  const role = roleId ? getRole(roleId) : null

  return (
    <Ctx.Provider value={{ role, roleId, setRoleId, lang, setLang, t, branch, setBranch, period, setPeriod, collapsed, setCollapsed, mobileOpen, setMobileOpen, toast, notify }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)
