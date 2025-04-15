import { z } from 'zod'

export const SignupFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Your password must be at least 8 characters long.' })
    .trim(),
})

export const LoginFormSchema = z.object({
  email: z.string().trim(),
  password: z.string().trim(),
})

export type FormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
