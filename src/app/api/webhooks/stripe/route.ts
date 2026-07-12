import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  let stripe
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
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
