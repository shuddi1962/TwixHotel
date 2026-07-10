import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function FoodPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: items } = await supabase.from("food_items").select("*, shops(name)").eq("hotel_id", hotel.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Food Menu</h1><p className="text-sm text-muted mt-1">Manage restaurant menu items</p></div>
        <Button><Plus className="w-4 h-4" /> Add Item</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Shop</TableHead><TableHead>Price</TableHead><TableHead>Available</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(items || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category || "—"}</TableCell>
                <TableCell>{item.shops?.name || "—"}</TableCell>
                <TableCell className="font-medium">${Number(item.price).toFixed(2)}</TableCell>
                <TableCell><Badge variant={item.available === 1 ? "success" : "danger"}>{item.available === 1 ? "In Stock" : "Out"}</Badge></TableCell>
                <TableCell><Button variant="secondary" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
