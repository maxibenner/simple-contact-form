import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })
export default payload
