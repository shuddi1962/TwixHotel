import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminReportsPage() {
  const supabase = await createAdminClient()
  const { data: logins } = await supabase
    .from("user_logins")
    .select("*, users(email)")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Reports</h1>
        <p className="text-sm text-muted mt-1">Login history and system reports</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Login History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(logins || []).map((login) => (
                <TableRow key={login.id}>
                  <TableCell className="font-medium">{login.users?.email || login.user_id.slice(0,8)}</TableCell>
                  <TableCell className="font-mono text-xs">{login.user_ip || "—"}</TableCell>
                  <TableCell className="text-xs">{login.browser || "—"}</TableCell>
                  <TableCell className="text-xs">{login.os || "—"}</TableCell>
                  <TableCell className="text-xs">{login.country || "—"}</TableCell>
                  <TableCell className="text-xs text-muted">{new Date(login.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
