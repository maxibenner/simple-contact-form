import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
})

/**
 * Check if Stripe customer has a payment method
 * @param {string} email - Email address of customer
 */
export async function checkPaymentMethod(email: string) {
  const customer = await stripe.customers.list({ email })
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customer.data[0].id,
  })

  return paymentMethods.data.length === 0 ? false : true
}
