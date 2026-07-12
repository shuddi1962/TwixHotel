import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
    stripeInstance = new Stripe(key, { typescript: true })
  }
  return stripeInstance
}

export async function createCheckoutSession(params: {
  amount: number
  currency: string
  invoiceId: string
  userId: string
  customerEmail: string
}) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          unit_amount: Math.round(params.amount * 100),
          product_data: {
            name: `Invoice #${params.invoiceId}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      invoice_id: params.invoiceId,
      user_id: params.userId,
    },
    customer_email: params.customerEmail,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/hotel/invoices?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/hotel/invoices?canceled=true`,
  })

  return session
}
