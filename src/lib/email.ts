export type SendEmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail(payload: SendEmailPayload) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || "Failed to send email");
  }

  return res.json();
}
