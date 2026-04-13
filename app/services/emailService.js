import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
	if (transporter) {
		return transporter;
	}

	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE } =
		process.env;

	if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
		throw new Error("SMTP configuration is incomplete");
	}

	transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT),
		secure: SMTP_SECURE === "true",
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASSWORD,
		},
		tls: {
			rejectUnauthorized: true,
		},
	});

	return transporter;
}

export async function sendOtpEmail({ to, code, subject, templateData = {} }) {
	try {
		const mailTransporter = getTransporter();

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

		const info = await mailTransporter.sendMail({
			from: process.env.SMTP_FROM || `833 PROBAID <${process.env.SMTP_USER}>`,
			to,
			subject,
			html: htmlContent,
		});

		console.log("✅ Email sent successfully:", info.messageId);
		return info;
	} catch (error) {
		console.error("❌ Failed to send email:", error.message);
		throw new Error(`Email delivery failed: ${error.message}`);
	}
}
