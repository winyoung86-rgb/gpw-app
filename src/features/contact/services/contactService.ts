import { supabase } from "../../../lib/supabase";
import type { ContactFormData } from "../schemas/contactSchema";

const RATE_LIMIT_KEY = "gpw_contact_count";
const MAX_PER_SESSION = 3;

function getSubmissionCount(): number {
  return Number(sessionStorage.getItem(RATE_LIMIT_KEY) || "0");
}

function incrementSubmissionCount(): void {
  sessionStorage.setItem(RATE_LIMIT_KEY, String(getSubmissionCount() + 1));
}

export async function sendContactEmail(
  data: Omit<ContactFormData, "website">,
): Promise<void> {
  // Session-based rate limiting (UX convenience — server enforces the real limit)
  if (getSubmissionCount() >= MAX_PER_SESSION) {
    throw new Error(
      "You've reached the maximum number of messages for this session. Please try again later.",
    );
  }

  const { error } = await supabase.functions.invoke("send-contact-email", {
    body: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    },
  });

  if (error) {
    throw new Error(
      error.message || "Failed to send message. Please try again later.",
    );
  }

  incrementSubmissionCount();
}
