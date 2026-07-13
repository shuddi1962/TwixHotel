import { createServerSupabaseClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DoorOpen, BookOpen, Users, DollarSign, CalendarDays, TrendingUp, Activity, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { TodaysSalesCard } from "@/components/hotel/todays-sales-card"
import { LiveSalesFeed } from "@/components/hotel/live-sales-feed"

export default async function HotelDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: hotel } = await supabase.from("hotels").select("*").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const today = new Date().toISOString().split("T")[0]
  const [{ count: roomCount }, { count: bookingCount }, { count: guestCount }, { data: recentBookings }] = await Promise.all([
    supabase.from("rooms").select("id", { count: "exact", head: true }).eq("hotel_id", hotel.id),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("hotel_id", hotel.id),
    supabase.from("guests").select("id", { count: "exact", head: true }).eq("hotel_id", hotel.id),
    supabase.from("bookings").select("*").eq("hotel_id", hotel.id).order("created_at", { ascending: false }).limit(5),
  ])

  const { data: todayBookings } = await supabase
    .from("bookings").select("total_amount").eq("hotel_id", hotel.id)
    .gte("check_in", today).lte("check_in", today)

  const todayRevenue = (todayBookings || []).reduce((sum, b) => sum + Number(b.total_amount), 0)

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "badge-warning",
      confirmed: "badge-info",
      checked_in: "badge-success",
      checked_out: "badge-secondary",
      cancelled: "badge-danger",
    }
    return map[status] || "badge-secondary"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">{hotel.name}</h1>
        <p className="text-sm text-muted mt-1">Welcome back! Here&apos;s your hotel overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Rooms" value={roomCount ?? 0} icon={<DoorOpen className="w-5 h-5" />} />
        <StatCard title="Total Bookings" value={bookingCount ?? 0} icon={<BookOpen className="w-5 h-5" />} />
        <StatCard title="Guests" value={guestCount ?? 0} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Today&apos;s Revenue" value={`$${todayRevenue.toFixed(2)}`} icon={<DollarSign className="w-5 h-5" />} />
        <TodaysSalesCard hotelId={hotel.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentBookings || []).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{booking.guest_name}</p>
                    <p className="text-xs text-muted">
                      {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${Number(booking.total_amount).toFixed(2)}</p>
                    <span className={statusBadge(booking.status)}>{booking.status}</span>
                  </div>
                </div>
              ))}
              {(!recentBookings || recentBookings.length === 0) && (
                <p className="text-sm text-muted text-center py-4">No bookings yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Live Sales Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiveSalesFeed hotelId={hotel.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
