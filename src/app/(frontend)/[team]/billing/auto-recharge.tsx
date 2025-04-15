'use client'

import SubmitButton from '@/components/button-submit'
import { Card, CardContent } from '@/components/ui/card'
import { PaymentMethod } from '@/payload-types'
import { CircleCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AutoRecharge({
  autoRecharge,
  teamId,
  paymentMethods,
}: {
  autoRecharge: boolean
  teamId: string
  paymentMethods: PaymentMethod[] | []
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const hasPaymentMethod = paymentMethods.length > 0

  async function toggleAutoRecharge() {
    setLoading(true)

    const res = await fetch(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        autoRecharge: !autoRecharge,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      toast.success(`Auto recharge is ${autoRecharge ? 'turned off' : 'turned on'}.`)
      router.refresh()
    } else {
      console.log(data)
      toast.error(data.errors[0].message)
    }

    setLoading(false)
  }

  return (
    <Card className={`relative overflow-hidden ${!hasPaymentMethod && 'pb-0'}`}>
      <CardContent className={`flex justify-between gap-4 ${!hasPaymentMethod && 'opacity-30'}`}>
        <div className="flex gap-2">
          <CircleCheck
            className={`shrink-0 w-[18px] ${autoRecharge ? 'text-blue-500' : 'text-muted-foreground'}`}
          />
          <div className="w-fit">
            <h3 className="font-semibold">Auto recharge {autoRecharge ? 'is on' : 'is off'}</h3>
            <p className="text-sm text-muted-foreground">
              Automatically adds $5 every time your balance falls below 25 cents.
            </p>
          </div>
        </div>
        <SubmitButton
          loading={loading}
          disabled={paymentMethods.length === 0}
          onClick={toggleAutoRecharge}
          className="self-center"
          variant={autoRecharge ? 'secondary' : 'default'}
        >
          {autoRecharge ? 'Turn off' : 'Turn on'}
        </SubmitButton>
      </CardContent>
      {/* Unavailability message */}
      {!hasPaymentMethod && (
        <div className="text-sm p-4 py-2 bg-amber-400 w-full">
          Add a saved payment method to enable auto recharge.
        </div>
      )}
    </Card>
  )
}
