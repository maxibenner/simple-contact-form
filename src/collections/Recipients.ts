import type { CollectionConfig, PayloadRequest } from 'payload'
import { associatesOnly } from './utils/access'
import { VerifiationTokenField } from './custom-fields/verification-token'

export const Recipients: CollectionConfig = {
  slug: 'recipients',
  lockDocuments: false,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'verified',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
    },
    VerifiationTokenField,
  ],
  access: {
    create: ({ req, data }) => {
      // Check for authorization
      if (!associatesOnly({ req })) return false

      // Prevent users from setting the verified field to true
      // Local api is exempt from this check since it skips access checks
      if (data?.verified) return false

      return true
    },
    read: associatesOnly,
    update: ({ req, data }) => {
      // Chec for authorization
      if (!associatesOnly({ req })) return false

      // Prevent users from setting the verified field to true
      // Local api is exempt from this check since it skips access checks
      if (data?.verified) return false

      return true
    },
    delete: associatesOnly,
  },
  hooks: {
    afterOperation: [
      // Send an email to verify the recipient
      async ({ operation, req, result }) => {
        if (operation === 'create') {
          const { payload, user } = req
          const email = result.email
          const docId = result.id
          const { verificationToken } = await req.payload.findByID({
            collection: 'recipients',
            id: docId,
          })

          // Skip if user is trying to add their own email
          if (user?.email === email) {
            // Set the recipient to verified
            await payload.update({
              collection: 'recipients',
              data: {
                verified: true,
              },
              where: {
                id: { equals: docId },
              },
            })
            return
          }

          // Verification url
          const url =
            process.env.NEXT_PUBLIC_HOST_URL +
            '/api/recipients/' +
            docId +
            '/verify?token=' +
            verificationToken

          // Send verification email
          await payload.sendEmail({
            to: email,
            subject: 'Verify recipient email',
            html: `<p>Click <a href="${url}">here</a> to finish adding ${email} as a recipient email to Simple Contact Form.</p>`,
            text: `Copy the following url into your browser to finish adding ${email} as a recipient email to Simple Contact Form: ${url}`,
          })
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/:id/verify',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const docId = req.routeParams?.id
        const token = req.query.token

        if (docId && token) {
          // Check if the recipient is already verified
          const recipient = await req.payload.findByID({
            collection: 'recipients',
            id: docId.toString(),
          })

          if (recipient?.verified) {
            return Response.json('Recipient has already been verified.')
          }

          // Check if the token is valid
          if (recipient?.verificationToken !== token) {
            return Response.json('Invalid token.')
          }

          // Update the recipient to verified
          await req.payload.update({
            collection: 'recipients',
            data: {
              verified: true,
            },
            where: {
              id: { equals: docId },
            },
          })

          return Response.json('Successfully verified recipient email.')
        }

        return Response.json('Recipient verification failed.')
      },
    },
  ],
}
