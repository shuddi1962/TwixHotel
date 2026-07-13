import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, ArrowUpDown } from "lucide-react"

export default async function InventoryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id, currency_symbol").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const sym = hotel.currency_symbol || "$"

  const { data: items } = await supabase
    .from("inventory_items")
    .select("*, shops(name)")
    .eq("hotel_id", hotel.id)
    .order("name")

  const lowStock = (items || []).filter((i) => Number(i.current_stock) < Number(i.reorder_level)).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Inventory</h1>
          <p className="text-sm text-muted mt-1">
            {lowStock > 0 ? (
              <span className="text-red-500 font-medium">{lowStock} item{lowStock > 1 ? "s" : ""} below reorder level</span>
            ) : (
              "All items adequately stocked"
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/hotel/inventory/purchase-orders">
            <Button variant="secondary">
              <ArrowUpDown className="w-4 h-4" /> Purchase Orders
            </Button>
          </Link>
          <Button>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Sell Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(items || []).map((item) => {
              const stock = Number(item.current_stock)
              const reorder = Number(item.reorder_level)
              const isLow = stock < reorder
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell><Badge variant="info">{item.category}</Badge></TableCell>
                  <TableCell className="text-muted">{item.shops?.name || "—"}</TableCell>
                  <TableCell>{sym}{Number(item.cost_price).toFixed(2)}</TableCell>
                  <TableCell>{sym}{Number(item.sell_price).toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">{stock}</TableCell>
                  <TableCell>{reorder}</TableCell>
                  <TableCell>
                    <Badge variant={isLow ? "danger" : stock === 0 ? "warning" : "success"}>
                      {stock === 0 ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">Restock</Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {(!items || items.length === 0) && (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted">No inventory items yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
