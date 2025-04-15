import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  lockDocuments: false,
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
