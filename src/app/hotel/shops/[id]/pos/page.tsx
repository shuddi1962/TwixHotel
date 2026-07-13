import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { POSTerminal } from "@/components/hotel/pos-terminal"

export default async function POSPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: shop } = await supabase.from("shops").select("name, status").eq("id", id).eq("hotel_id", hotel.id).single()
  if (!shop) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">POS — {shop.name}</h1>
        <p className="text-sm text-muted mt-1">Select items and complete the sale</p>
      </div>
      <POSTerminal
        hotelId={hotel.id}
        shopId={id}
        userId={user.id}
        shopName={shop.name}
      />
    </div>
  )
}
