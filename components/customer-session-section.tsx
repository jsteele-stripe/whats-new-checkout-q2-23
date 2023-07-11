'use client'

import * as React from 'react'
import Script from 'next/script'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCustomerSession } from '../app/actions'

const schema = z.object({
  customer: z.string()
})

export type CustomerSessionInputs = z.infer<typeof schema>

export default function CustomerSessionSection(): JSX.Element {
  const [clientSecret, setClientSecret] = React.useState<string | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<CustomerSessionInputs>({
    defaultValues: { customer: 'cus_OFAz1XS0ChACvS' },
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: CustomerSessionInputs): Promise<void> => {
    const { clientSecret } = await createCustomerSession(data)

    setClientSecret(clientSecret)
  }

  const snippet = `const customerSession: Stripe.Customer.Session = await stripe.customer.sessions.create({
  customer: 'cus_xyz'
})

// POST /v1/customer_sessions
{
  object: 'customer_session',
  client_secret: '_OFBDyQbvhM44eIE4vCHC83n9UylSuyS0q6Db3N5FzhW3coP',
  customer: 'cus_xyz',
  expires_at: 1689083172,
  livemode: false
}

<stripe-pricing-table
  pricing-table-id="prctbl_xyz"
  publishable-key="pk_test_xyz"
  customer-session-client-secret="_OFBDyQbvhM44eIE4vCHC83n9UylSuyS0q6Db3N5FzhW3coP"
/>

`

  return (
    <React.Fragment>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
      <div className="py-8">
        <h1 className="text-2xl font-bold">
          Pricing table customer passthrough
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Example API call to create a Customer Session, and pass the returned{' '}
          <code className="text-emerald-600">client_secret</code> to the pricing
          table component.
        </p>
        <div className="space-y-8">
          <SyntaxHighlighter language="typescript" style={oneDark}>
            {snippet}
          </SyntaxHighlighter>
          {clientSecret ? (
            <stripe-pricing-table
              pricing-table-id="prctbl_1NSglBDT2lVfMx2D3xCPdXV5"
              publishable-key={
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
              }
              customer-session-client-secret={clientSecret}
            />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="sm:max-w-md space-y-8"
            >
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Customer Session
              </button>
            </form>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
