'use server'

import type { CheckoutSessionInputs } from 'components/checkout-section'

import stripe from '@/lib/stripe'
import { PaymentIntentInputs } from 'components/payment-intent-section'

export async function createCheckoutSession(
  data: CheckoutSessionInputs & { cancel_url: string; success_url: string }
): Promise<{ url: string }> {
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_ONE_TIME_PRICE_ID,
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

export async function createPaymentIntent(
  data: PaymentIntentInputs
): Promise<{ clientSecret: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create(data)

    return { clientSecret: paymentIntent.client_secret as string }
  } catch (error) {
    throw new Error(error)
  }
}
