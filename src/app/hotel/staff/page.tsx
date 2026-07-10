import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function HotelStaffPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: staff } = await supabase.from("hotel_staff").select("*").eq("hotel_id", hotel.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Staff</h1><p className="text-sm text-muted mt-1">Manage your hotel team</p></div>
        <Button><Plus className="w-4 h-4" /> Add Staff</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(staff || []).map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone || "—"}</TableCell>
                <TableCell><Badge variant="info">{s.role}</Badge></TableCell>
                <TableCell><Badge variant={s.status === 1 ? "success" : "danger"}>{s.status === 1 ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell><Button variant="secondary" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
            {(!staff || staff.length === 0) && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted">No staff added yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
