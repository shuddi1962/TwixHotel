import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Package } from "lucide-react"

export default async function PurchaseOrdersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id, currency_symbol").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const sym = hotel.currency_symbol || "$"

  const { data: orders } = await supabase
    .from("purchase_orders")
    .select("*, inventory_items(name, category, sell_price)")
    .eq("hotel_id", hotel.id)
    .order("created_at", { ascending: false })

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "badge-warning",
      ordered: "badge-info",
      received: "badge-success",
      cancelled: "badge-danger",
    }
    return map[status] || "badge-secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Purchase Orders</h1>
          <p className="text-sm text-muted mt-1">Manage auto-generated and manual purchase orders</p>
        </div>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Est. Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(orders || []).map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">{po.inventory_items?.name || "Unknown"}</TableCell>
                <TableCell><Badge variant="info">{po.inventory_items?.category || "—"}</Badge></TableCell>
                <TableCell>{Number(po.quantity)}</TableCell>
                <TableCell>{sym}{(Number(po.quantity) * Number(po.inventory_items?.sell_price || 0)).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={statusBadge(po.status)}>{po.status}</span>
                </TableCell>
                <TableCell className="text-sm text-muted">
                  {new Date(po.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {po.status === "pending" && (
                    <div className="flex gap-1">
                      <Button variant="success" size="sm">Mark Ordered</Button>
                      <Button variant="danger" size="sm">Cancel</Button>
                    </div>
                  )}
                  {po.status === "ordered" && (
                    <Button variant="success" size="sm">Mark Received</Button>
                  )}
                  {po.status === "received" && (
                    <Badge variant="success">Completed</Badge>
                  )}
                  {po.status === "cancelled" && (
                    <Badge variant="danger">Cancelled</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!orders || orders.length === 0) && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted">No purchase orders yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
