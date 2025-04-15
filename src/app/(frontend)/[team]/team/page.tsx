import TableHeaderMembers from '@/components/table-header-members'
import { HeaderPage } from '@/components/header-page'
import TableGridMembers, { Form } from '@/components/table-grid-members'
import payload from '@/lib/payload'
import { getUser } from '@/lib/utils-server'
import { notFound, redirect } from 'next/navigation'
import { AppUser, Invite } from '@/payload-types'

export default async function MembersPage({ params }: { params: { team: string } }) {
  const awaitedParams = await params

  const user = await getUser()
  if (!user) return redirect('/login')

  // Get team and invites concurrently
  const [teamRes, invitesRes] = await Promise.all([
    payload.findByID({
      collection: 'teams',
      id: awaitedParams.team,
    }),
    payload.find({
      overrideAccess: false,
      disableErrors: true,
      collection: 'invites',
      user,
      where: {
        team: {
          equals: awaitedParams.team,
        },
      },
    }),
  ])

  // Make sure all data is available
  if (!teamRes || !invitesRes.docs) return notFound()

  // Aggregate all users
  const owners: Form[] = []
  const members: Form[] = []
  const invitees: Form[] = []

  if (teamRes.owners) {
    teamRes.owners.forEach((el: AppUser | string) => {
      if (typeof el === 'object') {
        owners.push({
          id: el.id,
          email: el.email,
          role: 'Owner',
          status: 'Verified',
          self: user.email === el.email ? true : false,
        })
      }
    })
  }
  if (teamRes.members) {
    teamRes.members.forEach((el: AppUser | string) => {
      if (typeof el === 'object') {
        members.push({
          id: el.id,
          email: el.email,
          role: 'Member',
          status: 'Verified',
          self: user.email === el.email ? true : false,
        })
      }
    })
  }
  if (invitesRes.docs) {
    invitesRes.docs.forEach((el: Invite) => {
      if (typeof el === 'object') {
        invitees.push({
          id: el.id,
          email: el.email,
          role: el.role.charAt(0).toUpperCase() + el.role.slice(1),
          status: 'Pending',
          self: false,
        })
      }
    })
  }

  const data = [...owners, ...members, ...invitees]

  const role = data.filter((el) => el.id === user.id)[0].role

  return (
    <>
      <HeaderPage title="Members" />
      <div className="p-4 lg:px-6">
        <TableHeaderMembers teamName={teamRes.name} userRole={role} />
        <TableGridMembers teamId={awaitedParams.team} data={data} userRole={role} />
      </div>
    </>
  )
}
