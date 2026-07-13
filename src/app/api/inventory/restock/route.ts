import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { hotel_id, item_id, quantity, created_by } = await request.json()

    if (!hotel_id || !item_id || !quantity || !created_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    const { error: movementError } = await supabase.from("stock_movements").insert({
      hotel_id,
      item_id,
      type: "restock",
      quantity: Math.abs(quantity),
      reference_type: "manual",
      created_by,
    })

    if (movementError) {
      return NextResponse.json({ error: movementError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
