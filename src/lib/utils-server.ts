'use server'

import payload from '@/lib/payload'
import { headers as NextHeaders } from 'next/headers'

export async function getUser() {
  const headers = await NextHeaders()
  const res = await payload.auth({ headers })

  return res.user || null
}
