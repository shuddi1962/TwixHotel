import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function HotelBookingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: bookings } = await supabase
    .from("bookings").select("*").eq("hotel_id", hotel.id)
    .order("created_at", { ascending: false })

  const statusVariant = (s: string) => {
    const map: Record<string, "success" | "danger" | "warning" | "info" | "secondary"> = {
      pending: "warning", confirmed: "info", checked_in: "success", checked_out: "secondary", cancelled: "danger",
    }
    return map[s] || "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Bookings</h1>
          <p className="text-sm text-muted mt-1">Manage reservations and check-ins</p>
        </div>
        <Button><Plus className="w-4 h-4" /> New Booking</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Guest</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead>Guests</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(bookings || []).map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.guest_name}</TableCell>
                <TableCell>{new Date(b.check_in).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(b.check_out).toLocaleDateString()}</TableCell>
                <TableCell>{b.adults + (b.children || 0)}</TableCell>
                <TableCell className="font-medium">${Number(b.total_amount).toFixed(2)}</TableCell>
                <TableCell><Badge variant={statusVariant(b.status)}>{b.status}</Badge></TableCell>
                <TableCell><Badge variant={b.payment_status === "paid" ? "success" : b.payment_status === "partial" ? "warning" : "danger"}>{b.payment_status}</Badge></TableCell>
                <TableCell><Button variant="secondary" size="sm">View</Button></TableCell>
              </TableRow>
            ))}
            {(!bookings || bookings.length === 0) && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted">No bookings yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
