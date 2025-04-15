import payload from '@/lib/payload'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
})

export async function GET(request: Request) {
  let email = ''
  let token = ''

  try {
    // Get query parameter "token" from the request
    const tokenArray = request.url
      .split('?')[1] // Get the query string
      .split('&') // Split into individual parameters

    const tempToken = tokenArray.find((param) => param.startsWith('token'))?.split('=')[1] // Get the token value
    const tempEmail = tokenArray.find((param) => param.startsWith('email'))?.split('=')[1] // Get the email value

    if (!tempToken || !tempEmail) {
      return Response.json({ error: 'Invalid token' }, { status: 400 })
    }

    email = tempEmail
    token = tempToken

    const isVerified = await payload.verifyEmail({
      collection: 'app-users',
      token,
    })

    if (!isVerified) {
      return redirect(
        `/verification-failure?email=${email}&error=${JSON.stringify(
          'Email verification failed. Token might be expired or invalid.',
        )}`,
      )
    }

    // Create stripe customer
    const customer = await stripe.customers.list({ email })

    // Create new customer if it doesn't exist
    if (!customer.data.length) {
      const newCustomer = await stripe.customers.create({
        email,
      })
      customer.data.push(newCustomer)

      if (!newCustomer.id) {
        console.error(`${email}: Failed to create stripe customer`)
        throw new Error('Failed to create stripe customer')
      }
    }

    // Add stripe customer ID to the user
    // Get user
    const user = await payload.find({
      collection: 'app-users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    await payload.update({
      collection: 'app-users',
      id: user.docs[0].id,
      data: {
        stripeCustomerId: customer.data[0].id,
      },
    })
    console.log(`${email}: Stripe customer ID added to user`)
  } catch (error) {
    // Log error details for debugging and return a generic error message
    console.error('Error during email verification:', error)
    return redirect(`/verification-failure?email=${email}&error=${JSON.stringify(error)}`) // Redirect to a failure page with error details
  } finally {
    return redirect('/login')
  }
}
