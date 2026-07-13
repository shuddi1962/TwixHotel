import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function ShopsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: shops } = await supabase.from("shops").select("*").eq("hotel_id", hotel.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Shops</h1><p className="text-sm text-muted mt-1">Manage hotel shops and POS</p></div>
        <Button><Plus className="w-4 h-4" /> Add Shop</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(shops || []).map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell className="text-muted max-w-xs truncate">{shop.description || "—"}</TableCell>
                <TableCell><Badge variant={shop.status === 1 ? "success" : "danger"}>{shop.status === 1 ? "Open" : "Closed"}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="secondary" size="sm">Manage</Button>
                    <Link href={`/hotel/shops/${shop.id}/pos`}>
                      <Button size="sm">POS</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
