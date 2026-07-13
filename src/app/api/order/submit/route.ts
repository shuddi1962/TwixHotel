import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { hotel_id, shop_id, items, guest_name, order_type, table_room_id } = await request.json()

    if (!hotel_id || !items?.length || !guest_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Find the first available shop (or the one specified)
    let targetShop = shop_id
    if (!targetShop) {
      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("hotel_id", hotel_id)
        .eq("status", 1)
        .limit(1)
        .single()

      if (!shop) {
        return NextResponse.json({ error: "No open shops found" }, { status: 400 })
      }
      targetShop = shop.id
    }

    const { data, error } = await supabase.rpc("process_pos_sale", {
      p_hotel_id: hotel_id,
      p_shop_id: targetShop,
      p_payment_method: "room_charge",
      p_items: JSON.stringify(items),
      p_sold_by: null,
      p_order_type: order_type || "room_service",
      p_table_room_id: table_room_id || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transaction_id: data })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
