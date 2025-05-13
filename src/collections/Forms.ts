import type { CollectionConfig } from 'payload'
import { associatesOnly, ownersOnly } from './utils/access'
import { v4 as uuidv4 } from 'uuid'

export const Forms: CollectionConfig = {
  slug: 'forms',
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
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
    },
    {
      name: 'recipients',
      type: 'relationship',
      relationTo: 'recipients',
      hasMany: true,
    },
    {
      name: 'id',
      type: 'text',
      unique: true,
      // Auto generate if not provided
      hooks: {
        beforeValidate: [
          async ({ value }) => {
            if (!value) return uuidv4()
            return value
          },
        ],
      },
    },
  ],
  access: {
    create: associatesOnly,
    read: associatesOnly,
    update: associatesOnly,
    delete: ownersOnly,
  },
}
