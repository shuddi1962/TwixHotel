import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminServicesPage() {
  const supabase = await createAdminClient()
  const { data: services } = await supabase
    .from("services")
    .select("*, users(email)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Services</h1>
          <p className="text-sm text-muted mt-1">Manage all active hotel services</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(services || []).map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.users?.email?.slice(0, 20) || s.user_id.slice(0, 8)}</TableCell>
                  <TableCell className="font-mono text-xs">{s.subdomain || "—"}</TableCell>
                  <TableCell>{s.is_free_trial ? "Free Trial" : "Paid"}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === 1 ? "success" : s.status === 2 ? "warning" : "danger"}>
                      {s.status === 1 ? "Active" : s.status === 2 ? "Suspended" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{s.expiry_date ? new Date(s.expiry_date).toLocaleDateString() : "—"}</TableCell>
                  <TableCell><Button variant="secondary" size="sm">Manage</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
