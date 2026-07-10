import { createAdminClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, PiggyBank, TrendingUp, DollarSign, FileText, Activity } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createAdminClient()

  const [userCount, hotelCount, depositSum, recentUsers] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("hotels").select("id", { count: "exact", head: true }),
    supabase.from("deposits").select("amount").eq("status", 1),
    supabase.from("users").select("id, email, firstname, lastname, created_at").order("created_at", { ascending: false }).limit(5),
  ])

  const totalRevenue = (depositSum.data || []).reduce((sum, d) => sum + Number(d.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
        <p className="text-sm text-muted mt-1">Overview of your TwiXHotel platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={userCount.count ?? 0} icon={<Users className="w-5 h-5" />} change={12.5} changeLabel="vs last month" />
        <StatCard title="Total Hotels" value={hotelCount.count ?? 0} icon={<Building2 className="w-5 h-5" />} change={8.2} changeLabel="vs last month" />
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} change={15.3} changeLabel="vs last month" />
        <StatCard title="Active Services" value="--" icon={<Activity className="w-5 h-5" />} change={5.1} changeLabel="vs last month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentUsers.data || []).map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{user.firstname || user.email}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                  <span className="text-xs text-muted">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              ))}
              {(recentUsers.data || []).length === 0 && (
                <p className="text-sm text-muted text-center py-4">No users yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Manage Users", href: "/admin/users", icon: Users },
                { label: "View Plans", href: "/admin/plans", icon: Building2 },
                { label: "Deposits", href: "/admin/deposits", icon: PiggyBank },
                { label: "Settings", href: "/admin/settings", icon: FileText },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <a
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:shadow-sm transition-shadow"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </a>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
