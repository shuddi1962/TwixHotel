import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminDepositsPage() {
  const supabase = await createAdminClient()
  const { data: deposits } = await supabase
    .from("deposits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Deposits</h1>
        <p className="text-sm text-muted mt-1">Track all payment transactions</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TRX</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Charge</TableHead>
                <TableHead>Final</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(deposits || []).map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.trx || "—"}</TableCell>
                  <TableCell className="text-xs">{d.user_id.slice(0, 8)}...</TableCell>
                  <TableCell>${Number(d.amount).toFixed(2)}</TableCell>
                  <TableCell>${Number(d.charge).toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${Number(d.final_amount).toFixed(2)}</TableCell>
                  <TableCell className="text-muted">{d.method_currency || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={d.status === 1 ? "success" : d.status === 2 ? "warning" : "danger"}>
                      {d.status === 1 ? "Approved" : d.status === 2 ? "Pending" : "Rejected"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                  <TableCell><a href={`/admin/deposits/${d.id}`} className="text-primary text-sm hover:underline">View</a></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
