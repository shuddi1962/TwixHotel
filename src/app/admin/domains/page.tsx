import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminDomainsPage() {
  const supabase = await createAdminClient()
  const { data: domains } = await supabase.from("domains").select("*, users(email)").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Domains</h1><p className="text-sm text-muted mt-1">Manage custom domains and DNS</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Domain</TableHead><TableHead>User</TableHead><TableHead>Status</TableHead><TableHead>Expiry</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(domains || []).map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.domain}</TableCell>
                <TableCell className="text-sm">{d.users?.email || d.user_id.slice(0, 8)}</TableCell>
                <TableCell><Badge variant={d.status === 1 ? "success" : d.status === 0 ? "warning" : "danger"}>{["Pending", "Active", "Expired"][d.status] || "Unknown"}</Badge></TableCell>
                <TableCell className="text-xs">{d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : "—"}</TableCell>
                <TableCell><Button variant="secondary" size="sm">Manage</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
