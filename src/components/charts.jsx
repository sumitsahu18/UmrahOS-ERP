import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area, BarChart,
} from 'recharts'

const grid = <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
const axis = { tick: { fontSize: 12, fill: '#64748b' }, axisLine: false, tickLine: false }
const tip = { contentStyle: { borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 } }
const k = (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)

export function BookingsTrend({ data, h = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        {grid}
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="bookings" name="Bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={26} />
        <Line dataKey="passengers" name="Passengers" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function IncomeExpense({ data, x = 'month', h = 260, type = 'area' }) {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -4, bottom: 0 }}>
          {grid}
          <XAxis dataKey={x} {...axis} />
          <YAxis {...axis} tickFormatter={k} />
          <Tooltip {...tip} formatter={(v) => `SAR ${v.toLocaleString()}`} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="income" name="Income" fill="#16a34a" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} /><stop offset="100%" stopColor="#16a34a" stopOpacity={0} /></linearGradient>
          <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.25} /><stop offset="100%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
        </defs>
        {grid}
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} tickFormatter={k} />
        <Tooltip {...tip} formatter={(v) => `SAR ${v.toLocaleString()}`} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area dataKey="income" name="Income" stroke="#16a34a" strokeWidth={2.5} fill="url(#gi)" />
        <Area dataKey="expenses" name="Expenses" stroke="#f97316" strokeWidth={2.5} fill="url(#ge)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function Donut({ data, center, sub = 'Total', h = 190 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-full max-w-[190px] shrink-0" style={{ height: h }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="64%" outerRadius="92%" paddingAngle={2} stroke="none">
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip {...tip} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div><div className="text-2xl font-extrabold text-slate-900">{center ?? total}</div><div className="text-xs text-slate-500">{sub}</div></div>
        </div>
      </div>
      <ul className="w-full flex-1 space-y-2.5">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 whitespace-nowrap text-slate-600"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />{d.name}</span>
            <span className="whitespace-nowrap font-semibold text-slate-800 tabular-nums">{d.value} <span className="text-slate-400 font-normal">({Math.round((d.value / total) * 100)}%)</span></span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SimpleBars({ data, x, bars, h = 260, horizontal, money }) {
  const colors = ['#6d5dfc', '#3b82f6', '#16a34a', '#f59e0b', '#ef4444']
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 10, right: 16, left: horizontal ? 40 : -4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" horizontal={!horizontal} vertical={!!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" {...axis} tickFormatter={k} />
            <YAxis type="category" dataKey={x} {...axis} width={110} />
          </>
        ) : (
          <>
            <XAxis dataKey={x} {...axis} />
            <YAxis {...axis} tickFormatter={k} />
          </>
        )}
        <Tooltip {...tip} formatter={(v) => (money ? `SAR ${v.toLocaleString()}` : v)} />
        {bars.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((b, i) => (
          <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color || colors[i]} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} barSize={horizontal ? 14 : 22} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
