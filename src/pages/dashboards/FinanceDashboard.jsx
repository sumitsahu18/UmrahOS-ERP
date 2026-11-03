import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, StatCard, PageHeader, BranchSelect, DateRange, DataTable, Badge } from '../../components/ui'
import { IncomeExpense } from '../../components/charts'
import { TREND, EXPENSES, JOURNALS, fmt } from '../../data/mock'

const AGING = (items) => (
  <ul className="space-y-3">
    {items.map(([l, v, c]) => (
      <li key={l} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
        <span className="flex items-center gap-2 text-slate-600"><span className={`h-2.5 w-2.5 rounded-full ${c}`} /><bdi>{l}</bdi></span>
        <span className="font-bold tabular-nums text-slate-900">{fmt(v)}</span>
      </li>
    ))}
  </ul>
)

export default function FinanceDashboard() {
  const { branch, setBranch, notify, t } = useApp()
  const nav = useNavigate()
  const [rows, setRows] = useState(EXPENSES.filter((e) => ['Pending', 'Returned'].includes(e.status)))
  const act = (r, status) => { setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, status } : x))); notify(`${r.id} → ${status}`) }
  const inc = TREND.reduce((s, m) => s + m.income, 0)
  const exp = TREND.reduce((s, m) => s + m.expenses, 0)

  return (
    <>
      <PageHeader title="Finance & Approval Dashboard" subtitle="Consolidated finance across authorised branches"
        actions={<><DateRange /><BranchSelect value={branch} onChange={setBranch} /></>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Income" value={fmt(inc)} icon={TrendingUp} tone="green" trend="+14%" hint="vs previous period" />
        <StatCard label="Expenses" value={fmt(exp)} icon={TrendingDown} tone="red" trend="+9%" hint="vs previous period" />
        <StatCard label="Net Profit" value={fmt(inc - exp)} icon={Wallet} tone="teal" trend="+22%" />
      </div>

      <Card title="Financial Performance Chart" subtitle="Monthly income vs expenses" className="mt-5">
        <IncomeExpense data={TREND} type="bar" h={280} />
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card title="Receivables" subtitle="Customer balances outstanding">
          {AGING([['0–30 days', 142000, 'bg-emerald-500'], ['31–60 days', 78000, 'bg-amber-500'], ['61–90 days', 31000, 'bg-orange-500'], ['90+ days', 17000, 'bg-rose-500']])}
        </Card>
        <Card title="Payables" subtitle="Supplier bills outstanding">
          {AGING([['Due this week', 96000, 'bg-rose-500'], ['Due this month', 138000, 'bg-amber-500'], ['Next month', 64000, 'bg-blue-500'], ['Later', 24000, 'bg-slate-400']])}
        </Card>
      </div>

      <Card title="Pending Approval Requests" subtitle="You cannot approve requests you submitted yourself" className="mt-5" bodyClass="pb-2">
        <DataTable
          columns={[
            { key: 'branch', label: 'Branch' },
            { key: 'category', label: 'Expense', render: (v, r) => <div><div className="font-semibold text-slate-800">{v}</div><div className="text-xs text-slate-400">{r.id}</div></div> },
            { key: 'amount', label: 'Amount', align: 'end', render: fmt },
            { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
          ]}
          rows={rows}
          actions={(r) => (
            <>
              <button className="btn-light btn-sm" onClick={() => nav(`/expense/${r.id}`)}>{t('View')}</button>
              <button className="btn-success btn-sm" onClick={() => act(r, 'Approved')}>{t('Approve')}</button>
              <button className="btn-danger btn-sm" onClick={() => act(r, 'Rejected')}>{t('Reject')}</button>
              <button className="btn-warn btn-sm" onClick={() => act(r, 'Returned')}>{t('Return')}</button>
            </>
          )}
        />
      </Card>

      <Card title="Recent Journal Entries" className="mt-5" bodyClass="pb-2">
        <DataTable compact columns={[
          { key: 'ref', label: 'Ref', strong: true }, { key: 'date', label: 'Date' }, { key: 'narration', label: 'Narration' },
          { key: 'debit', label: 'Debit A/c' }, { key: 'credit', label: 'Credit A/c' }, { key: 'amount', label: 'Amount', align: 'end', render: fmt },
          { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
        ]} rows={JOURNALS.slice(0, 6)} />
      </Card>
    </>
  )
}
