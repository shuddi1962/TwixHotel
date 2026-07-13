import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  try {
    const { id, status, user_id } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    if (status === "received") {
      const { data: po } = await supabase
        .from("purchase_orders")
        .select("*, inventory_items(id, current_stock, name)")
        .eq("id", id)
        .single()

      if (!po) {
        return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
      }

      await supabase.from("stock_movements").insert({
        hotel_id: po.hotel_id,
        item_id: po.item_id,
        type: "restock",
        quantity: Number(po.quantity),
        reference_type: "purchase_order",
        reference_id: po.id,
        created_by: user_id,
      })
    }

    const { error } = await supabase
      .from("purchase_orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
