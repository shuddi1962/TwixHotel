import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function HotelRoomsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: rooms } = await supabase.from("rooms").select("*").eq("hotel_id", hotel.id).order("room_number")

  const statusVariant = (s: string) => {
    const map: Record<string, "success" | "danger" | "warning" | "info"> = {
      available: "success", occupied: "danger", maintenance: "warning", cleaning: "info",
    }
    return map[s] || "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Rooms</h1>
          <p className="text-sm text-muted mt-1">Manage your hotel rooms and pricing</p>
        </div>
        <Button><Plus className="w-4 h-4" /> Add Room</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Room #</TableHead><TableHead>Type</TableHead><TableHead>Floor</TableHead><TableHead>Capacity</TableHead><TableHead>Price/Night</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(rooms || []).map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.room_number}</TableCell>
                <TableCell>{room.room_type}</TableCell>
                <TableCell className="text-muted">{room.floor || "—"}</TableCell>
                <TableCell>{room.capacity} guests</TableCell>
                <TableCell className="font-medium">${Number(room.price_per_night).toFixed(2)}</TableCell>
                <TableCell><Badge variant={statusVariant(room.status)}>{room.status}</Badge></TableCell>
                <TableCell><Button variant="secondary" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
            {(!rooms || rooms.length === 0) && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted">No rooms added yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
