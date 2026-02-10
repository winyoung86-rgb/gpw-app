import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  subject: z.enum(
    [
      'General Inquiry',
      'Event Suggestion',
      'Bug Report',
      'Partnership',
      'Other',
    ],
    { message: 'Please select a subject' },
  ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters'),
  // Honeypot — hidden from real users, bots auto-fill it
  website: z.string().max(0, 'Bot detected').optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
