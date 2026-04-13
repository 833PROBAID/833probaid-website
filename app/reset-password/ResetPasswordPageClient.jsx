"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function ResetPasswordPage() {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [infoMessage, setInfoMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState("request");
	const router = useRouter();
	const { requestPasswordReset, completePasswordReset } = useAuth();

	const handleRequestSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setInfoMessage("");
		setLoading(true);

		try {
			const result = await requestPasswordReset({ email });
			if (result.success) {
				setStep("verify");
				setInfoMessage(
					result.message || "Check your email for the reset verification code.",
				);
			} else {
				setError(result.error || "Unable to process reset request");
			}
		} catch (err) {
			console.error("Password reset request error:", err);
			setError("An error occurred while requesting the reset");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifySubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);

		try {
			const result = await completePasswordReset({ email, code: otp, password });
			if (result.success) {
				setInfoMessage("Password updated successfully. Redirecting...");
				setTimeout(() => router.push("/dashboard"), 1200);
			} else {
				setError(result.error || "Invalid verification code");
			}
		} catch (err) {
			console.error("Password reset verify error:", err);
			setError("Unable to verify and reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10 px-4'>
			<div className='w-full max-w-md'>
				<div className='mb-8 text-center'>
					<Link href='/'>
						<img src='/images/footer-logo.png' alt='Logo' className='mx-auto mb-4 h-16' />
					</Link>
					<h1 className='font-anton text-3xl text-gray-800'>Reset Password</h1>
					<p className='font-montserrat mt-2 text-gray-600'>Securely recover access to your account</p>
				</div>

				<div className='rounded-2xl bg-white p-8 shadow-xl'>
					<form
						onSubmit={step === "request" ? handleRequestSubmit : handleVerifySubmit}
						className='space-y-6'>
						{infoMessage && !error && (
							<div className='rounded-lg bg-green-50 p-4 text-sm text-green-700'>{infoMessage}</div>
						)}
						{error && (
							<div className='rounded-lg bg-red-50 p-4 text-sm text-red-600'>{error}</div>
						)}

						{step === "request" && (
							<div>
								<label htmlFor='email' className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
									Email Address
								</label>
								<input
									id='email'
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
									placeholder='Enter the email associated with your account'
								/>
								<p className='font-montserrat mt-2 text-xs text-gray-500'>If we find your email, we will send reset instructions with a verification code.</p>
							</div>
						)}

						{step === "verify" && (
							<>
								<div>
									<label htmlFor='otp' className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
										Verification Code
									</label>
									<input
										id='otp'
										type='text'
										value={otp}
										onChange={(e) => setOtp(e.target.value)}
										required
										inputMode='numeric'
										pattern='[0-9]{6}'
										maxLength={6}
										className='tracking-widest w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
										placeholder='Enter 6-digit code'
									/>
									<p className='font-montserrat mt-2 text-xs text-gray-500'>Enter the code sent to {email}.</p>
								</div>

								<div>
									<label htmlFor='password' className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
										New Password
									</label>
									<input
										id='password'
										type='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
										placeholder='Create a new password'
									/>
								</div>

								<div>
									<label htmlFor='confirmPassword' className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
										Confirm New Password
									</label>
									<input
										id='confirmPassword'
										type='password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
										placeholder='Re-enter your new password'
									/>
								</div>
							</>
						)}

						<button
							type='submit'
							disabled={loading}
							className='w-full rounded-lg bg-primary py-3 font-montserrat font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'>
							{loading ? (
								<span className='flex items-center justify-center'>
									<svg className='mr-2 h-5 w-5 animate-spin' fill='none' viewBox='0 0 24 24'>
										<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
									</svg>
									{step === "request" ? "Sending" : "Updating"}...
								</span>
							) : step === "request" ? (
								"Send Reset Instructions"
							) : (
								"Verify & Update Password"
							)}
						</button>
					</form>
				</div>

				<div className='mt-6 space-y-2 text-center'>
					<Link href='/login' className='font-montserrat block text-sm text-gray-600 hover:text-primary'>
						Return to sign in
					</Link>
					<Link href='/' className='font-montserrat block text-sm text-gray-600 hover:text-primary'>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
