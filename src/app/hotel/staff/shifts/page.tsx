import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Plus, Users } from "lucide-react"
import { ClockInOut } from "./clock-in-out"

export default async function StaffShiftsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: staff } = await supabase
    .from("hotel_staff")
    .select("id, name, role, status")
    .eq("hotel_id", hotel.id)
    .eq("status", 1)

  const { data: activeShiftRows } = await supabase
    .from("staff_attendance")
    .select("*, hotel_staff!inner(name, role)")
    .eq("hotel_id", hotel.id)
    .is("clock_out", null)
    .order("clock_in", { ascending: false })

  const { data: upcomingShiftRows } = await supabase
    .from("staff_shifts")
    .select("*, hotel_staff(name, role)")
    .eq("hotel_id", hotel.id)
    .gte("shift_date", new Date().toISOString().split("T")[0])
    .order("shift_date")
    .limit(20)

  const activeShifts = activeShiftRows as unknown as { id: string; clock_in: string; hotel_staff: { name: string; role: string } | null }[]
  const upcoming = upcomingShiftRows as unknown as { id: string; shift_date: string; start_time: string; end_time: string; hotel_staff: { name: string; role: string } | null }[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Staff Shifts & Attendance</h1>
          <p className="text-sm text-muted mt-1">Manage schedules and track attendance</p>
        </div>
        <ClockInOut hotelId={hotel.id} />
      </div>

      {/* Currently clocked in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Currently Clocked In ({activeShifts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeShifts && activeShifts.length > 0 ? (
            <div className="space-y-2">
              {activeShifts.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{a.hotel_staff?.name || "Unknown"}</p>
                    <p className="text-xs text-muted">{a.hotel_staff?.role}</p>
                  </div>
                  <div className="text-right text-xs text-muted">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Since {new Date(a.clock_in).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-4">No one currently clocked in</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Shifts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.hotel_staff?.name || "Unknown"}</TableCell>
                    <TableCell><Badge variant="info">{s.hotel_staff?.role || "—"}</Badge></TableCell>
                    <TableCell>{new Date(s.shift_date).toLocaleDateString()}</TableCell>
                    <TableCell>{s.start_time?.slice(0, 5)} — {s.end_time?.slice(0, 5)}</TableCell>
                  </TableRow>
                ))}
                {(!upcoming || upcoming.length === 0) && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted">No upcoming shifts</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Staff
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(staff || []).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><Badge variant="info">{s.role}</Badge></TableCell>
                    <TableCell><Badge variant={s.status === 1 ? "success" : "danger"}>{s.status === 1 ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell>
                      <Button variant="secondary" size="sm">Add Shift</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!staff || staff.length === 0) && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted">No staff added yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
