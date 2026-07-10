import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminInvoicesPage() {
  const supabase = await createAdminClient()
  const { data: invoices } = await supabase.from("invoices").select("*, users(email)").order("created_at", { ascending: false }).limit(50)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Invoices</h1><p className="text-sm text-muted mt-1">All system invoices</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Invoice #</TableHead><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Due Date</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(invoices || []).map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs">{inv.invoice_number || inv.id.slice(0, 8)}</TableCell>
                <TableCell className="text-sm">{inv.users?.email || "—"}</TableCell>
                <TableCell className="font-medium">${Number(inv.amount).toFixed(2)}</TableCell>
                <TableCell><Badge variant={inv.status === 1 ? "success" : "danger"}>{inv.status === 1 ? "Paid" : "Unpaid"}</Badge></TableCell>
                <TableCell className="text-xs">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</TableCell>
                <TableCell><Button variant="secondary" size="sm">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
