import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Filter } from "lucide-react"

export default async function ActivityPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("hotel_id", hotel.id)
    .order("created_at", { ascending: false })
    .limit(100)

  const actionColors: Record<string, string> = {
    Sale: "text-green-600 bg-green-50",
    Booking: "text-blue-600 bg-blue-50",
    CheckIn: "text-purple-600 bg-purple-50",
    CheckOut: "text-orange-600 bg-orange-50",
    Cancellation: "text-red-600 bg-red-50",
    Payment: "text-emerald-600 bg-emerald-50",
    Staff: "text-indigo-600 bg-indigo-50",
    Settings: "text-gray-600 bg-gray-50",
    Inventory: "text-amber-600 bg-amber-50",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Activity Log</h1>
        <p className="text-sm text-muted mt-1">Full audit trail of all hotel operations</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {(activities || []).map((a) => (
              <div key={a.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    actionColors[a.action] || "text-gray-600 bg-gray-100"
                  }`}
                >
                  {a.action.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark">{a.description || a.action}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(a.created_at).toLocaleString()}
                    {a.user_id && " · User: " + a.user_id.slice(0, 8) + "..."}
                  </p>
                </div>
              </div>
            ))}
            {(!activities || activities.length === 0) && (
              <div className="text-center py-12 text-muted">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity recorded yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
