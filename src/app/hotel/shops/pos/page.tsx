import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowRight } from "lucide-react"

export default async function POSShopSelector() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, description, status")
    .eq("hotel_id", hotel.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Point of Sale</h1>
        <p className="text-sm text-muted mt-1">Select an outlet to open the POS terminal</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(shops || []).map((shop) => (
          <Card key={shop.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                {shop.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted mb-4">{shop.description || "No description"}</p>
              <div className="flex items-center justify-between">
                <Badge variant={shop.status === 1 ? "success" : "danger"}>
                  {shop.status === 1 ? "Open" : "Closed"}
                </Badge>
                <Link href={`/hotel/shops/${shop.id}/pos`}>
                  <Button size="sm">
                    Open POS <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!shops || shops.length === 0) && (
          <Card>
            <CardContent className="py-8 text-center text-muted">
              No shops created yet. Add a shop first.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
