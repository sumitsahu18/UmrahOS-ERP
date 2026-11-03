import { Save, UserCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, PageHeader } from '../../components/ui'
import { FORMS } from '../../data/pages'
import { FormRenderer } from '../../components/FormRenderer'
import { LANGS } from '../../data/i18n'

export default function Profile() {
  const { role, notify, t, lang, setLang } = useApp()
  return (
    <>
      <PageHeader title="My Profile" crumbs={['My Profile']} subtitle="Personal information, password and language" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr]">
        <Card bodyClass="p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-navy-900 text-gold-400"><UserCircle size={52} /></div>
          <div className="mt-3 text-lg font-bold">Abdul Karim</div>
          <div className="text-sm text-slate-500">{t(role.name)}</div>
          <div className="mt-1 text-xs text-slate-400">Head Office – Dhaka</div>
          <div className="mt-5 text-start">
            <span className="label">Interface language</span>
            <div className="grid grid-cols-3 gap-1.5">
              {LANGS.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} className={`rounded-lg py-2 text-xs font-semibold ${lang === l.code ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{l.label}</button>
              ))}
            </div>
          </div>
        </Card>
        <div>
          <FormRenderer sections={FORMS.profile} />
          <div className="mt-5 flex justify-end"><button className="btn-primary" onClick={() => notify('Profile updated')}><Save size={16} />{t('Save')}</button></div>
        </div>
      </div>
    </>
  )
}
