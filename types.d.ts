import { HTMLAttributes } from 'react'

declare module 'stripe' {
  namespace Stripe {
    interface CustomerSession {
      id: string
      object: 'customer_session'
      livemode: boolean
      client_secret: string
      customer: string | Stripe.Customer
      expires_at: number
    }
    interface CustomerSessionCreateParams {
      customer: string
    }
  }
}

interface PricingTable extends React.DetailedHTMLProps {
  'customer-session-client-secret'?: string
  'pricing-table-id': string
  'publishable-key': string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': PricingTable
    }
  }
}
