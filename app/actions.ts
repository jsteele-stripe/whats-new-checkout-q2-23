'use server'

import type { CheckoutSessionInputs } from '@/components/checkout-section'
import type { CustomerSessionInputs } from '@/components/customer-session-section'

import stripe, { betaStripe } from '@/lib/stripe'

export async function createCheckoutSession(
  data: CheckoutSessionInputs & { cancel_url: string; success_url: string }
): Promise<{ url: string }> {
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_ZERO_AMOUNT_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'payment',
      ...data
    })

    return { url: checkoutSession.url as string }
  } catch (error) {
    throw new Error(error)
  }
}

export async function createCustomerSession(
  data: CustomerSessionInputs
): Promise<{ clientSecret: string }> {
  try {
    const customerSession = await betaStripe.customerSessions.create(data)

    return { clientSecret: customerSession.client_secret as string }
  } catch (error) {
    throw new Error(error)
  }
}
