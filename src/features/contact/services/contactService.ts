import emailjs from '@emailjs/browser'
import type { ContactFormData } from '../schemas/contactSchema'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const RATE_LIMIT_KEY = 'gpw_contact_count'
const MAX_PER_SESSION = 3

function getSubmissionCount(): number {
  return Number(sessionStorage.getItem(RATE_LIMIT_KEY) || '0')
}

function incrementSubmissionCount(): void {
  sessionStorage.setItem(RATE_LIMIT_KEY, String(getSubmissionCount() + 1))
}

export async function sendContactEmail(
  data: Omit<ContactFormData, 'website'>,
): Promise<void> {
  // Session-based rate limiting
  if (getSubmissionCount() >= MAX_PER_SESSION) {
    throw new Error(
      'You\'ve reached the maximum number of messages for this session. Please try again later.',
    )
  }

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('Email service is not configured. Please try again later.')
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    },
    { publicKey: PUBLIC_KEY },
  )

  incrementSubmissionCount()
}
