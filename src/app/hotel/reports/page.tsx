import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { DollarSign, BookOpen, TrendingUp } from "lucide-react"
import { RevenueChart } from "./revenue-chart"

export default async function HotelReportsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id, currency_symbol").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const sym = hotel.currency_symbol || "$"
  const { data: bookings } = await supabase.from("bookings").select("total_amount, status, created_at").eq("hotel_id", hotel.id)
  const totalRevenue = (bookings || []).reduce((sum, b) => sum + Number(b.total_amount), 0)
  const confirmed = (bookings || []).filter((b) => b.status === "confirmed" || b.status === "checked_in").length
  const cancelled = (bookings || []).filter((b) => b.status === "cancelled").length

  const monthlyData = (bookings || []).reduce<Record<string, number>>((acc, b) => {
    const month = new Date(b.created_at).toLocaleString("default", { month: "short", year: "2-digit" })
    acc[month] = (acc[month] || 0) + Number(b.total_amount)
    return acc
  }, {})

  const chartData = Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }))

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Reports</h1><p className="text-sm text-muted mt-1">Analytics and performance metrics</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={`${sym}${totalRevenue.toFixed(2)}`} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Confirmed Bookings" value={confirmed} icon={<BookOpen className="w-5 h-5" />} />
        <StatCard title="Cancelled" value={cancelled} icon={<TrendingUp className="w-5 h-5" />} />
      </div>
      <Card>
        <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
        <CardContent>
          <RevenueChart data={chartData} currency={sym} />
        </CardContent>
      </Card>
    </div>
  )
}
