"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"

const COLORS = ["#8b481c", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1"]

interface SalesChartsProps {
  topItems: [string, { qty: number; rev: number }][]
  outletData: { name: string; revenue: number }[]
  categoryData: { name: string; revenue: number }[]
  staffData: { name: string; revenue: number; count: number }[]
  currency: string
}

export function SalesCharts({ topItems, outletData, categoryData, staffData, currency }: SalesChartsProps) {
  const topItemsData = topItems.map(([name, data]) => ({ name, revenue: data.rev, quantity: data.qty }))
  const staffChartData = staffData.map((s) => ({ name: s.name.slice(0, 8) + "...", revenue: s.revenue }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Selling Items */}
      <Card>
        <CardHeader><CardTitle>Top Selling Items</CardTitle></CardHeader>
        <CardContent>
          {topItemsData.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No data</p>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItemsData} layout="vertical" margin={{ left: 80, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${currency}${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
                  <Tooltip formatter={(value: number) => [`${currency}${value.toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#8b481c" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales by Outlet */}
      <Card>
        <CardHeader><CardTitle>Sales by Outlet</CardTitle></CardHeader>
        <CardContent>
          {outletData.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No data</p>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outletData}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {outletData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${currency}${value.toFixed(2)}`, "Revenue"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales by Staff */}
      <Card>
        <CardHeader><CardTitle>Sales by Staff</CardTitle></CardHeader>
        <CardContent>
          {staffChartData.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No data</p>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffChartData} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${currency}${v}`} />
                  <Tooltip formatter={(value: number) => [`${currency}${value.toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales by Category */}
      <Card>
        <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No data</p>
          ) : (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${currency}${v}`} />
                  <Tooltip formatter={(value: number) => [`${currency}${value.toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
