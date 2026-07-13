import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { hotel_id, shop_id, payment_method, items, sold_by, order_type, table_room_id } = await request.json()

    if (!hotel_id || !shop_id || !payment_method || !items?.length || !sold_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    const { data, error } = await supabase.rpc("process_pos_sale", {
      p_hotel_id: hotel_id,
      p_shop_id: shop_id,
      p_payment_method: payment_method,
      p_items: JSON.stringify(items),
      p_sold_by: sold_by,
      p_order_type: order_type || null,
      p_table_room_id: table_room_id || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transaction_id: data })
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
