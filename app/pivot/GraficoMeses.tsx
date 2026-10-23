'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Punto = { mes: string; total: number; futuro: boolean; actual: boolean }

const fmtCorto = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)

export default function GraficoMeses({ datos }: { datos: Punto[] }) {
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#8a8a99' }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fontSize: 12, fill: '#8a8a99' }}
            tickFormatter={fmtCorto}
          />
          <Tooltip
            formatter={(v) => '$' + Number(v).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            cursor={{ fill: 'rgba(78,121,167,0.08)' }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {datos.map((d) => (
              <Cell key={d.mes} fill={d.futuro ? '#cfd8dc' : d.actual ? '#4E79A7' : '#8FD19E'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}