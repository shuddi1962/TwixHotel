"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  data: { month: string; revenue: number }[]
  currency: string
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted">No booking data yet.</p>
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${currency}${v}`} />
          <Tooltip
            formatter={(value: number) => [`${currency}${value.toFixed(2)}`, "Revenue"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
