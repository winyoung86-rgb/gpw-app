import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassCard } from '../../../shared/components/ui/GlassCard'
import { Button } from '../../../shared/components/ui/Button'
import { Toast } from '../../../shared/components/ui/Toast'
import { useToast } from '../../../shared/hooks/useToast'
import { contactSchema, type ContactFormData } from '../schemas/contactSchema'
import { sendContactEmail } from '../services/contactService'
import {
  trackPageView,
  trackContactFormSubmit,
  trackContactFormSuccess,
  trackContactFormError,
} from '../../../utils/analytics'

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Event Suggestion',
  'Bug Report',
  'Partnership',
  'Other',
] as const

export function ContactPage() {
  const { toast, showToast, hideToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: undefined,
      message: '',
      website: '',
    },
  })

  useEffect(() => {
    trackPageView('/contact')
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check — silently "succeed" so bots think it worked
    if (data.website) {
      showToast('Message sent! We\'ll get back to you soon.', 'success')
      reset()
      return
    }

    trackContactFormSubmit(data.subject)

    try {
      const { website: _, ...formData } = data
      await sendContactEmail(formData)
      trackContactFormSuccess()
      showToast('Message sent! We\'ll get back to you soon.', 'success')
      reset()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      trackContactFormError(message)
      showToast(message, 'error')
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <Helmet>
        <title>Contact Us — Gay Party Weekend</title>
        <meta name="description" content="Get in touch with the Gay Party Weekend team. Send us event suggestions, report issues, or inquire about partnerships." />
        <link rel="canonical" href="https://gaypartyweekend.com/contact" />
        <meta property="og:title" content="Contact Us — Gay Party Weekend" />
        <meta property="og:description" content="Get in touch with the Gay Party Weekend team. Send us event suggestions, report issues, or inquire about partnerships." />
        <meta property="og:url" content="https://gaypartyweekend.com/contact" />
        <meta property="og:image" content="https://gaypartyweekend.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Gay Party Weekend" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us — Gay Party Weekend" />
        <meta name="twitter:description" content="Get in touch with the Gay Party Weekend team. Send us event suggestions, report issues, or inquire about partnerships." />
        <meta name="twitter:image" content="https://gaypartyweekend.com/og-image.png" />
      </Helmet>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <GlassCard className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl neon-glow mb-3">Contact Us</h1>
          <p className="text-text-secondary text-sm">
            Have a question, event suggestion, or just want to say hi? Drop us a
            line.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Honeypot — visually hidden, tab-skipped */}
          <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('website')}
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className={`glass-input ${errors.name ? 'glass-input-error' : ''}`}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-pink text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`glass-input ${errors.email ? 'glass-input-error' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-pink text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm text-text-secondary mb-1.5">
              Subject
            </label>
            <select
              id="subject"
              className={`glass-input ${errors.subject ? 'glass-input-error' : ''}`}
              defaultValue=""
              {...register('subject')}
            >
              <option value="" disabled>
                Select a subject...
              </option>
              {SUBJECT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-pink text-xs mt-1">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm text-text-secondary mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us what's on your mind..."
              className={`glass-input resize-none ${errors.message ? 'glass-input-error' : ''}`}
              {...register('message')}
            />
            {errors.message && (
              <p className="text-pink text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className={`w-full ${!isSubmitting ? 'btn-shimmer' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-text-muted hover:text-white transition-colors"
          >
            &larr; Back to planner
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
