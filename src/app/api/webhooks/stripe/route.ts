import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createAdminClient()

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const invoiceId = session.metadata?.invoice_id
    const userId = session.metadata?.user_id

    if (invoiceId && userId) {
      await supabase.from("deposits").insert({
        user_id: userId,
        invoice_id: invoiceId,
        method_code: 103,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        method_currency: session.currency?.toUpperCase(),
        charge: 0,
        rate: 1,
        final_amount: session.amount_total ? session.amount_total / 100 : 0,
        trx: session.id,
        status: 1,
      })

      await supabase.from("invoices").update({ status: 1 }).eq("id", invoiceId)
    }
  }

  return NextResponse.json({ received: true })
}
