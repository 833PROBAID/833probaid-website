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

export async function sendOtpEmail({ to, code, subject, templateData = {} }) {
	try {
		const resend = getResendClient();
		const from =
			process.env.RESEND_FROM_EMAIL ||
			process.env.SMTP_FROM ||
			"833 PROBAID <onboarding@resend.dev>";

		const htmlContent = `
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2933;">
			<h2>Security Verification Code</h2>
			<p>Hello ${templateData.name || ""},</p>
			<p>Use this code to ${templateData.purpose || "complete your secure action"}:</p>
			<p style="font-size: 24px; font-weight: bold; letter-spacing: 0.2em;">${code}</p>
			<p>This code will expire in 10 minutes. Do not share it with anyone.</p>
			<p>If you did not request this code, please contact support immediately.</p>
			<p>Regards,<br/>833PROBAID Security Team</p>
		</div>
	`;

		const info = await resend.emails.send({
			from,
			to,
			subject,
			html: htmlContent,
		});

		console.log("✅ Email sent successfully:", info?.data?.id || info?.id);
		return info;
	} catch (error) {
		const message = error?.message || "Unknown email error";
		console.error("❌ Failed to send email:", message);
		throw new Error(`Email delivery failed: ${message}`);
	}
}
