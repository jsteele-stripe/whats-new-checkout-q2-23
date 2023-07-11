import type { NextPage } from 'next'

import * as React from 'react'

import CustomerSessionSection from '@/components/customer-session-section'
import CheckoutSection from '@/components/checkout-section'

export default function Index({}: NextPage) {
  return (
    <div className="mx-auto">
      <div className="py-8">
        <h1 className="text-4xl font-bold">
          What's new in Checkout and Payment Links? Q2 2023
        </h1>
        <div className="divide-y">
          <CustomerSessionSection />
          <CheckoutSection />
        </div>
      </div>
    </div>
  )
}
