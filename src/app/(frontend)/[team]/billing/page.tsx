import { HeaderPage } from '@/components/header-page'
import CreditBalance from './credit-balance'
import PaymentMethods from './payment-methods'
import CreditTopUp from './credit-top-up'
import { headers } from 'next/headers'
import payload from '@/lib/payload'
import AutoRecharge from './auto-recharge'

export default async function BillingPage({ params }: { params: { team: string } }) {
  const { team } = await params
  const _headers = await headers()
  const host = _headers.get('x-forwarded-host')
  const protocol = _headers.get('x-forwarded-proto')

  // Get user
  const authResult = await payload.auth({ headers: _headers })

  // Check if user exists
  if (!authResult.user) {
    return (
      <div className="bg-red-400 p-4 rounded-md text-center md:w-[400px] mx-auto">
        You need to be logged in to access this page.
      </div>
    )
  }

  const { balance, autoRecharge } = await payload.findByID({
    collection: 'teams',
    id: team,
  })

  const paymentMethod = await payload.find({
    collection: 'payment-methods',
    where: {
      team: {
        equals: team,
      },
    },
    limit: 1,
  })

  return (
    <>
      <HeaderPage title="Billing" description="Manage your credits and payment methods" />
      <div className="p-4 lg:px-6 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <CreditBalance amount={balance ? balance : 0} />
          <CreditTopUp
            host={host}
            protocol={protocol}
            user={authResult.user}
            paymentMethods={paymentMethod.docs}
          />
          <AutoRecharge
            autoRecharge={autoRecharge || false}
            teamId={team}
            paymentMethods={paymentMethod.docs}
          />
        </div>
        <PaymentMethods data={paymentMethod.docs} user={authResult.user} />
      </div>
    </>
  )
}
