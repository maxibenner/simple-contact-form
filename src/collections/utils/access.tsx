import { PayloadRequest, Where } from 'payload'

/**
 * Enforces the following access rules:
 * - Users must be authenticated
 * - Users must be an admin OR a owner/member of the associated team
 *
 * @param req - The request object
 * @returns
 */
export function associatesOnly({ req }: { req: PayloadRequest }) {
  const { user } = req

  // Allow unrestricted access for admins
  if (user?.collection === 'users') return true

  // Only allow authenticated access
  if (!user) return false

  // Only return true if the user is a member or owner of the team
  return {
    or: [
      {
        'team.members': {
          contains: user,
        },
      },
      {
        'team.owners': {
          contains: user,
        },
      },
    ],
  } as Where
}

/**
 * Enforces the following access rules:
 * - Users must be authenticated
 * - Users must be an admin OR a owner of the associated team
 *
 * @param req - The request object
 * @returns
 */
export function ownersOnly({ req }: { req: PayloadRequest }) {
  const { user } = req

  // Allow unrestricted access for admins
  if (user?.collection === 'users') return true

  // Only allow authenticated access
  if (!user) return false

  // Only return true if the user is a member or owner of the team
  return {
    'team.owners': {
      contains: user,
    },
  } as Where
}

/**
 * Allows only admin users or local API to access the collection
 * @param req - The request object
 */
export function adminsOnly({ req }: { req: PayloadRequest }) {
  const { user } = req

  // Allow unrestricted access for admins
  if (user?.collection === 'users') return true

  return false
}
