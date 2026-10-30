import { Resend } from "resend";

let resendClient;

function getResendClient() {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

// Sender and reply address come from Vercel (EMAIL_FROM / REPLY_TO_EMAIL), never typed here.
const FROM = process.env.EMAIL_FROM || process.env.SMTP_FROM || "833PROBAID® <info@833probaid.com>";
const REPLY_TO = process.env.REPLY_TO_EMAIL || "info@833probaid.com";

// Escape anything inserted into the email HTML so a name like "<script>" can't inject code.
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function sendOtpEmail({ to, code, subject, templateData = {} }) {
  try {
    const resend = getResendClient();

    const htmlContent = `
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2933;">
			<h2>Security Verification Code</h2>
			<p>Hello ${esc(templateData.name)},</p>
			<p>Use this code to ${esc(templateData.purpose || "complete your secure action")}:</p>
			<p style="font-size: 24px; font-weight: bold; letter-spacing: 0.2em;">${esc(code)}</p>
			<p>This code will expire in 10 minutes. Do not share it with anyone.</p>
			<p>If you did not request this code, please contact support immediately.</p>
			<p>Regards,<br/><span style="color:#0097A7;font-weight:800">833PROBAID<sup style="font-size:.6em">®</sup></span> Security Team</p>
		</div>
	`;

    const info = await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to,
      subject,
      html: htmlContent,
    });

    if (info?.error) {
      throw new Error(info.error.message || "Resend rejected the email");
    }

    console.log("✅ Email sent successfully:", info?.data?.id || info?.id);
    return info;
  } catch (error) {
    const message = error?.message || "Unknown email error";
    console.error("❌ Failed to send email:", message);
    throw new Error(`Email delivery failed: ${message}`);
  }
}
