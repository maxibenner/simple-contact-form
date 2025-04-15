import FormDropdown from '@/components/form-dropdown'
import FormRecipientEditor from '@/components/form-recipient-editor'
import { Button } from '@/components/ui/button'
import payload from '@/lib/payload'
import { formatDate } from '@/lib/utils'
import { getUser } from '@/lib/utils-server'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function FormPage({ params }: { params: { team: string; form: string } }) {
  const awaitedParams = await params

  const user = await getUser()
  if (!user) return redirect('/login')

  const verifiedRecipients: { id: string; email: string; active: boolean }[] = []
  const formRecipients: { id: string; email: string }[] = []

  // Get form
  const formRes = await payload.findByID({
    overrideAccess: false,
    disableErrors: true,
    user,
    collection: 'forms',
    id: awaitedParams.form,
  })

  // Get reecipients
  const recipientRes = await payload.find({
    collection: 'recipients',
    overrideAccess: false,
    disableErrors: true,
    user,
    where: {
      verified: {
        equals: true,
      },
      team: {
        equals: awaitedParams.team,
      },
    },
  })

  // Parse form recipients
  if (formRes?.recipients) {
    formRes.recipients.forEach((doc) => {
      // Skip if doc is not an object
      if (typeof doc !== 'object') return

      // Add to formRecipients
      formRecipients.push({
        id: doc.id,
        email: doc.email,
      })
    })
  }

  // Parse verified recipients
  if (recipientRes?.docs) {
    recipientRes.docs.forEach((doc) => {
      // Skip if doc is not an object
      if (typeof doc !== 'object') return

      // Add to verifiedRecipients
      verifiedRecipients.push({
        id: doc.id,
        email: doc.email,
        active: formRecipients.some((recipient) => recipient.id === doc.id),
      })
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <Link href={`/${awaitedParams.team}/forms`}>
          <Button className="w-fit cursor-pointer" variant="link">
            <ChevronLeft />
            Back to forms
          </Button>
        </Link>
        <FormDropdown teamId={awaitedParams.team} formId={awaitedParams.form} />
      </div>
      <div className="mt-4">
        {!formRes ? (
          'Form not found'
        ) : (
          <div>
            <p className="text-sm text-gray-400 mb-1">Created {formatDate(formRes.createdAt)}</p>
            <h1 className="text-4xl font-bold mb-4">{formRes.name}</h1>
            <p className="mb-8 w-fit">
              Form ID:{' '}
              <span className="text-sm ml-2 p-2 px-4 rounded-sm bg-gray-200 text-gray-700">
                {formRes.id}
              </span>
            </p>
            <FormRecipientEditor
              teamId={awaitedParams.team}
              formId={formRes.id}
              recipients={verifiedRecipients}
            />
          </div>
        )}
      </div>
    </div>
  )
}
