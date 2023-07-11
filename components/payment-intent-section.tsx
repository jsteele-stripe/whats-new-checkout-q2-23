'use client'

import * as React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { createPaymentIntent } from '../app/actions'

const schema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['gbp', 'eur', 'usd'])
})

export type PaymentIntentInputs = z.infer<typeof schema>

export default function PaymentIntentSection(): JSX.Element {
  const [clientSecret, setClientSecret] = React.useState<string | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<PaymentIntentInputs>({
    defaultValues: { amount: 1000, currency: 'usd' },
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: PaymentIntentInputs): Promise<void> => {
    const { clientSecret } = await createPaymentIntent(data)

    setClientSecret(clientSecret)
  }

  const snippet = `<Elements
  stripe={loadStripe('pk_test_xxx')}
  options={{ clientSecret: 'pi_abc_secret_xyz' }}
>
  <PaymentElement />
</Elements>`

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">Payment Element demo</h1>
      <p className="mt-2 text-lg text-gray-600">
        Example Payment Element initialisation
      </p>
      <div className="space-y-8">
        <SyntaxHighlighter language="jsx" style={oneDark}>
          {snippet}
        </SyntaxHighlighter>
        {clientSecret ? (
          <Elements
            stripe={loadStripe(
              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
            )}
            options={{ clientSecret }}
          >
            <PaymentElement />
          </Elements>
        ) : null}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:max-w-md space-y-8"
        >
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-gray-700">Currency</span>
              <select
                {...register('currency')}
                className="
                    block
                    w-full
                    mt-1
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              >
                <option value="gbp">GBP</option>
                <option value="eur">EUR</option>
                <option value="usd">USD</option>
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Amount</span>
              <input
                {...register('amount', {
                  valueAsNumber: true
                })}
                type="number"
                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              />
            </label>
          </div>
          <button
            disabled={!!clientSecret}
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Initialise Payment Element
          </button>
        </form>
      </div>
    </div>
  )
}
