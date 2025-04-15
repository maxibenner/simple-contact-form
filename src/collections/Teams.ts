import type { CollectionConfig, PayloadRequest, Where } from 'payload'

export const Teams: CollectionConfig = {
  slug: 'teams',
  lockDocuments: false,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'app-users',
      hasMany: true,
    },
    {
      name: 'owners',
      type: 'relationship',
      relationTo: 'app-users',
      hasMany: true,
    },
    {
      name: 'balance',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Current balance in cents',
      },
    },
    {
      name: 'autoRecharge',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Automatically adds $5 when the balance falls below 25 cents.',
      },
    },
    {
      name: 'forms',
      type: 'join',
      collection: 'forms',
      on: 'team',
    },
    {
      name: 'paymentMethod',
      type: 'join',
      collection: 'payment-methods',
      on: 'team',
    },
  ],
  access: {
    create: ({ req: { user }, data }) => {
      // Allow admin access
      if (user?.collection === 'users') return true

      // Make sure users can not add owners arbitrarily
      if (data?.owners)
        throw new Error('You can not add owners to a team. This is done automatically.')

      return true
    },
    read: isOwnerOrMember,
    update: isOwner,
    delete: isOwner,
  },
  hooks: {
    beforeChange: [
      //Automatically add creating user as owner
      ({ req: { user }, data }) => {
        if (user?.collection === 'app-users') {
          return {
            ...data,
            owners: [user.id],
          }
        }
        return data
      },
    ],
  },
  endpoints: [
    // Initialize the payload invitation flow
    {
      path: '/:id/members/:memberId',
      method: 'delete',
      handler: async (req: PayloadRequest) => {
        const teamId = req.routeParams?.id as string | undefined
        const memberId = req.routeParams?.memberId as string | undefined

        // Make sure ids exist
        if (!teamId || !memberId) {
          return Response.json({ message: 'Team or member ID not provided' }, { status: 404 })
        }

        // Get team
        const teamRes = await req.payload.findByID({
          collection: 'teams',
          id: teamId,
        })

        // Check if team exists
        // Note: Owner check is already handled by the access control
        if (!teamRes) {
          return Response.json({ message: 'Team not found' }, { status: 404 })
        }

        // Construct new data with filtered members and owners
        const data = {
          ...teamRes,
          members: teamRes.members?.filter((member) => {
            if (typeof member !== 'object') return false
            return member.id !== memberId
          }),
          owners: teamRes.owners?.filter((owner) => {
            if (typeof owner !== 'object') return false
            return owner.id !== memberId
          }),
        }

        // Update team
        const teamUpdateRes = await req.payload.update({
          collection: 'teams',
          id: teamId,
          data,
        })

        // Check if team was updated
        if (!teamUpdateRes) {
          return Response.json({ message: 'Team not found' }, { status: 404 })
        }

        return Response.json({ message: 'Member removed' }, { status: 200 })
      },
    },
  ],
}

function isOwner({ req }: { req: PayloadRequest }) {
  const user = req.user

  // Allow unrestricted access for admins
  if (user?.collection === 'users') return true

  // Only allow authenticated access
  if (!user) return false

  // Only allow owners to delete the team
  return {
    or: [
      {
        owners: {
          contains: user,
        },
      },
    ],
  } as Where
}

async function isOwnerOrMember({ req }: { req: PayloadRequest }) {
  const user = req.user

  // Allow unrestricted access for admins
  if (user?.collection === 'users') return true

  // Only allow authenticated access
  if (!user) return false

  // Only return teams that the user is a member or owner of
  return {
    or: [
      {
        members: {
          contains: user,
        },
      },
      {
        owners: {
          contains: user,
        },
      },
    ],
  } as Where
}
