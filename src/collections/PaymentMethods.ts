import type { CollectionConfig } from 'payload'
import { adminsOnly, ownersOnly } from './utils/access'

export const PaymentMethods: CollectionConfig = {
  slug: 'payment-methods',
  lockDocuments: false,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'cardBrand',
          type: 'text',
          required: true,
        },
        {
          name: 'lastFour',
          label: 'Last 4 digits',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'expiryMonth',
          label: 'Expiry month',
          type: 'number',
          required: true,
        },
        {
          name: 'expiryYear',
          label: 'Expiry year',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'app-users',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stripePaymentMethodId',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'stripeCustomerId',
          type: 'text',
          required: true,
        },
        {
          name: 'stripeFingerprint',
          type: 'text',
          required: true,
        },
      ],
    },

    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
    },
  ],
  access: {
    create: adminsOnly,
    read: ownersOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
}
