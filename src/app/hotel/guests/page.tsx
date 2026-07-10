import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function HotelGuestsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: guests } = await supabase.from("guests").select("*").eq("hotel_id", hotel.id).order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Guests</h1><p className="text-sm text-muted mt-1">Guest directory and history</p></div>
        <Button><Plus className="w-4 h-4" /> Add Guest</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Nationality</TableHead><TableHead>Visits</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(guests || []).map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell>{g.email || "—"}</TableCell>
                <TableCell>{g.phone || "—"}</TableCell>
                <TableCell>{g.nationality || "—"}</TableCell>
                <TableCell>{g.total_visits}</TableCell>
                <TableCell><Button variant="secondary" size="sm">View</Button></TableCell>
              </TableRow>
            ))}
            {(!guests || guests.length === 0) && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted">No guests yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
