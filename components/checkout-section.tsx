'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCheckoutSession } from '../app/actions'

const schema = z.object({ customer: z.string() })

export type CheckoutSessionInputs = z.infer<typeof schema>

export default function CheckoutSection(): JSX.Element {
  const {
    formState: { errors },
    handleSubmit
  } = useForm<CheckoutSessionInputs>({
    defaultValues: { customer: 'cus_OFAz1XS0ChACvS' },
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: CheckoutSessionInputs): Promise<void> => {
    const { url } = await createCheckoutSession({
      cancel_url: window.location.href,
      success_url: window.location.href,
      ...data
    })

    window.location.assign(url as string)
  }

  const snippet = `const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
  cancel_url: 'https://stripe.com?success',
  line_items: [{
    // Zero-amount line item
    price: 'price_xyz'
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://stripe.com?success',
})

// POST /v1/checkout_sessions response
{
  id: 'cs_test_a1B9ulTCaJ0cacHj04HTjRz8w0s5RdSUiiUtf05CAor4N4PNYCvdWqc5m9',
  object: 'checkout.session',
  amount_subtotal: 0,
  amount_total: 0,
  mode: 'payment',
  status: 'open'
}`

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">No-cost orders with Checkout</h1>
      <p className="mt-2 text-lg text-gray-600">
        Example API call to create a zero-amount Checkout Session which can be
        completed without payment.
      </p>
      <div className="space-y-8">
        <SyntaxHighlighter language="typescript" style={oneDark}>
          {snippet}
        </SyntaxHighlighter>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:max-w-md space-y-8"
        >
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Checkout Session
          </button>
        </form>
      </div>
    </div>
  )
}
