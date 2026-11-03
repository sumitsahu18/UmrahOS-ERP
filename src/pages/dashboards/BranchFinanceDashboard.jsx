import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, AlertCircle, Banknote, Receipt, Check } from 'lucide-react'
import { Card, StatCard, PageHeader, DataTable, Badge } from '../../components/ui'
import { IncomeExpense } from '../../components/charts'
import { DAILY, INCOME, EXPENSES, fmt } from '../../data/mock'

const tx = [
  ...INCOME.slice(0, 4).map((i) => ({ date: i.date, type: 'Income', ref: i.receipt, amount: i.amount })),
  ...EXPENSES.slice(0, 4).map((e) => ({ date: e.date, type: 'Expense', ref: e.id, amount: -e.amount })),
].sort((a, b) => parseInt(b.date) - parseInt(a.date))

const STAGES = ['Draft', 'Pending', 'Approved / Rejected']

export default function BranchFinanceDashboard() {
  const nav = useNavigate()
  const count = (s) => EXPENSES.filter((e) => e.status === s).length
  return (
    <>
      <PageHeader title="Branch Finance Dashboard" subtitle="Chattogram Branch · daily finance" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Income" value={fmt(18450)} icon={TrendingUp} tone="green" hint="today" />
        <StatCard label="Expenses" value={fmt(7320)} icon={TrendingDown} tone="red" hint="today" />
        <StatCard label="Outstanding" value={fmt(64800)} icon={AlertCircle} tone="amber" hint="customer balances" />
      </div>

      <Card title="Income / Expense Trend" subtitle="Last 14 days" className="mt-5"><IncomeExpense data={DAILY} x="day" h={270} /></Card>

      <Card title="Recent Transactions" className="mt-5" bodyClass="pb-2">
        <DataTable columns={[
          { key: 'date', label: 'Date' },
          { key: 'type', label: 'Type', render: (v) => <Badge tone={v === 'Income' ? 'green' : 'red'}>{v}</Badge> },
          { key: 'ref', label: 'Reference', strong: true },
          { key: 'amount', label: 'Amount', align: 'end', render: (v) => <span className={v < 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>{v < 0 ? '−' : '+'}{fmt(Math.abs(v))}</span> },
        ]} rows={tx} />
      </Card>

      <Card title="Expense Approval Tracker" subtitle="Draft → Pending → Approved / Rejected" className="mt-5">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          {STAGES.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-3">
              <div className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 ${i === 2 ? 'border-emerald-200 bg-emerald-50' : i === 1 ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-full text-white ${i === 2 ? 'bg-emerald-600' : i === 1 ? 'bg-amber-500' : 'bg-slate-400'}`}>{i === 2 ? <Check size={18} /> : i + 1}</span>
                <div>
                  <div className="text-sm font-bold text-slate-800">{s}</div>
                  <div className="text-xs text-slate-500">{i === 0 ? `${count('Draft')} requests` : i === 1 ? `${count('Pending')} requests` : `${count('Approved')} approved · ${count('Rejected')} rejected`}</div>
                </div>
              </div>
              {i < 2 && <span className="hidden text-slate-300 md:block rtl:rotate-180">➜</span>}
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => nav('/m/income-management/record-income')}><Banknote size={16} />Record Income</button>
        <button className="btn-light" onClick={() => nav('/m/expense-management/create-expense-request')}><Receipt size={16} />Submit Expense</button>
      </div>
    </>
  )
}
