import TableHeaderRecipients from '@/components/table-header-recipients'
import { HeaderPage } from '@/components/header-page'
import TableGridRecipients, { Form } from '@/components/table-grid-recipients'
import payload from '@/lib/payload'
import { getUser } from '@/lib/utils-server'
import { ColumnDef } from '@tanstack/react-table'
import { redirect } from 'next/navigation'

export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]

export default async function FormsPage({ params }: { params: { team: string } }) {
  const awaitedParams = await params

  const user = await getUser()
  if (!user) return redirect('/login')

  // Get forms
  const res = await payload.find({
    overrideAccess: false,
    disableErrors: true,
    collection: 'recipients',
    user,
    where: {
      team: {
        equals: awaitedParams.team,
      },
    },
  })

  const data = res.docs.map((doc) => {
    return {
      id: doc.id,
      email: doc.email,
      status: doc.verified || false,
    } as Form
  })

  return (
    <>
      <HeaderPage title="Recipients" />
      <div className="p-4 lg:px-6">
        <TableHeaderRecipients />
        <TableGridRecipients columns={columns} data={data} />
      </div>
    </>
  )
}
