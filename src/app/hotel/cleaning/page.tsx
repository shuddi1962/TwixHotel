import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function CleaningPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: tasks } = await supabase.from("cleaning_tasks").select("*, rooms(room_number)").eq("hotel_id", hotel.id).order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Cleaning Tasks</h1><p className="text-sm text-muted mt-1">Room cleaning management</p></div>
        <Button><Plus className="w-4 h-4" /> New Task</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Room</TableHead><TableHead>Assigned To</TableHead><TableHead>Status</TableHead><TableHead>Scheduled</TableHead><TableHead>Completed</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(tasks || []).map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.rooms?.room_number || "—"}</TableCell>
                <TableCell>{t.assigned_to || "—"}</TableCell>
                <TableCell><Badge variant={t.status === "completed" ? "success" : t.status === "in_progress" ? "warning" : "secondary"}>{t.status}</Badge></TableCell>
                <TableCell className="text-xs">{t.scheduled_at ? new Date(t.scheduled_at).toLocaleString() : "—"}</TableCell>
                <TableCell className="text-xs">{t.completed_at ? new Date(t.completed_at).toLocaleString() : "—"}</TableCell>
                <TableCell><Button variant="secondary" size="sm">Update</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
