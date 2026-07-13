import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { KDSBoard } from "@/components/hotel/kds-board"

export default async function KDSPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Kitchen Display System</h1>
          <p className="text-sm text-muted mt-1">Real-time order board</p>
        </div>
        <Badge variant="info" className="text-sm px-3 py-1">
          <Clock className="w-4 h-4 mr-1" /> Live
        </Badge>
      </div>
      <KDSBoard hotelId={hotel.id} />
    </div>
  )
}
