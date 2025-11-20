import nodemailer from "nodemailer";

// Vercel serverless function to send email via SMTP (nodemailer)
// Expects these env vars to be set:
// MAILER_EMAIL, MAILER_PASSWORD, MAILER_HOST, MAILER_PORT, MAILER_SECURE

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { to, subject, text, html } = req.body || {};

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ success: false, message: "Missing required fields: to, subject, text/html" });
  }

  const host = process.env.MAILER_HOST;
  const port = process.env.MAILER_PORT ? parseInt(process.env.MAILER_PORT, 10) : undefined;
  const secure = String(process.env.MAILER_SECURE).toLowerCase() === "true";
  const user = process.env.MAILER_EMAIL;
  const pass = process.env.MAILER_PASSWORD;

  if (!host || !port || !user || !pass) {
    return res.status(500).json({ success: false, message: "Mailer is not configured on the server" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: user,
      to,
      subject,
      text,
      html,
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error("Error sending email:", err);
    return res.status(500).json({ success: false, message: err?.message || "Failed to send email" });
  }
}
