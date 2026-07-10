import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function HotelInvoicesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: invoices } = await supabase.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Invoices</h1><p className="text-sm text-muted mt-1">Subscription invoices and payment history</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Invoice #</TableHead><TableHead>Amount</TableHead><TableHead>Charge</TableHead><TableHead>Total</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(invoices || []).map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs">{inv.invoice_number || inv.id.slice(0, 8)}</TableCell>
                <TableCell>${Number(inv.amount).toFixed(2)}</TableCell>
                <TableCell>${Number(inv.payment_charge).toFixed(2)}</TableCell>
                <TableCell className="font-medium">${(Number(inv.amount) + Number(inv.payment_charge)).toFixed(2)}</TableCell>
                <TableCell className="text-xs">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</TableCell>
                <TableCell><Badge variant={inv.status === 1 ? "success" : "danger"}>{inv.status === 1 ? "Paid" : "Unpaid"}</Badge></TableCell>
                <TableCell><Button variant="secondary" size="sm">Pay Now</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
