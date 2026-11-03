import { Link, useNavigate } from 'react-router-dom'
import { Building2, Users, BookOpen, Clock, TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, StatCard, PageHeader, DataTable, Progress } from '../../components/ui'
import { IncomeExpense, Donut } from '../../components/charts'
import { BRANCHES, TREND, BOOKING_STATUS, EXPENSES, fmt } from '../../data/mock'

export default function ExecutiveDashboard() {
  const { t, notify } = useApp()
  const nav = useNavigate()
  const income = BRANCHES.reduce((s, b) => s + b.income, 0)
  const expense = BRANCHES.reduce((s, b) => s + b.expense, 0)
  const ranked = [...BRANCHES].map((b) => ({ ...b, profit: b.income - b.expense })).sort((a, b) => b.profit - a.profit)
  const maxProfit = ranked[0].profit
  const pending = EXPENSES.filter((e) => e.status === 'Pending')

  return (
    <>
      <PageHeader title="Executive Dashboard" subtitle="Consolidated Head Office View" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Branches" value={BRANCHES.length} icon={Building2} tone="navy" hint="6 active" />
        <StatCard label="Total Passengers" value="1,245" icon={Users} tone="violet" trend="+12%" hint="vs last month" />
        <StatCard label="Active Bookings" value="328" icon={BookOpen} tone="blue" trend="+8%" hint="vs last month" />
        <StatCard label="Pending Approvals" value={pending.length} icon={Clock} tone="amber" hint="expense requests" />
        <StatCard label="Total Income" value={fmt(income)} icon={TrendingUp} tone="green" />
        <StatCard label="Total Expenses" value={fmt(expense)} icon={TrendingDown} tone="red" />
        <StatCard label="Net Profit" value={fmt(income - expense)} icon={Wallet} tone="teal" trend="+5.4%" />
        <StatCard label="Outstanding Payments" value={fmt(268000)} icon={AlertCircle} tone="amber" hint="receivables" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title={t('Revenue vs Expenses') + ' Chart'} subtitle="Income and expenses — last 6 months" className="xl:col-span-2">
          <IncomeExpense data={TREND} h={290} />
        </Card>
        <Card title={t('Booking Status')} subtitle="Confirmed, pending, cancelled and completed">
          <Donut data={BOOKING_STATUS.filter((s) => s.name !== 'In Progress')} sub="Bookings" />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title={t('Branch Performance')} subtitle="Ranked branch comparison and profitability"
          action={<Link to="/m/reports-and-analytics/branch-reports" className="text-sm font-semibold text-brand-600">{t('View all')}</Link>}>
          <ol className="space-y-3.5">
            {ranked.map((b, i) => (
              <li key={b.code} className="flex items-center gap-3">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${i < 3 ? 'bg-gold-400/20 text-gold-600' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2 text-sm"><span className="truncate font-semibold text-slate-800">{b.name}</span><span className="font-semibold tabular-nums text-emerald-600">{fmt(b.profit)}</span></div>
                  <div className="mt-1.5"><Progress value={b.profit} max={maxProfit * 1.01} tone="bg-brand-500" /></div>
                  <div className="mt-1 text-[11px] text-slate-400">{b.bookings} bookings · margin {Math.round(((b.income - b.expense) / b.income) * 100)}%</div>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card title={t('Pending Expense Approvals')} subtitle="Requests appear here based on approval permissions" bodyClass="pb-2"
          action={<Link to="/m/expense-approvals/pending-requests" className="text-sm font-semibold text-brand-600">{t('View all')}</Link>}>
          <DataTable
            columns={[
              { key: 'branch', label: 'Branch' },
              { key: 'id', label: 'Request', render: (v, r) => <div><div className="font-semibold text-slate-800">{v}</div><div className="text-xs text-slate-400">{r.category}</div></div> },
              { key: 'amount', label: 'Amount', align: 'end', render: fmt },
            ]}
            rows={pending}
            actions={(r) => (
              <>
                <button className="btn-light btn-sm" onClick={() => nav(`/expense/${r.id}`)}>{t('View')}</button>
                <button className="btn-success btn-sm" onClick={() => notify(`${r.id} approved`)}>{t('Approve')}</button>
              </>
            )}
          />
        </Card>
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Charts show illustrative demo data.</p>
    </>
  )
}
