import type { Stripe } from 'stripe'

import { NextResponse } from 'next/server'

import stripe from '@/lib/stripe'

export const config = {
  api: {
    bodyParser: false
  }
}

export async function POST(req: Request) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOOK_SIGNING_SECRET as string
    )
  } catch (error) {
    console.log(error)

    const { message, statusCode: status = 400 } =
      error as Stripe.errors.StripeError

    return NextResponse.json({ message }, { status })
  }

  const permittedEvents: string[] = ['checkout.session.completed']

  if (req.method === 'POST') {
    if (permittedEvents.includes(event.type)) {
      try {
        switch (event.type) {
          case 'checkout.session.completed':
            console.log(event.data.object)
            break
          default:
            throw new Error(`Unhhandled event: ${event.type}`)
        }
      } catch (error) {
        console.log(error)
        return NextResponse.json(
          { message: 'Webhook handler failed' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ message: 'Received' }, { status: 200 })
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
  }
}
