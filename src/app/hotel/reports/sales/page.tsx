import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { SalesCharts } from "./sales-charts"
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react"

export default async function SalesReportsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id, currency_symbol").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const sym = hotel.currency_symbol || "$"

  const { data: items } = await supabase
    .from("pos_transaction_items")
    .select("*, shops!inner(name)")
    .eq("hotel_id", hotel.id)

  const totalRevenue = (items || []).reduce((s, i) => s + Number(i.total), 0)
  const totalItems = (items || []).reduce((s, i) => s + Number(i.quantity), 0)

  const byOutlet: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  const byItem: Record<string, { qty: number; rev: number }> = {}
  const byStaff: Record<string, { count: number; rev: number }> = {}

  for (const i of items || []) {
    const outlet = (i as { shops?: { name: string } | null }).shops?.name || "Unknown"
    byOutlet[outlet] = (byOutlet[outlet] || 0) + Number(i.total)

    const cat = i.category || "Other"
    byCategory[cat] = (byCategory[cat] || 0) + Number(i.total)

    if (!byItem[i.item_name]) byItem[i.item_name] = { qty: 0, rev: 0 }
    byItem[i.item_name].qty += Number(i.quantity)
    byItem[i.item_name].rev += Number(i.total)

    if (i.sold_by) {
      if (!byStaff[i.sold_by]) byStaff[i.sold_by] = { count: 0, rev: 0 }
      byStaff[i.sold_by].count += Number(i.quantity)
      byStaff[i.sold_by].rev += Number(i.total)
    }
  }

  const topItems = Object.entries(byItem)
    .sort((a, b) => b[1].rev - a[1].rev)
    .slice(0, 10)

  const outletData = Object.entries(byOutlet).map(([name, revenue]) => ({ name, revenue }))
  const staffData = Object.entries(byStaff).map(([name, data]) => ({ name, revenue: data.rev, count: data.count }))
  const chartData = Object.entries(byCategory).map(([name, revenue]) => ({ name, revenue }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Sales Reports</h1>
        <p className="text-sm text-muted mt-1">Detailed breakdown of all POS sales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`${sym}${totalRevenue.toFixed(2)}`} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Items Sold" value={totalItems} icon={<ShoppingCart className="w-5 h-5" />} />
        <StatCard title="Avg per Item" value={`${sym}${totalItems > 0 ? (totalRevenue / totalItems).toFixed(2) : "0.00"}`} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Outlets" value={Object.keys(byOutlet).length} icon={<Users className="w-5 h-5" />} />
      </div>

      <SalesCharts
        topItems={topItems}
        outletData={outletData}
        categoryData={chartData}
        staffData={staffData}
        currency={sym}
      />

      <Card>
        <CardHeader><CardTitle>All Transactions</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted">Item</th>
                  <th className="text-left py-2 px-3 font-medium text-muted">Outlet</th>
                  <th className="text-left py-2 px-3 font-medium text-muted">Qty</th>
                  <th className="text-right py-2 px-3 font-medium text-muted">Price</th>
                  <th className="text-right py-2 px-3 font-medium text-muted">Total</th>
                  <th className="text-right py-2 px-3 font-medium text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).slice(0, 50).map((i) => (
                  <tr key={i.id} className="border-b border-border/50 hover:bg-gray-50">
                    <td className="py-2 px-3">{i.item_name}</td>
                    <td className="py-2 px-3 text-muted">{(i as { shops?: { name: string } | null }).shops?.name || "—"}</td>
                    <td className="py-2 px-3">{Number(i.quantity)}</td>
                    <td className="py-2 px-3 text-right">{sym}{Number(i.unit_price).toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-medium">{sym}{Number(i.total).toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-muted text-xs">
                      {new Date(i.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!items || items.length === 0) && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted">No sales data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
