import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data: user } = await supabase.from("users").select("*").eq("id", id).single()
  if (!user) notFound()

  const { data: hotel } = await supabase.from("hotels").select("*").eq("user_id", id).single()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">{user.firstname || user.email}</h1><p className="text-sm text-muted mt-1">User details and management</p></div>
        <div className="flex gap-3">
          <Button variant="danger">Suspend</Button>
          <Button>Edit User</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><span className="text-sm text-muted">Email:</span><p className="font-medium">{user.email}</p></div>
            <div><span className="text-sm text-muted">Role:</span><p className="font-medium"><Badge>{user.role}</Badge></p></div>
            <div><span className="text-sm text-muted">Status:</span><p className="font-medium"><Badge variant={user.status === 1 ? "success" : "danger"}>{user.status === 1 ? "Active" : "Banned"}</Badge></p></div>
            <div><span className="text-sm text-muted">Joined:</span><p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p></div>
            <div><span className="text-sm text-muted">Email Verified:</span><p className="font-medium"><Badge variant={user.ev === 1 ? "success" : "warning"}>{user.ev === 1 ? "Yes" : "No"}</Badge></p></div>
          </CardContent>
        </Card>
        {hotel && (
          <Card>
            <CardHeader><CardTitle>Hotel</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><span className="text-sm text-muted">Name:</span><p className="font-medium">{hotel.name}</p></div>
              <div><span className="text-sm text-muted">Email:</span><p className="font-medium">{hotel.email || "—"}</p></div>
              <div><span className="text-sm text-muted">Currency:</span><p className="font-medium">{hotel.currency} {hotel.currency_symbol}</p></div>
              <div><span className="text-sm text-muted">Check-in/out:</span><p className="font-medium">{hotel.check_in_time} / {hotel.check_out_time}</p></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
