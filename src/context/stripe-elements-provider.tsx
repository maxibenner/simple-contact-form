'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useState, createContext, useContext } from 'react'

interface SetupIntentContextValue {
  // clientSecret: string | null
}

const SetupIntentContext = createContext<SetupIntentContextValue | undefined>(undefined)

// Custom hook to access the setup intent context
export function useSetupIntent() {
  const context = useContext(SetupIntentContext)
  if (!context) {
    throw new Error('useSetupIntent must be used within a StripeElementsProvider')
  }
  return context
}

export default function StripeElementsProvider({
  children,
  email,
}: {
  children: React.ReactNode
  email: string
}) {
  const [stripePromise] = useState(loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!))
  // const [clientSecret, setClientSecret] = useState<string | null>(null)
  // const [error, setError] = useState<string | null>(null)

  // Get client secret from your backend
  // useEffect(() => {
  //   createSetupIntent(email).then((data) => {
  //     if (data.error) setError(data.error)
  //     else setClientSecret(data.clientSecret)
  //   })
  // }, [email])

  // if (error)
  //   return (
  //     <div className="bg-green-400 p-4 rounded-md text-center md:w-[400px] mx-auto">{error}</div>
  //   )

  return (
    <Elements stripe={stripePromise}>
      {/* <SetupIntentContext.Provider> */}
      {children}
      {/* </SetupIntentContext.Provider> */}
    </Elements>
  )
}

// async function createSetupIntent(email: string) {
//   const res = await fetch('/api/create-setup-intent', {
//     method: 'POST',
//     body: JSON.stringify({ email }),
//   })

//   return await res.json()
// }
