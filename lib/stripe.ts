import Stripe from 'stripe'

export default new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
})
class CustomerSessions extends Stripe.StripeResource.extend({}) {
  create = Stripe.StripeResource.method({
    method: 'POST',
    path: '/customer_sessions'
  }) as (
    params: Stripe.CustomerSessionCreateParams,
    options?: Stripe.RequestOptions
  ) => Promise<Stripe.Response<Stripe.CustomerSession>>
}

class StripeBeta extends Stripe {
  customerSessions: CustomerSessions

  constructor(key: string, opts: Stripe.StripeConfig) {
    super(key, opts)
    this.customerSessions = new CustomerSessions(this)
  }
}

export const betaStripe = new StripeBeta(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: '2022-11-15'
  }
)
